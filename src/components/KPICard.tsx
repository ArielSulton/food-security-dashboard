'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn, formatNumber, formatPercentage, getTrendIndicator } from '@/lib/utils';
import { ArrowDown, ArrowUp, Minus, LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: LucideIcon;
  colorScheme?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
  className?: string;
}

const colorSchemes = {
  blue: {
    bg: 'bg-blue-50',
    icon: 'text-blue-600',
    trend: {
      up: 'text-blue-600',
      down: 'text-blue-600',
      neutral: 'text-blue-600',
    },
  },
  green: {
    bg: 'bg-green-50',
    icon: 'text-green-600',
    trend: {
      up: 'text-green-600',
      down: 'text-green-600',
      neutral: 'text-green-600',
    },
  },
  red: {
    bg: 'bg-red-50',
    icon: 'text-red-600',
    trend: {
      up: 'text-red-600',
      down: 'text-red-600',
      neutral: 'text-red-600',
    },
  },
  yellow: {
    bg: 'bg-yellow-50',
    icon: 'text-yellow-600',
    trend: {
      up: 'text-yellow-600',
      down: 'text-yellow-600',
      neutral: 'text-yellow-600',
    },
  },
  purple: {
    bg: 'bg-purple-50',
    icon: 'text-purple-600',
    trend: {
      up: 'text-purple-600',
      down: 'text-purple-600',
      neutral: 'text-purple-600',
    },
  },
};

export function KPICard({
  title,
  value,
  unit,
  change,
  trend,
  icon: Icon,
  colorScheme = 'blue',
  className,
}: KPICardProps) {
  const colors = colorSchemes[colorScheme];
  const calculatedTrend = trend || (change !== undefined ? getTrendIndicator(change) : 'neutral');

  const TrendIcon =
    calculatedTrend === 'up' ? ArrowUp : calculatedTrend === 'down' ? ArrowDown : Minus;

  return (
    <Card
      className={cn(
        'transition-all hover:shadow-lg',
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && (
          <div className={cn('p-2 rounded-lg', colors.bg)}>
            <Icon className={cn('h-4 w-4', colors.icon)} />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline space-x-2">
          <div className="text-2xl font-bold">
            {typeof value === 'number' ? formatNumber(value, 0) : value}
          </div>
          {unit && (
            <div className="text-sm text-muted-foreground">{unit}</div>
          )}
        </div>
        {change !== undefined && (
          <div className="flex items-center mt-2">
            <TrendIcon
              className={cn('h-4 w-4 mr-1', colors.trend[calculatedTrend])}
            />
            <span className={cn('text-sm font-medium', colors.trend[calculatedTrend])}>
              {formatPercentage(change)}
            </span>
            <span className="text-sm text-muted-foreground ml-1">from last period</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
