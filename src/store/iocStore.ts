import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { IOC, IOCStats, FilterOptions, SortOptions } from '@/types/ioc';

interface IOCStore {
  // State
  iocs: IOC[];
  filteredIOCs: IOC[];
  stats: IOCStats | null;
  isLoading: boolean;
  error: string | null;
  filters: FilterOptions;
  sort: SortOptions;
  
  // Actions
  setIOCs: (iocs: IOC[]) => void;
  addIOCs: (iocs: IOC[]) => void;
  updateFilters: (filters: Partial<FilterOptions>) => void;
  updateSort: (sort: SortOptions) => void;
  clearFilters: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
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

export const useIOCStore = create<IOCStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial State
        iocs: [],
        filteredIOCs: [],
        stats: null,
        isLoading: false,
        error: null,
        filters: initialFilters,
        sort: initialSort,

        // Actions
        setIOCs: (iocs) => {
          const stats = calculateStats(iocs);
          set({ iocs, stats });
          get().applyFiltersAndSort();
        },

        addIOCs: (newIOCs) => {
          const { iocs } = get();
          const merged = mergeIOCs([...iocs, ...newIOCs]);
          const stats = calculateStats(merged);
          set({ iocs: merged, stats });
          get().applyFiltersAndSort();
        },

        updateFilters: (newFilters) => {
          const filters = { ...get().filters, ...newFilters };
          set({ filters });
          get().applyFiltersAndSort();
        },

        updateSort: (sort) => {
          set({ sort });
          get().applyFiltersAndSort();
        },

        clearFilters: () => {
          set({ filters: initialFilters });
          get().applyFiltersAndSort();
        },

        setLoading: (isLoading) => set({ isLoading }),
        setError: (error) => set({ error }),

        // Helper method to apply filters and sorting
        applyFiltersAndSort: () => {
          const { iocs, filters, sort } = get();
          let filtered = applyFilters(iocs, filters);
          filtered = applySorting(filtered, sort);
          set({ filteredIOCs: filtered });
        },
      }),
      {
        name: 'ioc-storage',
        partialize: (state) => ({ 
          iocs: state.iocs,
          filters: state.filters,
          sort: state.sort,
        }),
      }
    )
  )
);

// Helper functions
function calculateStats(iocs: IOC[]): IOCStats {
  // Implementation for calculating statistics
  return {
    total: iocs.length,
    byType: {},
    bySource: {},
    bySeverity: {},
    lastUpdated: new Date().toISOString(),
  };
}

function mergeIOCs(iocs: IOC[]): IOC[] {
  // Remove duplicates based on value + type combination
  const seen = new Map();
  return iocs.filter(ioc => {
    const key = `${ioc.value}-${ioc.type}`;
    if (seen.has(key)) return false;
    seen.set(key, true);
    return true;
  });
}

function applyFilters(iocs: IOC[], filters: FilterOptions): IOC[] {
  // Implementation for filtering logic
  return iocs;
}

function applySorting(iocs: IOC[], sort: SortOptions): IOC[] {
  // Implementation for sorting logic
  return iocs;
}
