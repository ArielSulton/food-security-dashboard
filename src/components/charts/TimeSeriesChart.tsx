'use client';

import { IndonesiaData, MetricKey, METRIC_LABELS } from '@/lib/types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

interface TimeSeriesChartProps {
  data: IndonesiaData[];
  title?: string;
  selectedMetrics?: MetricKey[];
}

const METRIC_COLORS: Record<MetricKey, string> = {
  food_supply: '#3b82f6',
  import_ratio: '#f59e0b',
  malnutrition_rate: '#ef4444',
  protein_supply: '#22c55e',
  stability_index: '#8b5cf6',
};

export function TimeSeriesChart({ data, title = 'Tren Historis', selectedMetrics }: TimeSeriesChartProps) {
  const [activeMetrics, setActiveMetrics] = useState<MetricKey[]>(
    selectedMetrics || ['food_supply', 'malnutrition_rate', 'stability_index']
  );

  const toggleMetric = (metric: MetricKey) => {
    if (activeMetrics.includes(metric)) {
      setActiveMetrics(activeMetrics.filter(m => m !== metric));
    } else {
      setActiveMetrics([...activeMetrics, metric]);
    }
  };

  // Find the year where forecast begins
  const forecastStartYear = data.find(d => d.is_forecast)?.year || 2023;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle>{title}</CardTitle>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(METRIC_LABELS) as MetricKey[]).map((metric) => (
              <Badge
                key={metric}
                variant={activeMetrics.includes(metric) ? 'default' : 'outline'}
                className="cursor-pointer"
                style={{
                  backgroundColor: activeMetrics.includes(metric)
                    ? METRIC_COLORS[metric]
                    : 'transparent',
                  color: activeMetrics.includes(metric) ? 'white' : METRIC_COLORS[metric],
                  borderColor: METRIC_COLORS[metric],
                }}
                onClick={() => toggleMetric(metric)}
              >
                {METRIC_LABELS[metric]}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="year"
              label={{ value: 'Tahun', position: 'insideBottomRight', offset: -10 }}
            />
            <YAxis
              label={{ value: 'Nilai', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
              formatter={(value: number | string, name: string) => {
                const metricKey = name as MetricKey;
                return [
                  typeof value === 'number' ? value.toFixed(2) : value,
                  METRIC_LABELS[metricKey] || name,
                ];
              }}
            />
            <Legend />
            {/* Forecast separator line */}
            <ReferenceLine
              x={forecastStartYear}
              stroke="#94a3b8"
              strokeDasharray="3 3"
              label={{ value: 'Prediksi', position: 'top' }}
            />
            {/* Render lines for active metrics */}
            {activeMetrics.map((metric) => (
              <Line
                key={metric}
                type="monotone"
                dataKey={metric}
                stroke={METRIC_COLORS[metric]}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name={METRIC_LABELS[metric]}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-4 text-sm text-muted-foreground text-center">
          Klik badge metrik untuk mengubah visibilitas. Garis putus-putus vertikal menandakan dimulainya prediksi.
        </div>
      </CardContent>
    </Card>
  );
}
