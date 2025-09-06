export interface IOC {
  id: string;
  value: string;
  type: 'ip' | 'subnet' | 'url' | 'domain' | 'hash';
  source: 'blocklist.de' | 'spamhaus' | 'digitalside' | 'custom';
  timestamp: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  description?: string;
  tags?: string[];
  firstSeen?: string;
  lastSeen?: string;
  confidence?: number; // 0-100
  tlp?: 'white' | 'green' | 'amber' | 'red'; // Traffic Light Protocol
  references?: string[];
}

export interface IOCStats {
  total: number;
  byType: Record<IOC['type'], number>;
  bySource: Record<IOC['source'], number>;
  bySeverity: Record<NonNullable<IOC['severity']>, number>;
  lastUpdated: string;
  recentActivity: {
    last24h: number;
    last7d: number;
    last30d: number;
  };
}

export interface FilterOptions {
  search: string;
  types: IOC['type'][];
  sources: IOC['source'][];
  severities: IOC['severity'][];
  dateRange?: {
    start: string;
    end: string;
  };
  confidenceRange?: {
    min: number;
    max: number;
  };
}

export interface SortOptions {
  field: keyof IOC;
  direction: 'asc' | 'desc';
}

export interface PaginationOptions {
  page: number;
  limit: number;
  total: number;
}

// API Response types
export interface APIResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
  timestamp: string;
}

export interface IOCFeedResponse extends APIResponse<IOC[]> {
  metadata: {
    source: string;
    fetchedAt: string;
    count: number;
  };
}
