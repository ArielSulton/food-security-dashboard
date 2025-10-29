// TypeScript interfaces for Food Security Dashboard

export interface Country {
  name: string;
  cluster: number;
  membership: number[]; // Fuzzy membership [c1, c2, c3, c4, c5]
  food_supply: number;
  import_ratio: number;
  malnutrition_rate: number;
  protein_supply: number;
  stability_index: number;
}

export interface Cluster {
  id: number;
  label: string; // "Baik", "Di ambang baik", "Sedikit buruk", "Buruk", "Sangat buruk"
  count: number;
  members: string[];
  avg_metrics: {
    food_supply: number;
    import_ratio: number;
    malnutrition_rate: number;
    protein_supply: number;
    stability_index: number;
  };
  color: string; // Diverging scale colors
}

export interface IndonesiaData {
  year: number;
  food_supply: number;
  import_ratio: number;
  malnutrition_rate: number;
  protein_supply: number;
  stability_index: number;
  is_forecast: boolean; // true for 2023-2025
}

export interface GlobalStats {
  total_countries: number;
  total_clusters: number;
  avg_metrics: Record<string, number>;
  best_countries: Array<{ name: string; stability: number }>;
  worst_countries: Array<{ name: string; stability: number }>;
  indonesia_rank: number;
}

export interface Metadata {
  generation_date: string;
  source_files: string[];
  total_records: number;
  data_version: string;
}

// Metric keys for type safety
export type MetricKey =
  | 'food_supply'
  | 'import_ratio'
  | 'malnutrition_rate'
  | 'protein_supply'
  | 'stability_index';

// Cluster labels mapping
export const CLUSTER_LABELS: Record<number, string> = {
  1: 'Baik',
  2: 'Di ambang baik',
  3: 'Sedikit buruk',
  4: 'Buruk',
  5: 'Sangat buruk'
};

// Cluster colors (diverging scale)
export const CLUSTER_COLORS: Record<number, string> = {
  1: '#1a9850',  // Dark green - Good food security
  2: '#91cf60',  // Light green - On threshold of good
  3: '#fee090',  // Yellow - Slightly bad
  4: '#fc8d59',  // Orange - Bad
  5: '#d73027'   // Red - Very bad
};

// Metric display names
export const METRIC_LABELS: Record<MetricKey, string> = {
  food_supply: 'Food Supply',
  import_ratio: 'Import Ratio',
  malnutrition_rate: 'Malnutrition Rate',
  protein_supply: 'Protein Supply',
  stability_index: 'Stability Index'
};

// Metric units
export const METRIC_UNITS: Record<MetricKey, string> = {
  food_supply: 'kcal/capita/day',
  import_ratio: '%',
  malnutrition_rate: '%',
  protein_supply: 'g/capita/day',
  stability_index: 'index'
};
