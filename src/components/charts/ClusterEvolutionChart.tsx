'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CLUSTER_LABELS, CLUSTER_COLORS } from '@/lib/types';
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
  Area,
  ComposedChart,
} from 'recharts';

interface ClusterEvolutionData {
  year: number;
  cluster: number;
  is_forecast: boolean;
}

interface ClusterEvolutionChartProps {
  data: ClusterEvolutionData[];
  title?: string;
  description?: string;
}

// Custom tooltip component
function CustomTooltip(props: {
  active?: boolean;
  payload?: Array<{ value?: number; payload?: ClusterEvolutionData }>
}) {
  const { active, payload } = props;

  if (active && payload && payload.length && payload[0].payload) {
    const data = payload[0].payload;
    const clusterNum = data.cluster;

    return (
      <div className="bg-background border border-border rounded-lg shadow-lg p-3">
        <p className="font-semibold text-sm mb-2">
          {data.year} {data.is_forecast && '(Prediksi)'}
        </p>
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: CLUSTER_COLORS[clusterNum] }}
          />
          <span className="text-sm">
            Klaster {clusterNum}: {CLUSTER_LABELS[clusterNum]}
          </span>
        </div>
      </div>
    );
  }

  return null;
}

export function ClusterEvolutionChart({
  data,
  title = 'Evolusi Klaster Indonesia (2010-2025)',
  description = 'Perubahan klaster ketahanan pangan Indonesia dari historis hingga prediksi'
}: ClusterEvolutionChartProps) {
  // Find the year where forecast begins
  const forecastStartYear = data.find(d => d.is_forecast)?.year || 2023;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="year"
              label={{ value: 'Tahun', position: 'insideBottom', offset: -10 }}
            />
            <YAxis
              domain={[0, 6]}
              ticks={[1, 2, 3, 4, 5]}
              label={{ value: 'Klaster', angle: -90, position: 'insideLeft' }}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />

            {/* Forecast separator line */}
            <ReferenceLine
              x={forecastStartYear}
              stroke="#94a3b8"
              strokeDasharray="3 3"
              label={{ value: 'Prediksi Dimulai', position: 'top' }}
            />

            {/* Cluster evolution line */}
            <Line
              type="stepAfter"
              dataKey="cluster"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={(props) => {
                const { cx, cy, payload } = props;
                const clusterNum = payload.cluster;
                return (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={6}
                    fill={CLUSTER_COLORS[clusterNum]}
                    stroke="#fff"
                    strokeWidth={2}
                  />
                );
              }}
              activeDot={(props) => {
                const { cx, cy, payload } = props;
                const clusterNum = payload.cluster;
                return (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={8}
                    fill={CLUSTER_COLORS[clusterNum]}
                    stroke="#fff"
                    strokeWidth={2}
                  />
                );
              }}
              name="Klaster"
            />
          </ComposedChart>
        </ResponsiveContainer>

        {/* Cluster Legend */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5].map((clusterNum) => (
            <Badge
              key={clusterNum}
              variant="outline"
              className="justify-start"
              style={{
                borderColor: CLUSTER_COLORS[clusterNum],
                color: CLUSTER_COLORS[clusterNum],
              }}
            >
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: CLUSTER_COLORS[clusterNum] }}
              />
              <span className="text-xs">
                {clusterNum}: {CLUSTER_LABELS[clusterNum]}
              </span>
            </Badge>
          ))}
        </div>

        <div className="mt-4 text-sm text-muted-foreground text-center">
          Garis vertikal putus-putus menandakan dimulainya periode prediksi.
        </div>
      </CardContent>
    </Card>
  );
}
