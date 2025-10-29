import { create } from 'zustand';
import { MetricKey } from './types';

interface DashboardStore {
  // Filters
  selectedCluster: number | null;
  searchQuery: string;
  selectedMetrics: MetricKey[];

  // Actions
  setSelectedCluster: (id: number | null) => void;
  setSearchQuery: (query: string) => void;
  toggleMetric: (metric: MetricKey) => void;
  setSelectedMetrics: (metrics: MetricKey[]) => void;
  resetFilters: () => void;
}

const defaultMetrics: MetricKey[] = ['food_supply', 'malnutrition_rate', 'stability_index'];

export const useDashboardStore = create<DashboardStore>((set) => ({
  // Initial state
  selectedCluster: null,
  searchQuery: '',
  selectedMetrics: defaultMetrics,

  // Actions
  setSelectedCluster: (id) => set({ selectedCluster: id }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  toggleMetric: (metric) =>
    set((state) => {
      const isSelected = state.selectedMetrics.includes(metric);
      if (isSelected) {
        // Remove metric
        return {
          selectedMetrics: state.selectedMetrics.filter((m) => m !== metric),
        };
      } else {
        // Add metric
        return {
          selectedMetrics: [...state.selectedMetrics, metric],
        };
      }
    }),

  setSelectedMetrics: (metrics) => set({ selectedMetrics: metrics }),

  resetFilters: () =>
    set({
      selectedCluster: null,
      searchQuery: '',
      selectedMetrics: defaultMetrics,
    }),
}));
