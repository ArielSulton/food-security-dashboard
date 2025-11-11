'use client';

import { useState } from 'react';
import { RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Country } from '@/lib/types';
import { getCountryContinent, getAllContinents, type Continent } from '@/lib/country-continent-map';

interface RadarChartProps {
  country: Country;
  countries?: Country[]; // All countries for continent comparison
  clusterAverage?: {
    food_supply: number;
    protein_supply: number;
    import_ratio: number;
    malnutrition_rate: number;
    stability_index: number;
  };
  title?: string;
  description?: string;
}

interface RadarDataPoint {
  metric: string;
  country: number;
  cluster?: number;
  fullMark: number;
}

// Custom tooltip component (outside of render)
function CustomTooltip(props: { active?: boolean; payload?: Array<{ name?: string; value?: number; color?: string; payload?: RadarDataPoint }> }) {
  const { active, payload } = props;
  if (active && payload && payload.length && payload[0].payload) {
    return (
      <div className="bg-background border border-border rounded-lg shadow-lg p-3">
        <p className="font-semibold text-sm mb-2">{payload[0].payload.metric}</p>
        <div className="space-y-1 text-xs">
          {payload.map((entry, index) => (
            <div key={index} className="flex justify-between gap-4">
              <span style={{ color: entry.color }}>
                {entry.name}:
              </span>
              <span className="font-medium">
                {typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

export function RadarChart({
  country,
  countries,
  clusterAverage,
  title = 'Performance Comparison',
  description = 'Country metrics vs cluster average'
}: RadarChartProps) {
  const [comparisonType, setComparisonType] = useState<'cluster' | 'all' | Continent>('cluster');

  // Calculate continent/global average metrics
  const calculateAverageMetrics = (type: 'cluster' | 'all' | Continent) => {
    if (type === 'cluster' && clusterAverage) {
      return clusterAverage;
    }

    if (!countries || countries.length === 0) {
      return clusterAverage;
    }

    let filteredCountries = countries;
    if (type !== 'all' && type !== 'cluster') {
      filteredCountries = countries.filter(c => getCountryContinent(c.name) === type);
    }

    if (filteredCountries.length === 0) {
      return clusterAverage;
    }

    return {
      food_supply: filteredCountries.reduce((sum, c) => sum + c.food_supply, 0) / filteredCountries.length,
      protein_supply: filteredCountries.reduce((sum, c) => sum + c.protein_supply, 0) / filteredCountries.length,
      import_ratio: filteredCountries.reduce((sum, c) => sum + c.import_ratio, 0) / filteredCountries.length,
      malnutrition_rate: filteredCountries.reduce((sum, c) => sum + c.malnutrition_rate, 0) / filteredCountries.length,
      stability_index: filteredCountries.reduce((sum, c) => sum + c.stability_index, 0) / filteredCountries.length,
    };
  };

  const comparisonAverage = calculateAverageMetrics(comparisonType);

  // Get comparison label
  const getComparisonLabel = () => {
    if (comparisonType === 'cluster') return 'Cluster Average';
    if (comparisonType === 'all') return 'Global Average';
    return `${comparisonType} Average`;
  };
  // Normalize metrics to 0-100 scale for better visualization
  const normalizeValue = (value: number, min: number, max: number): number => {
    return ((value - min) / (max - min)) * 100;
  };

  // Define normalization ranges based on typical values
  const ranges = {
    food_supply: { min: 1500, max: 3500 },
    protein_supply: { min: 20, max: 120 },
    import_ratio: { min: 0, max: 100 },
    malnutrition_rate: { min: 0, max: 50 },
    stability_index: { min: -2, max: 2 }
  };

  // Prepare data - invert malnutrition (lower is better)
  const data: RadarDataPoint[] = [
    {
      metric: 'Food Supply',
      country: normalizeValue(country.food_supply, ranges.food_supply.min, ranges.food_supply.max),
      cluster: comparisonAverage ? normalizeValue(comparisonAverage.food_supply, ranges.food_supply.min, ranges.food_supply.max) : undefined,
      fullMark: 100
    },
    {
      metric: 'Protein Supply',
      country: normalizeValue(country.protein_supply, ranges.protein_supply.min, ranges.protein_supply.max),
      cluster: comparisonAverage ? normalizeValue(comparisonAverage.protein_supply, ranges.protein_supply.min, ranges.protein_supply.max) : undefined,
      fullMark: 100
    },
    {
      metric: 'Import Ratio',
      country: normalizeValue(country.import_ratio, ranges.import_ratio.min, ranges.import_ratio.max),
      cluster: comparisonAverage ? normalizeValue(comparisonAverage.import_ratio, ranges.import_ratio.min, ranges.import_ratio.max) : undefined,
      fullMark: 100
    },
    {
      metric: 'Malnutrition',
      // Invert: lower malnutrition = higher score
      country: 100 - normalizeValue(country.malnutrition_rate, ranges.malnutrition_rate.min, ranges.malnutrition_rate.max),
      cluster: comparisonAverage ? 100 - normalizeValue(comparisonAverage.malnutrition_rate, ranges.malnutrition_rate.min, ranges.malnutrition_rate.max) : undefined,
      fullMark: 100
    },
    {
      metric: 'Stability',
      country: normalizeValue(country.stability_index, ranges.stability_index.min, ranges.stability_index.max),
      cluster: comparisonAverage ? normalizeValue(comparisonAverage.stability_index, ranges.stability_index.min, ranges.stability_index.max) : undefined,
      fullMark: 100
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          {countries && countries.length > 0 && (
            <Select value={comparisonType} onValueChange={(val) => setComparisonType(val as 'cluster' | 'all' | Continent)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Pilih Perbandingan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cluster">Rata-rata Klaster</SelectItem>
                <SelectItem value="all">Rata-rata Global</SelectItem>
                {getAllContinents().map(continent => (
                  <SelectItem key={continent} value={continent}>
                    Rata-rata {continent}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <RechartsRadar data={data}>
            <PolarGrid className="stroke-muted" />
            <PolarAngleAxis
              dataKey="metric"
              tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
            />
            <Radar
              name={country.name}
              dataKey="country"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.3}
              strokeWidth={2}
            />
            {comparisonAverage && (
              <Radar
                name={getComparisonLabel()}
                dataKey="cluster"
                stroke="hsl(var(--muted-foreground))"
                fill="hsl(var(--muted-foreground))"
                fillOpacity={0.2}
                strokeWidth={2}
                strokeDasharray="5 5"
              />
            )}
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="line"
            />
            <Tooltip content={<CustomTooltip />} />
          </RechartsRadar>
        </ResponsiveContainer>

        {/* Legend for inverted metrics */}
        <div className="mt-4 text-xs text-muted-foreground text-center">
          * Malnutrition score is inverted (lower rate = higher score)
        </div>
      </CardContent>
    </Card>
  );
}
