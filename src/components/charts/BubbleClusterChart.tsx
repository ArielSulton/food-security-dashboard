'use client';

import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Country, CLUSTER_COLORS, CLUSTER_LABELS } from '@/lib/types';
import { getCountryContinent, getAllContinents, type Continent } from '@/lib/country-continent-map';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface BubbleClusterChartProps {
  countries: Country[];
  title?: string;
  description?: string;
}

interface BubbleNode {
  id: string;
  name: string;
  cluster: number;
  value: number;
  food_supply: number;
  malnutrition: number;
  stability: number;
  x: number;
  y: number;
  radius: number;
}

interface ClusterGroup {
  cluster: number;
  label: string;
  color: string;
  nodes: BubbleNode[];
  x: number;
  y: number;
  radius: number;
}

export function BubbleClusterChart({
  countries,
  title = 'Visualisasi Bubble Klaster',
  description = 'Distribusi negara berdasarkan klaster ketahanan pangan'
}: BubbleClusterChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedRegion, setSelectedRegion] = useState<'All' | Continent>('All');
  const [hoveredBubble, setHoveredBubble] = useState<BubbleNode | null>(null);
  const [dimensions, setDimensions] = useState({ width: 1000, height: 600 });
  const [clusterGroups, setClusterGroups] = useState<ClusterGroup[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  // Filter countries by selected region
  const filteredCountries = useMemo(() => {
    return selectedRegion === 'All'
      ? countries
      : countries.filter(c => getCountryContinent(c.name) === selectedRegion);
  }, [countries, selectedRegion]);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Simple circle packing within a cluster
  const packCirclesInCluster = useCallback((group: ClusterGroup, maxRadius: number) => {
    const nodes = group.nodes;
    if (nodes.length === 0) return;

    // Calculate radii based on value
    const maxValue = Math.max(...nodes.map(n => n.value));
    const minRadius = isMobile ? 8 : 12;
    const maxBubbleRadius = maxRadius * 0.35;

    nodes.forEach(node => {
      const normalizedValue = node.value / maxValue;
      node.radius = minRadius + normalizedValue * (maxBubbleRadius - minRadius);
    });

    // Sort by radius (largest first) for better packing
    nodes.sort((a, b) => b.radius - a.radius);

    // Simple force-based positioning
    if (nodes.length === 1) {
      nodes[0].x = group.x;
      nodes[0].y = group.y;
      return;
    }

    // Initialize positions in a spiral
    nodes.forEach((node, i) => {
      if (i === 0) {
        node.x = group.x;
        node.y = group.y;
      } else {
        const angle = i * 2.4;
        const distance = Math.sqrt(i) * 20;
        node.x = group.x + Math.cos(angle) * distance;
        node.y = group.y + Math.sin(angle) * distance;
      }
    });

    // Collision resolution iterations
    for (let iter = 0; iter < 100; iter++) {
      let moved = false;

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const nodeA = nodes[i];
          const nodeB = nodes[j];

          const dx = nodeB.x - nodeA.x;
          const dy = nodeB.y - nodeA.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const minDist = nodeA.radius + nodeB.radius + 3;

          if (distance < minDist && distance > 0.01) {
            moved = true;
            const angle = Math.atan2(dy, dx);
            const overlap = (minDist - distance) * 0.5;

            nodeA.x -= Math.cos(angle) * overlap;
            nodeA.y -= Math.sin(angle) * overlap;
            nodeB.x += Math.cos(angle) * overlap;
            nodeB.y += Math.sin(angle) * overlap;
          }
        }

        // Keep within cluster bounds
        const node = nodes[i];
        const dx = node.x - group.x;
        const dy = node.y - group.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDist = maxRadius - node.radius - 3;

        if (distance > maxDist) {
          moved = true;
          const angle = Math.atan2(dy, dx);
          node.x = group.x + Math.cos(angle) * maxDist;
          node.y = group.y + Math.sin(angle) * maxDist;
        }
      }

      if (!moved) break;
    }
  }, [isMobile]);

  // Calculate bubble positions
  useEffect(() => {
    if (!svgRef.current || filteredCountries.length === 0) return;

    const containerWidth = svgRef.current.clientWidth || 1000;
    const containerHeight = isMobile ? 400 : 600;
    setDimensions({ width: containerWidth, height: containerHeight });

    // Prepare hierarchical data: group by cluster
    const groups: ClusterGroup[] = [];

    for (let clusterNum = 1; clusterNum <= 5; clusterNum++) {
      const clusterCountries = filteredCountries.filter(c => c.cluster === clusterNum);

      if (clusterCountries.length > 0) {
        const nodes: BubbleNode[] = clusterCountries.map(country => ({
          id: country.name,
          name: country.name,
          cluster: country.cluster,
          // Better clusters (lower number) get higher values
          value: country.food_supply * (6 - country.cluster) * 0.8 + country.stability_index * 500,
          food_supply: country.food_supply,
          malnutrition: country.malnutrition_rate,
          stability: country.stability_index,
          x: 0,
          y: 0,
          radius: 0
        }));

        groups.push({
          cluster: clusterNum,
          label: CLUSTER_LABELS[clusterNum],
          color: CLUSTER_COLORS[clusterNum],
          nodes,
          x: 0,
          y: 0,
          radius: 0
        });
      }
    }

    // Calculate positions for cluster groups
    const padding = 40;
    const clusterCount = groups.length;
    const cols = Math.min(clusterCount, Math.ceil(Math.sqrt(clusterCount)));
    const rows = Math.ceil(clusterCount / cols);

    const cellWidth = (containerWidth - padding * 2) / cols;
    const cellHeight = (containerHeight - padding * 2) / rows;

    groups.forEach((group, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);

      // Center of this cluster's cell
      group.x = padding + col * cellWidth + cellWidth / 2;
      group.y = padding + row * cellHeight + cellHeight / 2;
      group.radius = Math.min(cellWidth, cellHeight) * 0.42;

      // Pack circles within this cluster
      packCirclesInCluster(group, group.radius);
    });

    setClusterGroups(groups);
  }, [filteredCountries, isMobile, packCirclesInCluster]);

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

        {/* Hierarchical Bubble Chart */}
        <div className="relative w-full bg-muted/20 rounded-lg" style={{ height: dimensions.height }}>
          <svg
            ref={svgRef}
            className="w-full"
            style={{ height: dimensions.height }}
            viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
            preserveAspectRatio="xMidYMid meet"
          >
            {clusterGroups.map((group) => (
              <g key={group.cluster}>
                {/* Cluster parent circle (background) */}
                <circle
                  cx={group.x}
                  cy={group.y}
                  r={group.radius}
                  fill={group.color}
                  fillOpacity={0.15}
                  stroke={group.color}
                  strokeWidth={3}
                  strokeDasharray="8,4"
                />

                {/* Cluster label */}
                <text
                  x={group.x}
                  y={group.y - group.radius - 15}
                  textAnchor="middle"
                  fontSize={isMobile ? "12" : "16"}
                  fontWeight="700"
                  fill={group.color}
                >
                  {group.label}
                </text>

                {/* Country bubbles */}
                {group.nodes.map((node) => (
                  <g key={node.id}>
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.radius}
                      fill={group.color}
                      fillOpacity={0.85}
                      stroke="white"
                      strokeWidth={2}
                      className="cursor-pointer transition-all hover:fill-opacity-100 hover:stroke-width-3"
                      onMouseEnter={() => setHoveredBubble(node)}
                      onMouseLeave={() => setHoveredBubble(null)}
                    />

                    {/* Country name inside bubble (if large enough) */}
                    {node.radius > 18 && (
                      <text
                        x={node.x}
                        y={node.y}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={Math.min(Math.max(node.radius / 3.5, 8), 11)}
                        fontWeight="600"
                        fill="white"
                        pointerEvents="none"
                        style={{
                          userSelect: 'none',
                          textShadow: '0 1px 3px rgba(0,0,0,0.6)'
                        }}
                      >
                        {node.name.length > 15 ? node.name.substring(0, 13) + '..' : node.name}
                      </text>
                    )}
                  </g>
                ))}
              </g>
            ))}
          </svg>

          {/* Tooltip */}
          {hoveredBubble && (
            <div
              className="absolute bg-background border-2 border-primary rounded-lg shadow-xl p-2 sm:p-3 pointer-events-none z-50"
              style={{
                left: `${(hoveredBubble.x / dimensions.width) * 100}%`,
                top: `${(hoveredBubble.y / dimensions.height) * 100}%`,
                transform: 'translate(-50%, -120%)',
                minWidth: isMobile ? '150px' : '180px',
                maxWidth: isMobile ? '200px' : 'none'
              }}
            >
              <p className="font-semibold text-xs sm:text-sm mb-1 sm:mb-2 border-b pb-1">{hoveredBubble.name}</p>
              <div className="space-y-0.5 sm:space-y-1 text-xs">
                <div className="flex justify-between gap-2 sm:gap-4">
                  <span className="text-muted-foreground">Klaster:</span>
                  <span className="font-medium">{CLUSTER_LABELS[hoveredBubble.cluster]}</span>
                </div>
                <div className="flex justify-between gap-2 sm:gap-4">
                  <span className="text-muted-foreground">Food Supply:</span>
                  <span className="font-medium">{hoveredBubble.food_supply.toFixed(0)}</span>
                </div>
                <div className="flex justify-between gap-2 sm:gap-4">
                  <span className="text-muted-foreground">Malnutrition:</span>
                  <span className="font-medium">{hoveredBubble.malnutrition.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between gap-2 sm:gap-4">
                  <span className="text-muted-foreground">Stability:</span>
                  <span className="font-medium">{hoveredBubble.stability.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-2 sm:gap-3 justify-center pt-4">
          {Object.entries(CLUSTER_LABELS).map(([id, label]) => (
            <div key={id} className="flex items-center gap-1.5 sm:gap-2">
              <div
                className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-white flex-shrink-0"
                style={{ backgroundColor: CLUSTER_COLORS[parseInt(id)] }}
              />
              <span className="text-xs sm:text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>

        <p className="text-xs sm:text-sm text-center text-muted-foreground mt-4 px-2">
          Ukuran bubble menunjukkan kualitas ketahanan pangan. Cluster dengan predikat lebih baik memiliki bubble lebih besar. Hover untuk detail.
        </p>
      </CardContent>
    </Card>
  );
}
