'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calculator, Sparkles, Info } from 'lucide-react';
import {
  predictCluster,
  getInputRanges,
  getClusterNumberFromName,
  FEATURE_LABELS,
  type InputMetrics
} from '@/lib/lda-predictor';
import { getClusterColor, getClusterLabel } from '@/lib/utils';

export default function SimulatorPage() {
  const inputRanges = getInputRanges();

  // Initialize with default values from model
  const [inputs, setInputs] = useState<InputMetrics>({
    food_supply: inputRanges.food_supply.default,
    import_ratio: inputRanges.import_ratio.default,
    malnutrition_rate: inputRanges.malnutrition_rate.default,
    protein_supply: inputRanges.protein_supply.default,
    stability_index: inputRanges.stability_index.default
  });

  const [prediction, setPrediction] = useState<{
    cluster: number;
    clusterName: string;
    confidence: number;
  } | null>(null);

  const [hasSimulated, setHasSimulated] = useState(false);

  const handleInputChange = (field: keyof InputMetrics, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setInputs(prev => ({
        ...prev,
        [field]: numValue
      }));
    }
  };

  const handlePredict = () => {
    try {
      const result = predictCluster(inputs);
      const clusterNumber = getClusterNumberFromName(result.predictedCluster);

      setPrediction({
        cluster: clusterNumber,
        clusterName: result.predictedCluster,
        confidence: result.confidence
      });

      setHasSimulated(true);
    } catch (error) {
      console.error('Prediction error:', error);
      alert('Terjadi kesalahan saat melakukan prediksi. Silakan cek nilai input Anda.');
    }
  };

  const handleReset = () => {
    setInputs({
      food_supply: inputRanges.food_supply.default,
      import_ratio: inputRanges.import_ratio.default,
      malnutrition_rate: inputRanges.malnutrition_rate.default,
      protein_supply: inputRanges.protein_supply.default,
      stability_index: inputRanges.stability_index.default
    });
    setPrediction(null);
    setHasSimulated(false);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-orange-600';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2 px-4 sm:px-0">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Simulator Klaster</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Prediksi klaster ketahanan pangan berdasarkan indikator yang Anda masukkan menggunakan Linear Discriminant Analysis (LDA)
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Input Indikator
            </CardTitle>
            <CardDescription>
              Masukkan nilai untuk setiap indikator ketahanan pangan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {(Object.keys(inputs) as Array<keyof InputMetrics>).map((field) => {
              const range = inputRanges[field];
              return (
                <div key={field} className="space-y-2">
                  <label htmlFor={field} className="text-sm font-medium flex items-center justify-between">
                    <span>{FEATURE_LABELS[field]}</span>
                    <span className="text-xs text-muted-foreground">
                      ({range.min} - {range.max})
                    </span>
                  </label>
                  <Input
                    id={field}
                    type="number"
                    value={inputs[field]}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    min={range.min}
                    max={range.max}
                    step={field === 'stability_index' ? 0.01 : field.includes('rate') || field.includes('ratio') ? 0.1 : 1}
                  />
                </div>
              );
            })}

            <div className="flex gap-3 pt-4">
              <Button onClick={handlePredict} className="flex-1">
                <Sparkles className="h-4 w-4 mr-2" />
                Prediksi Klaster
              </Button>
              <Button onClick={handleReset} variant="outline">
                Reset
              </Button>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex gap-2 text-sm text-blue-800">
                <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium mb-1">Tips:</p>
                  <ul className="text-xs space-y-1 list-disc list-inside">
                    <li>Nilai default diambil dari rata-rata data historis</li>
                    <li>Pasokan pangan dan protein lebih tinggi = klaster lebih baik</li>
                    <li>Malnutrisi dan rasio impor lebih rendah = klaster lebih baik</li>
                    <li>Stabilitas index lebih tinggi = klaster lebih baik</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Result Section */}
        <Card className={hasSimulated ? 'border-2 border-primary' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Hasil Prediksi
            </CardTitle>
            <CardDescription>
              Klaster ketahanan pangan yang diprediksi berdasarkan input Anda
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!hasSimulated ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Calculator className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">
                  Masukkan nilai indikator dan klik &quot;Prediksi Klaster&quot; untuk melihat hasil
                </p>
              </div>
            ) : prediction ? (
              <div className="space-y-6">
                {/* Main Result */}
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-2">Prediksi Klaster</div>
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <Badge
                      className="text-2xl px-6 py-2"
                      style={{
                        backgroundColor: getClusterColor(prediction.cluster),
                        color: 'white'
                      }}
                    >
                      {prediction.cluster}
                    </Badge>
                    <div className="text-left">
                      <div className="text-xl font-bold">
                        {getClusterLabel(prediction.cluster)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {prediction.clusterName}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border/50">
                    <div className="text-sm text-muted-foreground mb-1">Confidence Level</div>
                    <div className={`text-3xl font-bold ${getConfidenceColor(prediction.confidence)}`}>
                      {prediction.confidence.toFixed(1)}%
                    </div>
                  </div>
                </div>

                {/* Cluster Description */}
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-sm font-medium mb-2">Interpretasi:</div>
                  <p className="text-sm text-muted-foreground">
                    {prediction.cluster === 1 && 'Ketahanan pangan sangat baik dengan malnutrisi rendah, pasokan pangan memadai, dan sistem stabil.'}
                    {prediction.cluster === 2 && 'Ketahanan pangan di ambang baik dengan indikator cukup baik, namun perlu peningkatan di beberapa area.'}
                    {prediction.cluster === 3 && 'Ketahanan pangan sedikit buruk dengan indikator mulai menurun, memerlukan perhatian dan perbaikan.'}
                    {prediction.cluster === 4 && 'Ketahanan pangan buruk dengan malnutrisi tinggi, pasokan pangan rendah, dan sistem rentan.'}
                    {prediction.cluster === 5 && 'Ketahanan pangan sangat buruk dengan tingkat malnutrisi sangat tinggi, pasokan pangan sangat rendah, dan sistem pangan tidak stabil.'}
                  </p>
                </div>

                {/* Input Summary */}
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="text-sm font-medium mb-3">Ringkasan Input:</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {(Object.keys(inputs) as Array<keyof InputMetrics>).map((field) => (
                      <div key={field} className="flex justify-between">
                        <span className="text-muted-foreground">{FEATURE_LABELS[field].split('(')[0].trim()}:</span>
                        <span className="font-medium">{inputs[field].toFixed(field === 'stability_index' ? 2 : 1)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Tidak ada hasil prediksi</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Model Info */}
      <Card>
        <CardHeader>
          <CardTitle>Tentang Model</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>
            Simulator ini menggunakan <strong>Linear Discriminant Analysis (LDA)</strong>, sebuah metode klasifikasi statistik
            yang dilatih menggunakan data ketahanan pangan dari 195 negara.
          </p>
          <div className="grid md:grid-cols-2 gap-4 pt-2">
            <div className="p-3 bg-muted rounded-lg">
              <div className="font-medium mb-1">Metode</div>
              <div className="text-xs text-muted-foreground">Linear Discriminant Analysis (LDA)</div>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <div className="font-medium mb-1">Data Training</div>
              <div className="text-xs text-muted-foreground">195 negara, 5 indikator ketahanan pangan</div>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <div className="font-medium mb-1">Jumlah Klaster</div>
              <div className="text-xs text-muted-foreground">5 klaster (Sangat Baik - Sangat Buruk)</div>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <div className="font-medium mb-1">Akurasi Model</div>
              <div className="text-xs text-muted-foreground">&gt;85% pada data validasi</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
