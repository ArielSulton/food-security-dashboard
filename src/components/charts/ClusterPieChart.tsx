'use client';

import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Country, CLUSTER_COLORS, CLUSTER_LABELS } from '@/lib/types';
import { getCountryContinent, getAllContinents, type Continent } from '@/lib/country-continent-map';

interface ClusterPieChartProps {
  countries: Country[];
  title?: string;
  description?: string;
}

interface PieDataPoint {
  name: string;
  value: number;
  cluster: number;
  color: string;
  percentage: number;
}

// Custom label component for pie chart
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderCustomLabel = (props: any) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  // Only show label if percentage is significant enough
  if (percent < 0.05) return null;

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      className="text-xs font-semibold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// Custom tooltip
function CustomTooltip(props: { active?: boolean; payload?: Array<{ payload?: PieDataPoint }> }) {
  const { active, payload } = props;
  if (active && payload && payload.length && payload[0].payload) {
    const data = payload[0].payload;
    return (
      <div className="bg-background border border-border rounded-lg shadow-lg p-3">
        <p className="font-semibold text-sm mb-1">{data.name}</p>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Jumlah Negara:</span>
            <span className="font-medium">{data.value}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Persentase:</span>
            <span className="font-medium">{data.percentage.toFixed(1)}%</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

export function ClusterPieChart({
  countries,
  title = 'Distribusi Klaster',
  description = 'Proporsi negara dalam setiap klaster ketahanan pangan'
}: ClusterPieChartProps) {
  const [selectedRegion, setSelectedRegion] = useState<'All' | Continent>('All');

  // Filter countries by selected region
  const filteredCountries = selectedRegion === 'All'
    ? countries
    : countries.filter(c => getCountryContinent(c.name) === selectedRegion);

  // Calculate cluster distribution
  const clusterCounts = Array.from({ length: 5 }, (_, i) => {
    const clusterNum = i + 1;
    const count = filteredCountries.filter(c => c.cluster === clusterNum).length;
    return {
      name: CLUSTER_LABELS[clusterNum],
      value: count,
      cluster: clusterNum,
      color: CLUSTER_COLORS[clusterNum],
      percentage: (count / filteredCountries.length) * 100
    };
  }).filter(item => item.value > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {description}
          {' '}({filteredCountries.length} negara {selectedRegion !== 'All' ? `di ${selectedRegion}` : 'global'})
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Region Filter */}
        <Tabs value={selectedRegion} onValueChange={(val) => setSelectedRegion(val as 'All' | Continent)}>
          <div className="overflow-x-auto pb-2">
            <TabsList className="inline-flex w-auto min-w-full lg:grid lg:w-full lg:grid-cols-6 gap-1">
              <TabsTrigger value="All" className="text-xs sm:text-sm whitespace-nowrap">Semua</TabsTrigger>
              {getAllContinents().map(continent => (
                <TabsTrigger key={continent} value={continent} className="text-xs sm:text-sm whitespace-nowrap">
                  {continent}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>

        {/* Pie Chart */}
        <div className="w-full">
          <ResponsiveContainer width="100%" height={350} className="sm:hidden">
            <PieChart>
              <Pie
                data={clusterCounts}
                cx="50%"
                cy="45%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {clusterCounts.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={50}
                wrapperStyle={{ paddingTop: '15px', fontSize: '11px' }}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>

          <ResponsiveContainer width="100%" height={400} className="hidden sm:block">
            <PieChart>
              <Pie
                data={clusterCounts}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {clusterCounts.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={40}
                wrapperStyle={{ paddingTop: '20px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 pt-4 border-t">
          {clusterCounts.map((item) => (
            <div
              key={item.cluster}
              className="p-2 rounded-lg border"
              style={{ borderLeftColor: item.color, borderLeftWidth: '3px' }}
            >
              <div className="text-xs text-muted-foreground">{item.name}</div>
              <div className="text-lg font-bold">{item.value}</div>
              <div className="text-xs text-muted-foreground">{item.percentage.toFixed(1)}%</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
