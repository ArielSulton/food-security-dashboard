'use client';

import { useCountries, useIndonesiaHistorical, useIndonesiaForecast, useClusters, useIndonesiaClusterEvolution } from '@/lib/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getClusterLabel, getClusterColor, calculatePercentageChange, formatPercentage } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { TimeSeriesChart } from '@/components/charts/TimeSeriesChart';
import { RadarChart } from '@/components/charts/RadarChart';
import { ClusterEvolutionChart } from '@/components/charts/ClusterEvolutionChart';

export default function IndonesiaPage() {
  const { data: countries } = useCountries();
  const { data: historical } = useIndonesiaHistorical();
  const { data: forecast } = useIndonesiaForecast();
  const { data: clusters } = useClusters();
  const { data: clusterEvolution } = useIndonesiaClusterEvolution();

  // Combine historical and forecast data
  const allData = historical && forecast ? [...historical, ...forecast] : historical;

  const indonesia = countries?.find(c => c.name && c.name.toLowerCase().includes('indonesia'));

  // Get cluster average metrics
  const clusterAverage = indonesia && clusters
    ? clusters.find(c => c.id === indonesia.cluster)?.avg_metrics
    : undefined;

  // Calculate changes from first to last year (including forecast)
  const firstYear = allData?.[0];
  const lastYear = allData?.[allData.length - 1];

  const changes = firstYear && lastYear ? {
    food_supply: calculatePercentageChange(firstYear.food_supply, lastYear.food_supply),
    malnutrition_rate: calculatePercentageChange(firstYear.malnutrition_rate, lastYear.malnutrition_rate),
    stability_index: calculatePercentageChange(firstYear.stability_index, lastYear.stability_index),
    import_ratio: calculatePercentageChange(firstYear.import_ratio, lastYear.import_ratio),
    protein_supply: calculatePercentageChange(firstYear.protein_supply, lastYear.protein_supply),
  } : null;

  return (
    <div className="space-y-8">
      {/* Status Banner */}
      {indonesia && (
        <div className="p-6 border rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Indonesia</h1>
              <p className="text-muted-foreground mt-1">
                Analisis Ketahanan Pangan (2010-2025)
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Klaster Saat Ini</div>
                <Badge
                  className="text-lg px-4 py-1 mt-1"
                  style={{
                    backgroundColor: getClusterColor(indonesia.cluster),
                    color: 'white'
                  }}
                >
                  {getClusterLabel(indonesia.cluster)} ({indonesia.cluster}/5)
                </Badge>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Indicators */}
      {changes && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Food Supply
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {lastYear?.food_supply.toFixed(0)}
              </div>
              <div className="flex items-center mt-1">
                {changes.food_supply >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                )}
                <span className={`text-sm font-medium ${changes.food_supply >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPercentage(changes.food_supply)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Malnutrition Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {lastYear?.malnutrition_rate.toFixed(1)}%
              </div>
              <div className="flex items-center mt-1">
                {changes.malnutrition_rate <= 0 ? (
                  <TrendingDown className="h-4 w-4 text-green-600 mr-1" />
                ) : (
                  <TrendingUp className="h-4 w-4 text-red-600 mr-1" />
                )}
                <span className={`text-sm font-medium ${changes.malnutrition_rate <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPercentage(changes.malnutrition_rate)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Stability Index
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {lastYear?.stability_index.toFixed(2)}
              </div>
              <div className="flex items-center mt-1">
                {changes.stability_index >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                )}
                <span className={`text-sm font-medium ${changes.stability_index >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPercentage(changes.stability_index)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Import Ratio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {lastYear?.import_ratio.toFixed(1)}%
              </div>
              <div className="flex items-center mt-1">
                {changes.import_ratio <= 0 ? (
                  <TrendingDown className="h-4 w-4 text-green-600 mr-1" />
                ) : (
                  <TrendingUp className="h-4 w-4 text-red-600 mr-1" />
                )}
                <span className={`text-sm font-medium ${changes.import_ratio <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPercentage(changes.import_ratio)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Protein Supply
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {lastYear?.protein_supply.toFixed(0)}
              </div>
              <div className="flex items-center mt-1">
                {changes.protein_supply >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                )}
                <span className={`text-sm font-medium ${changes.protein_supply >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPercentage(changes.protein_supply)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Time Series Chart */}
      {allData && (
        <TimeSeriesChart
          data={allData}
          title="Tren Historis (2010-2025)"
        />
      )}

      {/* Cluster Evolution Chart */}
      {clusterEvolution && (
        <ClusterEvolutionChart
          data={clusterEvolution}
          title="Evolusi Klaster Indonesia (2010-2025)"
          description="Perubahan klaster ketahanan pangan Indonesia dari 2010 hingga 2025"
        />
      )}

      {/* Radar Chart Comparison */}
      {indonesia && (
        <RadarChart
          country={indonesia}
          countries={countries}
          clusterAverage={clusterAverage}
          title="Indonesia vs Rata-rata Wilayah"
          description="Membandingkan performa Indonesia dengan rata-rata klaster, benua, atau global"
        />
      )}

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tabel Data Lengkap (2010-2025)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Tahun</th>
                  <th className="text-right p-2">Food Supply</th>
                  <th className="text-right p-2">Malnutrition</th>
                  <th className="text-right p-2">Stability</th>
                  <th className="text-right p-2">Import Ratio</th>
                  <th className="text-right p-2">Protein</th>
                </tr>
              </thead>
              <tbody>
                {allData?.map((data) => (
                  <tr key={data.year} className="border-b hover:bg-muted/50">
                    <td className="p-2 font-medium">{data.year}</td>
                    <td className="text-right p-2">{data.food_supply.toFixed(0)}</td>
                    <td className="text-right p-2">{data.malnutrition_rate.toFixed(1)}%</td>
                    <td className="text-right p-2">{data.stability_index.toFixed(2)}</td>
                    <td className="text-right p-2">{data.import_ratio.toFixed(1)}%</td>
                    <td className="text-right p-2">{data.protein_supply.toFixed(0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
