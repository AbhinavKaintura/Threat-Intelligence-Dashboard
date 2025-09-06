import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { IOC, IOCStats, FilterOptions, SortOptions, PaginationOptions } from '@/types/ioc';
import { formatDistanceToNow } from 'date-fns';

interface IOCStore {
  // State
  iocs: IOC[];
  filteredIOCs: IOC[];
  paginatedIOCs: IOC[];
  stats: IOCStats | null;
  isLoading: boolean;
  error: string | null;
  filters: FilterOptions;
  sort: SortOptions;
  pagination: PaginationOptions;
  lastFetch: string | null;

  // Actions
  setIOCs: (iocs: IOC[]) => void;
  addIOCs: (iocs: IOC[]) => void;
  updateFilters: (filters: Partial<FilterOptions>) => void;
  updateSort: (sort: SortOptions) => void;
  updatePagination: (pagination: Partial<PaginationOptions>) => void;
  clearFilters: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  refreshData: () => Promise<void>;
  
  // Internal methods
  applyFiltersAndSort: () => void;
  calculateStats: () => void;
}

const initialFilters: FilterOptions = {
  search: '',
  types: [],
  sources: [],
  severities: [],
};

const initialSort: SortOptions = {
  field: 'timestamp',
  direction: 'desc',
};

const initialPagination: PaginationOptions = {
  page: 1,
  limit: 25,
  total: 0,
};

export const useIOCStore = create<IOCStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial State
        iocs: [],
        filteredIOCs: [],
        paginatedIOCs: [],
        stats: null,
        isLoading: false,
        error: null,
        filters: initialFilters,
        sort: initialSort,
        pagination: initialPagination,
        lastFetch: null,

        // Actions
        setIOCs: (iocs) => {
          set({ 
            iocs, 
            lastFetch: new Date().toISOString(),
            error: null 
          });
          get().calculateStats();
          get().applyFiltersAndSort();
        },

        addIOCs: (newIOCs) => {
          const { iocs } = get();
          const merged = mergeAndDeduplicateIOCs([...iocs, ...newIOCs]);
          set({ 
            iocs: merged, 
            lastFetch: new Date().toISOString() 
          });
          get().calculateStats();
          get().applyFiltersAndSort();
        },

        updateFilters: (newFilters) => {
          const filters = { ...get().filters, ...newFilters };
          set({ 
            filters, 
            pagination: { ...get().pagination, page: 1 } // Reset to first page
          });
          get().applyFiltersAndSort();
        },

        updateSort: (sort) => {
          set({ sort });
          get().applyFiltersAndSort();
        },

        updatePagination: (newPagination) => {
          const pagination = { ...get().pagination, ...newPagination };
          set({ pagination });
          get().applyPagination();
        },

        clearFilters: () => {
          set({ 
            filters: initialFilters,
            pagination: { ...get().pagination, page: 1 }
          });
          get().applyFiltersAndSort();
        },

        setLoading: (isLoading) => set({ isLoading }),
        setError: (error) => set({ error }),

        refreshData: async () => {
          const { setLoading, setError, setIOCs } = get();
          
          try {
            setLoading(true);
            setError(null);
            
            const response = await fetch('/api/iocs');
            if (!response.ok) {
              throw new Error('Failed to fetch IOCs');
            }
            
            const data = await response.json();
            setIOCs(data.iocs || []);
          } catch (error) {
            setError(error instanceof Error ? error.message : 'Unknown error');
          } finally {
            setLoading(false);
          }
        },

        // Internal Methods
        applyFiltersAndSort: () => {
          const { iocs, filters, sort } = get();
          
          let filtered = applyFilters(iocs, filters);
          filtered = applySorting(filtered, sort);
          
          set({ 
            filteredIOCs: filtered,
            pagination: { ...get().pagination, total: filtered.length, page: 1 }
          });
          
          get().applyPagination();
        },

        applyPagination: () => {
          const { filteredIOCs, pagination } = get();
          const startIndex = (pagination.page - 1) * pagination.limit;
          const endIndex = startIndex + pagination.limit;
          const paginatedIOCs = filteredIOCs.slice(startIndex, endIndex);
          
          set({ paginatedIOCs });
        },

        calculateStats: () => {
          const { iocs } = get();
          const stats = calculateIOCStats(iocs);
          set({ stats });
        },
      }),
      {
        name: 'ioc-storage',
        partialize: (state) => ({
          iocs: state.iocs,
          filters: state.filters,
          sort: state.sort,
          pagination: { ...state.pagination, page: 1 }, // Don't persist current page
          lastFetch: state.lastFetch,
        }),
      }
    ),
    {
      name: 'IOC Store'
    }
  )
);

// Helper Functions
function mergeAndDeduplicateIOCs(iocs: IOC[]): IOC[] {
  const seen = new Map<string, IOC>();
  
  iocs.forEach(ioc => {
    const key = `${ioc.value.toLowerCase()}-${ioc.type}`;
    const existing = seen.get(key);
    
    if (!existing || new Date(ioc.timestamp) > new Date(existing.timestamp)) {
      seen.set(key, {
        ...ioc,
        id: ioc.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      });
    }
  });
  
  return Array.from(seen.values());
}

function applyFilters(iocs: IOC[], filters: FilterOptions): IOC[] {
  return iocs.filter(ioc => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const searchableText = [
        ioc.value,
        ioc.source,
        ioc.description || '',
        ...(ioc.tags || [])
      ].join(' ').toLowerCase();
      
      if (!searchableText.includes(searchLower)) {
        return false;
      }
    }

    // Type filter
    if (filters.types.length > 0 && !filters.types.includes(ioc.type)) {
      return false;
    }

    // Source filter
    if (filters.sources.length > 0 && !filters.sources.includes(ioc.source)) {
      return false;
    }

    // Severity filter
    if (filters.severities.length > 0 && ioc.severity && !filters.severities.includes(ioc.severity)) {
      return false;
    }

    // Date range filter
    if (filters.dateRange) {
      const iocDate = new Date(ioc.timestamp);
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      
      if (iocDate < startDate || iocDate > endDate) {
        return false;
      }
    }

    // Confidence range filter
    if (filters.confidenceRange && ioc.confidence !== undefined) {
      if (ioc.confidence < filters.confidenceRange.min || ioc.confidence > filters.confidenceRange.max) {
        return false;
      }
    }

    return true;
  });
}

function applySorting(iocs: IOC[], sort: SortOptions): IOC[] {
  return [...iocs].sort((a, b) => {
    let aVal = a[sort.field];
    let bVal = b[sort.field];

    // Handle different data types
    if (sort.field === 'timestamp' || sort.field === 'firstSeen' || sort.field === 'lastSeen') {
      aVal = aVal ? new Date(aVal as string).getTime() : 0;
      bVal = bVal ? new Date(bVal as string).getTime() : 0;
    } else if (typeof aVal === 'string' && typeof bVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (aVal < bVal) return sort.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sort.direction === 'asc' ? 1 : -1;
    return 0;
  });
}

function calculateIOCStats(iocs: IOC[]): IOCStats {
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const stats: IOCStats = {
    total: iocs.length,
    byType: { ip: 0, subnet: 0, url: 0, domain: 0, hash: 0 },
    bySource: { 'blocklist.de': 0, spamhaus: 0, digitalside: 0, custom: 0 },
    bySeverity: { low: 0, medium: 0, high: 0, critical: 0 },
    lastUpdated: new Date().toISOString(),
    recentActivity: {
      last24h: 0,
      last7d: 0,
      last30d: 0,
    },
  };

  iocs.forEach(ioc => {
    // Count by type
    stats.byType[ioc.type]++;

    // Count by source
    stats.bySource[ioc.source]++;

    // Count by severity
    if (ioc.severity) {
      stats.bySeverity[ioc.severity]++;
    }

    // Count recent activity
    const iocDate = new Date(ioc.timestamp);
    if (iocDate >= oneDayAgo) stats.recentActivity.last24h++;
    if (iocDate >= sevenDaysAgo) stats.recentActivity.last7d++;
    if (iocDate >= thirtyDaysAgo) stats.recentActivity.last30d++;
  });

  return stats;
}
