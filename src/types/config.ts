export interface AppConfig {
  refreshInterval: number; // minutes
  autoRefresh: boolean;
  theme: 'light' | 'dark' | 'system';
  itemsPerPage: number;
  enableNotifications: boolean;
  apiEndpoint: string;
  defaultFilters: FilterOptions;
}

export interface RefreshConfig {
  interval: number;
  enabled: boolean;
  sources: string[];
  lastRefresh?: string;
}

import { FilterOptions } from './ioc';
