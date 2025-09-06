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
}

export interface IOCStats {
  total: number;
  byType: Record<IOC['type'], number>;
  bySource: Record<IOC['source'], number>;
  bySeverity: Record<NonNullable<IOC['severity']>, number>;
  lastUpdated: string;
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
}

export interface SortOptions {
  field: keyof IOC;
  direction: 'asc' | 'desc';
}
