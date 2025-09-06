import { IOC } from "@/types/ioc";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string, options?: Intl.DateTimeFormatOptions): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  });
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return formatDate(dateString, { month: 'short', day: 'numeric' });
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

export function getSeverityColor(severity?: string): string {
  switch (severity) {
    case 'low': return 'text-emerald-600 dark:text-emerald-400';
    case 'medium': return 'text-amber-600 dark:text-amber-400';
    case 'high': return 'text-red-600 dark:text-red-400';
    case 'critical': return 'text-red-700 dark:text-red-300';
    default: return 'text-muted-foreground';
  }
}

export function getSeverityBadgeClass(severity?: string): string {
  switch (severity) {
    case 'low': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200';
    case 'medium': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
    case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    case 'critical': return 'bg-red-200 text-red-900 dark:bg-red-800 dark:text-red-100';
    default: return 'bg-muted text-muted-foreground';
  }
}

export function getTypeIcon(type: string): string {
  switch (type) {
    case 'ip': return '🌐';
    case 'subnet': return '🌍';
    case 'url': return '🔗';
    case 'domain': return '🏠';
    case 'hash': return '#️⃣';
    default: return '❓';
  }
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): T {
  let timeoutId: NodeJS.Timeout;
  return ((...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  }) as T;
}

export function validateIOC(ioc: Partial<IOC>): boolean {
  return !!(
    ioc.value &&
    ioc.type &&
    ioc.source &&
    ioc.timestamp &&
    ['ip', 'subnet', 'url', 'domain', 'hash'].includes(ioc.type) &&
    ['blocklist.de', 'spamhaus', 'digitalside', 'custom'].includes(ioc.source)
  );
}
