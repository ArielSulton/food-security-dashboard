'use client';

import { useCountries, useClusters } from '@/lib/hooks';
import { useDashboardStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getClusterColor, formatNumber } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ScatterPlot } from '@/components/charts/ScatterPlot';
import { ClusterFilter } from '@/components/filters/ClusterFilter';
import { CountrySearch } from '@/components/filters/CountrySearch';
import { useState } from 'react';
import { Country } from '@/lib/types';

export default function ClustersPage() {
  const { data: countries, isLoading: countriesLoading } = useCountries();
  const { data: clusters, isLoading: clustersLoading } = useClusters();
  const { selectedCluster } = useDashboardStore();
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  const isLoading = countriesLoading || clustersLoading;

  // Filter countries by selected cluster and search
  const filteredCountries = countries?.filter(c => {
    const matchesCluster = !selectedCluster || c.cluster === selectedCluster;
    const matchesSearch = !selectedCountry || c.name === selectedCountry.name;
    return matchesCluster && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analisis Klaster</h1>
          <p className="text-muted-foreground mt-2">
            Jelajahi klaster ketahanan pangan dan distribusi negara
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <ClusterFilter />
          {countries && (
            <CountrySearch
              countries={countries}
              onSelect={setSelectedCountry}
            />
          )}
          {(selectedCluster || selectedCountry) && (
            <div className="flex items-center text-sm text-muted-foreground">
              {filteredCountries?.length} {filteredCountries?.length === 1 ? 'negara' : 'negara'} ditemukan
            </div>
          )}
        </div>
      </div>

      {/* Cluster Cards */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {clusters?.map((cluster) => (
            <Card
              key={cluster.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              style={{
                borderLeft: `4px solid ${cluster.color}`
              }}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{cluster.label}</span>
                  <Badge
                    style={{
                      backgroundColor: cluster.color,
                      color: 'white'
                    }}
                  >
                    {cluster.id}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-3xl font-bold">{cluster.count}</div>
                  <div className="text-sm text-muted-foreground">negara</div>

                  <div className="pt-3 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Food Supply</span>
                      <span className="font-medium">
                        {cluster.avg_metrics?.food_supply
                          ? formatNumber(cluster.avg_metrics.food_supply, 0)
                          : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Malnutrition</span>
                      <span className="font-medium">
                        {cluster.avg_metrics?.malnutrition_rate
                          ? cluster.avg_metrics.malnutrition_rate.toFixed(1) + '%'
                          : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Stability</span>
                      <span className="font-medium">
                        {cluster.avg_metrics?.stability_index
                          ? cluster.avg_metrics.stability_index.toFixed(2)
                          : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Scatter Plot Visualization */}
      {!isLoading && countries && countries.length > 0 && (
        <ScatterPlot
          countries={countries}
          title="Distribusi Klaster: Pasokan Pangan vs Malnutrisi"
          description="Visualisasi hubungan antara pasokan pangan dan tingkat malnutrisi antar klaster"
          xAxisKey="food_supply"
          yAxisKey="malnutrition_rate"
        />
      )}

      {/* Countries Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Negara Berdasarkan Klaster
            {selectedCluster && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                (Menampilkan {filteredCountries?.length} negara di Klaster {selectedCluster})
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {filteredCountries?.slice(0, 30).map((country) => (
              <div
                key={country.name}
                className="p-3 border rounded-lg flex items-center justify-between hover:bg-accent"
              >
                <div>
                  <div className="font-medium">{country.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Stability: {country.stability_index
                      ? country.stability_index.toFixed(2)
                      : 'N/A'}
                  </div>
                </div>
                <Badge
                  style={{
                    backgroundColor: getClusterColor(country.cluster),
                    color: 'white'
                  }}
                >
                  {country.cluster}
                </Badge>
              </div>
            ))}
          </div>
          {filteredCountries && filteredCountries.length > 30 && (
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Menampilkan 30 dari {filteredCountries.length} negara
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
