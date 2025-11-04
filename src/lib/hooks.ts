import { useQuery } from '@tanstack/react-query';
import { Country, Cluster, IndonesiaData, GlobalStats } from './types';

// Fetch countries data
export function useCountries() {
  return useQuery<Country[]>({
    queryKey: ['countries'],
    queryFn: async () => {
      const response = await fetch('/data/countries.json');
      if (!response.ok) throw new Error('Failed to fetch countries');
      return response.json();
    },
  });
}

// Fetch clusters data
export function useClusters() {
  return useQuery<Cluster[]>({
    queryKey: ['clusters'],
    queryFn: async () => {
      const response = await fetch('/data/clusters.json');
      if (!response.ok) throw new Error('Failed to fetch clusters');
      return response.json();
    },
  });
}

// Fetch cluster by ID
export function useCluster(id: number) {
  return useQuery<Cluster>({
    queryKey: ['cluster', id],
    queryFn: async () => {
      const response = await fetch('/data/clusters.json');
      if (!response.ok) throw new Error('Failed to fetch clusters');
      const clusters: Cluster[] = await response.json();
      const cluster = clusters.find(c => c.id === id);
      if (!cluster) throw new Error(`Cluster ${id} not found`);
      return cluster;
    },
    enabled: !!id,
  });
}

// Fetch Indonesia historical data
export function useIndonesiaHistorical() {
  return useQuery<IndonesiaData[]>({
    queryKey: ['indonesia-historical'],
    queryFn: async () => {
      const response = await fetch('/data/indonesia-historical.json');
      if (!response.ok) throw new Error('Failed to fetch Indonesia historical data');
      return response.json();
    },
  });
}

// Fetch Indonesia forecast data
export function useIndonesiaForecast() {
  return useQuery<IndonesiaData[]>({
    queryKey: ['indonesia-forecast'],
    queryFn: async () => {
      const response = await fetch('/data/indonesia-forecast.json');
      if (!response.ok) throw new Error('Failed to fetch Indonesia forecast data');
      return response.json();
    },
  });
}

// Fetch combined Indonesia data (historical + forecast)
export function useIndonesiaData(includeForecast: boolean = true) {
  const historical = useIndonesiaHistorical();
  const forecast = useIndonesiaForecast();

  const combined = useQuery<IndonesiaData[]>({
    queryKey: ['indonesia-combined', includeForecast],
    queryFn: async () => {
      const hist = historical.data || [];
      const fcst = forecast.data || [];
      return [...hist, ...fcst];
    },
    enabled: includeForecast && !!historical.data && !!forecast.data,
  });

  return includeForecast ? combined : historical;
}

// Fetch global statistics
export function useGlobalStats() {
  return useQuery<GlobalStats>({
    queryKey: ['global-stats'],
    queryFn: async () => {
      const response = await fetch('/data/global-stats.json');
      if (!response.ok) throw new Error('Failed to fetch global stats');
      return response.json();
    },
  });
}

// Fetch Indonesia cluster evolution data
export interface ClusterEvolutionData {
  year: number;
  cluster: number;
  is_forecast: boolean;
}

export function useIndonesiaClusterEvolution() {
  return useQuery<ClusterEvolutionData[]>({
    queryKey: ['indonesia-cluster-evolution'],
    queryFn: async () => {
      const response = await fetch('/data/indonesia-cluster-evolution.json');
      if (!response.ok) throw new Error('Failed to fetch Indonesia cluster evolution data');
      return response.json();
    },
  });
}

// Fetch regional cluster distribution
export interface RegionalClusterData {
  region: string;
  cluster_1: number;
  cluster_2: number;
  cluster_3: number;
  cluster_4: number;
  cluster_5: number;
}

export function useRegionalClusters() {
  return useQuery<RegionalClusterData[]>({
    queryKey: ['regional-clusters'],
    queryFn: async () => {
      const response = await fetch('/data/regional-clusters.json');
      if (!response.ok) throw new Error('Failed to fetch regional cluster data');
      return response.json();
    },
  });
}
