'use client';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CLUSTER_LABELS, CLUSTER_COLORS } from '@/lib/types';
import { useDashboardStore } from '@/lib/store';

export function ClusterFilter() {
  const { selectedCluster, setSelectedCluster } = useDashboardStore();

  const handleValueChange = (value: string) => {
    if (value === 'all') {
      setSelectedCluster(null);
    } else {
      setSelectedCluster(parseInt(value));
    }
  };

  return (
    <Select
      value={selectedCluster?.toString() || 'all'}
      onValueChange={handleValueChange}
    >
      <SelectTrigger className="w-[240px]">
        <SelectValue placeholder="Filter berdasarkan klaster" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Pilih Klaster</SelectLabel>
          <SelectItem value="all">Semua Klaster</SelectItem>
          {[1, 2, 3, 4, 5].map((clusterNum) => {
            const label = CLUSTER_LABELS[clusterNum];
            const colorIndex = clusterNum - 1;
            return (
              <SelectItem key={clusterNum} value={clusterNum.toString()}>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: CLUSTER_COLORS[colorIndex] }}
                  />
                  <span>Klaster {clusterNum}: {label}</span>
                </div>
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
