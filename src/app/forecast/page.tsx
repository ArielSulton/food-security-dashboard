'use client';

import { useIndonesiaForecast, useIndonesiaHistorical } from '@/lib/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, AlertCircle } from 'lucide-react';
import { TimeSeriesChart } from '@/components/charts/TimeSeriesChart';

export default function ForecastPage() {
  const { data: forecast } = useIndonesiaForecast();
  const { data: historical } = useIndonesiaHistorical();

  const forecast2025 = forecast?.find(f => f.year === 2025);

  // Combine historical and forecast for charts
  const combinedData = historical && forecast ? [...historical, ...forecast] : [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Prediksi 2025</h1>
        <p className="text-muted-foreground mt-2">
          Prediksi berbasis ARIMA untuk indikator ketahanan pangan Indonesia
        </p>
      </div>

      {/* 2025 Prediction Card */}
      {forecast2025 && (
        <Card className="border-2 border-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Prediksi 2025
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <div>
                <div className="text-sm text-muted-foreground">Food Supply</div>
                <div className="text-2xl font-bold">{forecast2025.food_supply.toFixed(0)}</div>
                <div className="text-xs text-muted-foreground">kcal/capita/day</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Malnutrition Rate</div>
                <div className="text-2xl font-bold">{forecast2025.malnutrition_rate.toFixed(1)}%</div>
                <div className="text-xs text-muted-foreground">prevalence</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Stability Index</div>
                <div className="text-2xl font-bold">{forecast2025.stability_index.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">index value</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Import Ratio</div>
                <div className="text-2xl font-bold">{forecast2025.import_ratio.toFixed(1)}%</div>
                <div className="text-xs text-muted-foreground">dependency</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Protein Supply</div>
                <div className="text-2xl font-bold">{forecast2025.protein_supply.toFixed(0)}</div>
                <div className="text-xs text-muted-foreground">g/capita/day</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Forecast Charts */}
      {combinedData.length > 0 && (
        <TimeSeriesChart
          data={combinedData}
          title="Prediksi Lengkap (2010-2025)"
          selectedMetrics={['food_supply', 'malnutrition_rate', 'stability_index', 'import_ratio', 'protein_supply']}
        />
      )}

      {/* Model Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Metrik Performa Model</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <div className="font-medium">Model ARIMA</div>
                <p className="text-sm text-muted-foreground mt-1">
                  Parameter ARIMA dipilih otomatis untuk setiap indikator berdasarkan data historis (2010-2022).
                  Model dievaluasi menggunakan metrik RMSE, MAE, dan MAPE.
                </p>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <div className="p-3 border rounded-lg">
                <div className="text-sm text-muted-foreground">RMSE</div>
                <div className="text-lg font-bold">Bervariasi</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Root Mean Square Error
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="text-sm text-muted-foreground">MAE</div>
                <div className="text-lg font-bold">Bervariasi</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Mean Absolute Error
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="text-sm text-muted-foreground">MAPE</div>
                <div className="text-lg font-bold">Bervariasi</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Mean Absolute Percentage Error
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Forecast Table */}
      <Card>
        <CardHeader>
          <CardTitle>Data Prediksi (2023-2025)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Tahun</th>
                  <th className="text-right p-2">Food Supply</th>
                  <th className="text-right p-2">Malnutrition</th>
                  <th className="text-right p-2">Stability</th>
                  <th className="text-right p-2">Import Ratio</th>
                  <th className="text-right p-2">Protein</th>
                </tr>
              </thead>
              <tbody>
                {forecast?.map((data) => (
                  <tr key={data.year} className="border-b hover:bg-muted/50">
                    <td className="p-2 font-medium">{data.year}</td>
                    <td className="text-right p-2">{data.food_supply.toFixed(0)}</td>
                    <td className="text-right p-2">{data.malnutrition_rate.toFixed(1)}%</td>
                    <td className="text-right p-2">{data.stability_index.toFixed(2)}</td>
                    <td className="text-right p-2">{data.import_ratio.toFixed(1)}%</td>
                    <td className="text-right p-2">{data.protein_supply.toFixed(0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
