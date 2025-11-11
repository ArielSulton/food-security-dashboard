'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Country } from '@/lib/types';
import { getCountryContinent, getAllContinents, type Continent } from '@/lib/country-continent-map';
import { Award, Globe } from 'lucide-react';
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ContinentPositionCardProps {
  countries: Country[];
}

export function ContinentPositionCard({ countries }: ContinentPositionCardProps) {
  const [selectedRegion, setSelectedRegion] = useState<'All' | Continent>('All');

  // Find Indonesia
  const indonesia = countries.find(c =>
    c.name && c.name.toLowerCase().includes('indonesia')
  );

  if (!indonesia) return null;

  // Calculate rankings by region
  const calculateRanking = (region: 'All' | Continent) => {
    let filteredCountries = countries;

    if (region !== 'All') {
      filteredCountries = countries.filter(c =>
        getCountryContinent(c.name) === region
      );
    }

    // Check if Indonesia is actually in this region
    const isInRegion = region === 'All' || getCountryContinent(indonesia.name) === region;

    // For hypothetical ranking: always include Indonesia in the calculation
    let countriesForRanking = filteredCountries;
    if (!isInRegion) {
      // Add Indonesia to the list for hypothetical ranking
      countriesForRanking = [...filteredCountries, indonesia];
    }

    // Sort by stability_index (descending - higher is better)
    const sorted = [...countriesForRanking].sort((a, b) =>
      b.stability_index - a.stability_index
    );

    const rankIndex = sorted.findIndex(c => c.name === indonesia.name);
    const rank = rankIndex + 1;
    const total = sorted.length;

    // Calculate average metrics for the original region (without Indonesia if not in region)
    const avgStability = filteredCountries.reduce((sum, c) => sum + c.stability_index, 0) / filteredCountries.length;
    const avgFoodSupply = filteredCountries.reduce((sum, c) => sum + c.food_supply, 0) / filteredCountries.length;
    const avgMalnutrition = filteredCountries.reduce((sum, c) => sum + c.malnutrition_rate, 0) / filteredCountries.length;

    return {
      rank,
      total,
      isInRegion,
      avgStability,
      avgFoodSupply,
      avgMalnutrition,
      percentile: ((total - rank) / total * 100).toFixed(0)
    };
  };

  const currentStats = calculateRanking(selectedRegion);

  // Get color based on percentile
  const getPercentileColor = (percentile: number) => {
    if (percentile >= 75) return 'text-green-600';
    if (percentile >= 50) return 'text-yellow-600';
    if (percentile >= 25) return 'text-orange-600';
    return 'text-red-600';
  };

  const percentile = parseInt(currentStats.percentile);

  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Posisi Indonesia Berdasarkan Region
          </CardTitle>
          <Globe className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Region Filter */}
        <Tabs value={selectedRegion} onValueChange={(val) => setSelectedRegion(val as 'All' | Continent)}>
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            <TabsTrigger value="All">Semua</TabsTrigger>
            {getAllContinents().map(continent => (
              <TabsTrigger key={continent} value={continent}>
                {continent}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Hypothetical Notice */}
        {!currentStats.isInRegion && (
          <div className="p-4 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50/50">
            <p className="text-sm text-blue-700 text-center">
              <strong>Perhitungan Hipotetis:</strong> Indonesia sebenarnya berada di benua <strong>Asia</strong>.
              Ranking di bawah ini menunjukkan posisi Indonesia <em>jika</em> Indonesia berada di benua <strong>{selectedRegion}</strong>.
            </p>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          {/* Ranking */}
          <div className="p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="text-sm text-muted-foreground mb-2">
              Peringkat{!currentStats.isInRegion && ' (Hipotetis)'}
            </div>
            <div className="text-3xl font-bold">
              #{currentStats.rank}
              <span className="text-lg text-muted-foreground ml-2">
                / {currentStats.total}
              </span>
            </div>
            <Badge
              className={`mt-2 ${getPercentileColor(percentile)}`}
              variant="outline"
            >
              Top {currentStats.percentile}%
            </Badge>
          </div>

          {/* Stability Comparison */}
          <div className="p-4 border rounded-lg">
            <div className="text-sm text-muted-foreground mb-2">Stability Index</div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs">Indonesia:</span>
                <span className="font-bold">{indonesia.stability_index.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs">Rata-rata {selectedRegion}:</span>
                <span className="text-sm font-medium">{currentStats.avgStability.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs">Selisih:</span>
                <span className={`text-sm font-bold ${indonesia.stability_index > currentStats.avgStability ? 'text-green-600' : 'text-red-600'}`}>
                  {(indonesia.stability_index - currentStats.avgStability).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="p-4 border rounded-lg">
            <div className="text-sm text-muted-foreground mb-2">Perbandingan Metrik</div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Food Supply:</span>
                <span className={indonesia.food_supply > currentStats.avgFoodSupply ? 'text-green-600 font-medium' : 'text-red-600'}>
                  {indonesia.food_supply > currentStats.avgFoodSupply ? '↑' : '↓'}
                  {' '}
                  {Math.abs(indonesia.food_supply - currentStats.avgFoodSupply).toFixed(0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Malnutrition:</span>
                <span className={indonesia.malnutrition_rate < currentStats.avgMalnutrition ? 'text-green-600 font-medium' : 'text-red-600'}>
                  {indonesia.malnutrition_rate < currentStats.avgMalnutrition ? '↓' : '↑'}
                  {' '}
                  {Math.abs(indonesia.malnutrition_rate - currentStats.avgMalnutrition).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="p-3 bg-muted rounded-lg text-sm">
          <p className="text-center">
            {currentStats.isInRegion ? (
              <>
                Indonesia berada di peringkat <strong>#{currentStats.rank}</strong> dari <strong>{currentStats.total}</strong> negara
                {selectedRegion !== 'All' ? ` di ${selectedRegion}` : ' secara global'},
                {' '}menempatkannya di <strong>top {currentStats.percentile}%</strong> berdasarkan Stability Index.
              </>
            ) : (
              <>
                <strong>Jika</strong> Indonesia berada di benua <strong>{selectedRegion}</strong>, Indonesia akan berada di peringkat{' '}
                <strong>#{currentStats.rank}</strong> dari <strong>{currentStats.total}</strong> negara,
                {' '}menempatkannya di <strong>top {currentStats.percentile}%</strong>.
                Perbandingan di atas menunjukkan metrik ketahanan pangan Indonesia relatif terhadap rata-rata {selectedRegion}.
              </>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
