'use client';

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Country, CLUSTER_COLORS, CLUSTER_LABELS } from '@/lib/types';

interface ScatterPlotProps {
  countries: Country[];
  title?: string;
  description?: string;
  xAxisKey?: keyof Pick<Country, 'food_supply' | 'protein_supply' | 'import_ratio' | 'stability_index'>;
  yAxisKey?: keyof Pick<Country, 'malnutrition_rate' | 'stability_index' | 'import_ratio'>;
}

interface ScatterDataPoint {
  name: string;
  cluster: number;
  x: number;
  y: number;
  color: string;
}

// Custom tooltip component (outside of render)
function CustomTooltip(props: { active?: boolean; payload?: Array<{ payload?: ScatterDataPoint }>; xAxisKey: string; yAxisKey: string }) {
  const { active, payload, xAxisKey, yAxisKey } = props;
  if (active && payload && payload.length && payload[0].payload) {
    const data = payload[0].payload;
    return (
      <div className="bg-background border border-border rounded-lg shadow-lg p-3">
        <p className="font-semibold text-sm mb-1">{data.name}</p>
        <p className="text-xs text-muted-foreground mb-2">
          {CLUSTER_LABELS[data.cluster - 1]}
        </p>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">
              {xAxisKey === 'food_supply' ? 'Food Supply' :
               xAxisKey === 'protein_supply' ? 'Protein Supply' :
               xAxisKey === 'import_ratio' ? 'Import Ratio' :
               'Stability Index'}:
            </span>
            <span className="font-medium">
              {xAxisKey === 'import_ratio'
                ? `${data.x.toFixed(1)}%`
                : data.x.toFixed(0)}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">
              {yAxisKey === 'malnutrition_rate' ? 'Malnutrition Rate' :
               yAxisKey === 'stability_index' ? 'Stability Index' :
               'Import Ratio'}:
            </span>
            <span className="font-medium">
              {yAxisKey === 'malnutrition_rate' || yAxisKey === 'import_ratio'
                ? `${data.y.toFixed(1)}%`
                : data.y.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

export function ScatterPlot({
  countries,
  title = 'Cluster Visualization',
  description = 'Countries plotted by food security metrics',
  xAxisKey = 'food_supply',
  yAxisKey = 'malnutrition_rate'
}: ScatterPlotProps) {
  // Transform data for scatter plot
  const scatterData: ScatterDataPoint[] = countries.map((country) => ({
    name: country.name,
    cluster: country.cluster,
    x: country[xAxisKey] as number,
    y: country[yAxisKey] as number,
    color: CLUSTER_COLORS[country.cluster - 1] || CLUSTER_COLORS[2]
  }));

  // Group data by cluster for legend
  const clusterGroups = Array.from({ length: 5 }, (_, i) => {
    const clusterNum = i + 1;
    const clusterData = scatterData.filter(d => d.cluster === clusterNum);
    return {
      cluster: clusterNum,
      name: CLUSTER_LABELS[clusterNum - 1] || `Cluster ${clusterNum}`,
      data: clusterData,
      color: CLUSTER_COLORS[i]
    };
  }).filter(group => group.data.length > 0);

  // Axis labels
  const xAxisLabel = xAxisKey === 'food_supply' ? 'Food Supply (kcal/capita/day)' :
                     xAxisKey === 'protein_supply' ? 'Protein Supply (g/capita/day)' :
                     xAxisKey === 'import_ratio' ? 'Import Ratio (%)' :
                     'Stability Index';

  const yAxisLabel = yAxisKey === 'malnutrition_rate' ? 'Malnutrition Rate (%)' :
                     yAxisKey === 'stability_index' ? 'Stability Index' :
                     'Import Ratio (%)';

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={500}>
          <ScatterChart margin={{ top: 20, right: 30, bottom: 60, left: 60 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              type="number"
              dataKey="x"
              name={xAxisLabel}
              label={{
                value: xAxisLabel,
                position: 'bottom',
                offset: 40,
                style: { textAnchor: 'middle', fontSize: '12px' }
              }}
              className="text-xs"
            />
            <YAxis
              type="number"
              dataKey="y"
              name={yAxisLabel}
              label={{
                value: yAxisLabel,
                angle: -90,
                position: 'left',
                offset: 40,
                style: { textAnchor: 'middle', fontSize: '12px' }
              }}
              className="text-xs"
            />
            <Tooltip content={<CustomTooltip xAxisKey={xAxisKey} yAxisKey={yAxisKey} />} />
            <Legend
              verticalAlign="top"
              height={36}
              wrapperStyle={{ paddingBottom: '10px' }}
            />
            {clusterGroups.map((group) => (
              <Scatter
                key={group.cluster}
                name={group.name}
                data={group.data}
                fill={group.color}
              >
                {group.data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                  />
                ))}
              </Scatter>
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
