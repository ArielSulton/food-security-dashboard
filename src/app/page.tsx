'use client';

import { KPICard } from '@/components/KPICard';
import { useCountries, useClusters, useGlobalStats } from '@/lib/hooks';
import { Globe, Layers, Award, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getClusterLabel, getClusterColor } from '@/lib/utils';

// Function to get metric status and color
function getMetricStatus(metric: string, value: number): { status: string; color: string; bgColor: string } {
  switch (metric) {
    case 'food_supply':
      if (value >= 2500) return { status: 'Aman', color: '#16a34a', bgColor: '#dcfce7' };
      if (value >= 2000) return { status: 'Perlu Perhatian', color: '#ea580c', bgColor: '#ffedd5' };
      return { status: 'Rendah', color: '#dc2626', bgColor: '#fee2e2' };

    case 'malnutrition_rate':
      if (value < 5) return { status: 'Aman', color: '#16a34a', bgColor: '#dcfce7' };
      if (value < 15) return { status: 'Perlu Perhatian', color: '#ea580c', bgColor: '#ffedd5' };
      return { status: 'Tinggi', color: '#dc2626', bgColor: '#fee2e2' };

    case 'stability_index':
      if (value > 0) return { status: 'Stabil', color: '#16a34a', bgColor: '#dcfce7' };
      if (value > -0.5) return { status: 'Cukup Stabil', color: '#ea580c', bgColor: '#ffedd5' };
      return { status: 'Tidak Stabil', color: '#dc2626', bgColor: '#fee2e2' };

    case 'import_ratio':
      if (value < 15) return { status: 'Mandiri', color: '#16a34a', bgColor: '#dcfce7' };
      if (value < 30) return { status: 'Cukup Mandiri', color: '#ea580c', bgColor: '#ffedd5' };
      return { status: 'Bergantung Impor', color: '#dc2626', bgColor: '#fee2e2' };

    case 'protein_supply':
      if (value >= 60) return { status: 'Cukup', color: '#16a34a', bgColor: '#dcfce7' };
      if (value >= 40) return { status: 'Kurang', color: '#ea580c', bgColor: '#ffedd5' };
      return { status: 'Sangat Kurang', color: '#dc2626', bgColor: '#fee2e2' };

    default:
      return { status: 'Unknown', color: '#6b7280', bgColor: '#f3f4f6' };
  }
}

export default function HomePage() {
  const { data: countries, isLoading: countriesLoading } = useCountries();
  const { data: clusters, isLoading: clustersLoading } = useClusters();
  const { data: globalStats, isLoading: statsLoading } = useGlobalStats();

  const isLoading = countriesLoading || clustersLoading || statsLoading;

  // Find Indonesia
  const indonesia = countries?.find(c =>
    c.name && c.name.toLowerCase().includes('indonesia')
  );

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Dashboard Ketahanan Pangan
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Analisis interaktif indikator ketahanan pangan di 195 negara
        </p>
        {indonesia && (
          <div className="flex items-center justify-center gap-3">
            <span className="text-lg">Klaster Saat Ini:</span>
            <Badge
              className="text-lg px-4 py-1"
              style={{
                backgroundColor: getClusterColor(indonesia.cluster),
                color: 'white'
              }}
            >
              {getClusterLabel(indonesia.cluster)} ({indonesia.cluster}/5)
            </Badge>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Total Negara"
            value={globalStats?.total_countries || 0}
            icon={Globe}
            colorScheme="blue"
          />
          <KPICard
            title="Klaster"
            value={globalStats?.total_clusters || 0}
            icon={Layers}
            colorScheme="purple"
          />
          <KPICard
            title="Peringkat Indonesia"
            value={`#${globalStats?.indonesia_rank || 0}`}
            unit={`dari ${globalStats?.total_countries || 0}`}
            icon={Award}
            colorScheme="yellow"
          />
          <KPICard
            title="Rata-rata Stabilitas"
            value={globalStats?.avg_metrics.stability_index.toFixed(2) || '0'}
            icon={TrendingUp}
            colorScheme="green"
          />
        </div>
      )}

      {/* Key Insights Section */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="p-6 border rounded-lg space-y-3">
          <h3 className="text-lg font-semibold">Performa Terbaik</h3>
          {globalStats?.best_countries.slice(0, 5).map((country, index) => (
            <div key={country.name} className="flex justify-between items-center">
              <span className="text-sm">{index + 1}. {country.name}</span>
              <span className="text-sm font-medium text-green-600">
                {country.stability.toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="p-6 border rounded-lg space-y-3">
          <h3 className="text-lg font-semibold">Posisi Indonesia</h3>
          {indonesia && (
            <div className="space-y-3">
              <div className="flex justify-between items-center gap-3">
                <span className="text-sm text-muted-foreground">Food Supply</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{indonesia.food_supply.toFixed(0)} kcal/day</span>
                  <Badge
                    style={{
                      backgroundColor: getMetricStatus('food_supply', indonesia.food_supply).bgColor,
                      color: getMetricStatus('food_supply', indonesia.food_supply).color,
                      borderColor: getMetricStatus('food_supply', indonesia.food_supply).color,
                      border: '1px solid'
                    }}
                    className="text-xs font-medium"
                  >
                    {getMetricStatus('food_supply', indonesia.food_supply).status}
                  </Badge>
                </div>
              </div>
              <div className="flex justify-between items-center gap-3">
                <span className="text-sm text-muted-foreground">Malnutrition</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{indonesia.malnutrition_rate.toFixed(1)}%</span>
                  <Badge
                    style={{
                      backgroundColor: getMetricStatus('malnutrition_rate', indonesia.malnutrition_rate).bgColor,
                      color: getMetricStatus('malnutrition_rate', indonesia.malnutrition_rate).color,
                      borderColor: getMetricStatus('malnutrition_rate', indonesia.malnutrition_rate).color,
                      border: '1px solid'
                    }}
                    className="text-xs font-medium"
                  >
                    {getMetricStatus('malnutrition_rate', indonesia.malnutrition_rate).status}
                  </Badge>
                </div>
              </div>
              <div className="flex justify-between items-center gap-3">
                <span className="text-sm text-muted-foreground">Stability Index</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{indonesia.stability_index.toFixed(2)}</span>
                  <Badge
                    style={{
                      backgroundColor: getMetricStatus('stability_index', indonesia.stability_index).bgColor,
                      color: getMetricStatus('stability_index', indonesia.stability_index).color,
                      borderColor: getMetricStatus('stability_index', indonesia.stability_index).color,
                      border: '1px solid'
                    }}
                    className="text-xs font-medium"
                  >
                    {getMetricStatus('stability_index', indonesia.stability_index).status}
                  </Badge>
                </div>
              </div>
              <div className="flex justify-between items-center gap-3">
                <span className="text-sm text-muted-foreground">Import Ratio</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{indonesia.import_ratio.toFixed(1)}%</span>
                  <Badge
                    style={{
                      backgroundColor: getMetricStatus('import_ratio', indonesia.import_ratio).bgColor,
                      color: getMetricStatus('import_ratio', indonesia.import_ratio).color,
                      borderColor: getMetricStatus('import_ratio', indonesia.import_ratio).color,
                      border: '1px solid'
                    }}
                    className="text-xs font-medium"
                  >
                    {getMetricStatus('import_ratio', indonesia.import_ratio).status}
                  </Badge>
                </div>
              </div>
              <div className="flex justify-between items-center gap-3">
                <span className="text-sm text-muted-foreground">Protein Supply</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{indonesia.protein_supply.toFixed(0)} g/day</span>
                  <Badge
                    style={{
                      backgroundColor: getMetricStatus('protein_supply', indonesia.protein_supply).bgColor,
                      color: getMetricStatus('protein_supply', indonesia.protein_supply).color,
                      borderColor: getMetricStatus('protein_supply', indonesia.protein_supply).color,
                      border: '1px solid'
                    }}
                    className="text-xs font-medium"
                  >
                    {getMetricStatus('protein_supply', indonesia.protein_supply).status}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border rounded-lg space-y-3">
          <h3 className="text-lg font-semibold">Area Perbaikan</h3>
          <div className="space-y-2">
            <div className="text-sm">
              <p className="font-medium">Diversifikasi Pangan</p>
              <p className="text-muted-foreground">Tingkatkan pasokan protein dan variasi nutrisi</p>
            </div>
            <div className="text-sm">
              <p className="font-medium">Kemandirian Pangan</p>
              <p className="text-muted-foreground">Kurangi ketergantungan impor</p>
            </div>
            <div className="text-sm">
              <p className="font-medium">Malnutrisi</p>
              <p className="text-muted-foreground">Lanjutkan upaya pengurangan tingkat malnutrisi</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="p-6 border rounded-lg space-y-4">
        <h2 className="text-2xl font-bold">Distribusi Klaster</h2>
        <div className="grid gap-3 md:grid-cols-5">
          {clusters?.map((cluster) => (
            <div
              key={cluster.id}
              className="p-4 rounded-lg text-center space-y-2"
              style={{
                backgroundColor: `${cluster.color}20`,
                borderLeft: `4px solid ${cluster.color}`
              }}
            >
              <div className="text-2xl font-bold">{cluster.count}</div>
              <div className="text-sm font-medium">{cluster.label}</div>
              <div className="text-xs text-muted-foreground">
                {((cluster.count / (globalStats?.total_countries || 1)) * 100).toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
