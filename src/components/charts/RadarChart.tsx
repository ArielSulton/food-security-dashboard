'use client';

import { RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Country } from '@/lib/types';

interface RadarChartProps {
  country: Country;
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
  clusterAverage,
  title = 'Performance Comparison',
  description = 'Country metrics vs cluster average'
}: RadarChartProps) {
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
      cluster: clusterAverage ? normalizeValue(clusterAverage.food_supply, ranges.food_supply.min, ranges.food_supply.max) : undefined,
      fullMark: 100
    },
    {
      metric: 'Protein Supply',
      country: normalizeValue(country.protein_supply, ranges.protein_supply.min, ranges.protein_supply.max),
      cluster: clusterAverage ? normalizeValue(clusterAverage.protein_supply, ranges.protein_supply.min, ranges.protein_supply.max) : undefined,
      fullMark: 100
    },
    {
      metric: 'Import Ratio',
      country: normalizeValue(country.import_ratio, ranges.import_ratio.min, ranges.import_ratio.max),
      cluster: clusterAverage ? normalizeValue(clusterAverage.import_ratio, ranges.import_ratio.min, ranges.import_ratio.max) : undefined,
      fullMark: 100
    },
    {
      metric: 'Malnutrition',
      // Invert: lower malnutrition = higher score
      country: 100 - normalizeValue(country.malnutrition_rate, ranges.malnutrition_rate.min, ranges.malnutrition_rate.max),
      cluster: clusterAverage ? 100 - normalizeValue(clusterAverage.malnutrition_rate, ranges.malnutrition_rate.min, ranges.malnutrition_rate.max) : undefined,
      fullMark: 100
    },
    {
      metric: 'Stability',
      country: normalizeValue(country.stability_index, ranges.stability_index.min, ranges.stability_index.max),
      cluster: clusterAverage ? normalizeValue(clusterAverage.stability_index, ranges.stability_index.min, ranges.stability_index.max) : undefined,
      fullMark: 100
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
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
            {clusterAverage && (
              <Radar
                name="Cluster Average"
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
