'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
            margin={{ top: 5, right: 10, left: 60, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis
              type="number"
              label={{ value: 'Jumlah Negara', position: 'insideBottom', offset: -10, style: { fontSize: '12px' } }}
              style={{ fontSize: '11px' }}
            />
            <YAxis
              type="category"
              dataKey="region"
              width={60}
              style={{ fontSize: '11px' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{
                paddingTop: '20px',
                fontSize: '11px'
              }}
              iconType="circle"
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

        {/* Mobile Legend Alternative */}
        <div className="block sm:hidden mt-4 px-2">
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[1, 2, 3, 4, 5].map(num => (
              <div key={num} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: CLUSTER_COLORS[num] }}
                />
                <span className="truncate">{CLUSTER_LABELS[num]}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
