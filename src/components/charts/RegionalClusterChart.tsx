'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CLUSTER_LABELS, CLUSTER_COLORS } from '@/lib/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface RegionalClusterData {
  region: string;
  cluster_1: number;
  cluster_2: number;
  cluster_3: number;
  cluster_4: number;
  cluster_5: number;
}

interface RegionalClusterChartProps {
  data: RegionalClusterData[];
  title?: string;
  description?: string;
}

// Custom tooltip component
function CustomTooltip(props: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; dataKey: string }>;
  label?: string;
}) {
  const { active, payload, label } = props;

  if (active && payload && payload.length) {
    const total = payload.reduce((sum, entry) => sum + entry.value, 0);

    return (
      <div className="bg-background border border-border rounded-lg shadow-lg p-3">
        <p className="font-semibold text-sm mb-2">{label}</p>
        <div className="space-y-1">
          {payload.reverse().map((entry) => {
            const clusterNum = parseInt(entry.dataKey.split('_')[1]);
            const percentage = total > 0 ? ((entry.value / total) * 100).toFixed(1) : '0';

            return (
              <div key={entry.dataKey} className="flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: CLUSTER_COLORS[clusterNum] }}
                  />
                  <span>{CLUSTER_LABELS[clusterNum]}</span>
                </div>
                <span className="font-medium">
                  {entry.value} ({percentage}%)
                </span>
              </div>
            );
          })}
          <div className="pt-1 mt-1 border-t flex justify-between font-semibold text-xs">
            <span>Total</span>
            <span>{total}</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export function RegionalClusterChart({
  data,
  title = 'Distribusi Klaster per Region',
  description = 'Jumlah negara dalam setiap klaster ketahanan pangan berdasarkan region geografis'
}: RegionalClusterChartProps) {
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
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 80, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" label={{ value: 'Jumlah Negara', position: 'insideBottom', offset: -10 }} />
            <YAxis type="category" dataKey="region" width={70} />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value: string) => {
                const clusterNum = parseInt(value.split('_')[1]);
                return CLUSTER_LABELS[clusterNum];
              }}
            />

            {/* Stacked bars for each cluster */}
            <Bar dataKey="cluster_1" stackId="a" fill={CLUSTER_COLORS[1]} name="cluster_1" />
            <Bar dataKey="cluster_2" stackId="a" fill={CLUSTER_COLORS[2]} name="cluster_2" />
            <Bar dataKey="cluster_3" stackId="a" fill={CLUSTER_COLORS[3]} name="cluster_3" />
            <Bar dataKey="cluster_4" stackId="a" fill={CLUSTER_COLORS[4]} name="cluster_4" />
            <Bar dataKey="cluster_5" stackId="a" fill={CLUSTER_COLORS[5]} name="cluster_5" />
          </BarChart>
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
                className="w-3 h-3 rounded-sm mr-2"
                style={{ backgroundColor: CLUSTER_COLORS[clusterNum] }}
              />
              <span className="text-xs">
                {clusterNum}: {CLUSTER_LABELS[clusterNum]}
              </span>
            </Badge>
          ))}
        </div>

        <div className="mt-4 text-sm text-muted-foreground text-center">
          Bar horizontal menunjukkan distribusi klaster ketahanan pangan di setiap region.
        </div>
      </CardContent>
    </Card>
  );
}
