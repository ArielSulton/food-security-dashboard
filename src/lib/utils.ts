import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Country, MetricKey, CLUSTER_LABELS, CLUSTER_COLORS } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format numbers with appropriate decimals and thousand separators
export function formatNumber(num: number, decimals: number = 0): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

// Get cluster label by ID
export function getClusterLabel(id: number): string {
  return CLUSTER_LABELS[id] || 'Unknown';
}

// Get cluster color by ID
export function getClusterColor(id: number): string {
  return CLUSTER_COLORS[id] || '#64748b';
}

// Calculate percentage change between two values
export function calculatePercentageChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) return 0;
  return ((newValue - oldValue) / oldValue) * 100;
}

// Sort countries by a specific metric
export function sortCountriesByMetric(
  countries: Country[],
  metric: MetricKey,
  ascending: boolean = false
): Country[] {
  const sorted = [...countries].sort((a, b) => {
    const aValue = a[metric];
    const bValue = b[metric];
    return ascending ? aValue - bValue : bValue - aValue;
  });
  return sorted;
}

// Get top N countries by metric
export function getTopCountries(
  countries: Country[],
  metric: MetricKey,
  count: number = 10
): Country[] {
  return sortCountriesByMetric(countries, metric, false).slice(0, count);
}

// Get bottom N countries by metric
export function getBottomCountries(
  countries: Country[],
  metric: MetricKey,
  count: number = 10
): Country[] {
  return sortCountriesByMetric(countries, metric, true).slice(0, count);
}

// Normalize value to 0-100 scale for radar charts
export function normalizeValue(
  value: number,
  min: number,
  max: number
): number {
  if (max === min) return 50;
  return ((value - min) / (max - min)) * 100;
}

// Format percentage with sign
export function formatPercentage(value: number, decimals: number = 1): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${formatNumber(value, decimals)}%`;
}

// Get trend indicator (up/down/neutral)
export function getTrendIndicator(value: number): 'up' | 'down' | 'neutral' {
  if (value > 0) return 'up';
  if (value < 0) return 'down';
  return 'neutral';
}

// Filter countries by cluster
export function filterByCluster(countries: Country[], clusterId: number | null): Country[] {
  if (clusterId === null) return countries;
  return countries.filter(c => c.cluster === clusterId);
}

// Search countries by name
export function searchCountries(countries: Country[], query: string): Country[] {
  if (!query.trim()) return countries;
  const lowerQuery = query.toLowerCase();
  return countries.filter(c => c.name.toLowerCase().includes(lowerQuery));
}
