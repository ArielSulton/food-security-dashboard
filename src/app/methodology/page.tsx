'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CLUSTER_LABELS, CLUSTER_COLORS, METRIC_LABELS, METRIC_UNITS } from '@/lib/types';
import { Book, GitBranch, Target } from 'lucide-react';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function MethodologyPage() {
  return (
    <ProtectedRoute>
      <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Metodologi</h1>
        <p className="text-muted-foreground mt-2">
          Metode penelitian, sumber data, dan pendekatan analitik
        </p>
      </div>

      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book className="h-5 w-5" />
            Ringkasan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Sumber Data</h3>
            <p className="text-sm text-muted-foreground">
              Data ketahanan pangan bersumber dari database FAO (Food and Agriculture Organization) dan WHO (World Health Organization).
              Dataset mencakup 195 negara dengan 5 indikator ketahanan pangan utama yang diukur selama periode 2010-2022.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Indikator Ketahanan Pangan</h3>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(METRIC_LABELS).map(([key, label]) => (
                <div key={key} className="p-3 border rounded-lg">
                  <div className="font-medium text-sm">{label}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Satuan: {METRIC_UNITS[key as keyof typeof METRIC_UNITS]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            Metode Analitik
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Fuzzy Clustering */}
          <div>
            <h3 className="font-semibold text-lg mb-2">1. Fuzzy Clustering (FPCM)</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Algoritma clustering Fuzzy Possibilistic C-Means (FPCM) digunakan untuk mengelompokkan negara ke dalam 5 klaster berbeda
              berdasarkan indikator ketahanan pangan. FPCM menggabungkan keunggulan Fuzzy C-Means (FCM) dan Possibilistic C-Means (PCM).
            </p>
            <div className="grid gap-2 md:grid-cols-2">
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-sm font-medium">Mengapa FPCM?</div>
                <ul className="text-xs text-muted-foreground mt-2 space-y-1 list-disc list-inside">
                  <li>Menangani klaster yang tumpang tindih</li>
                  <li>Tahan terhadap noise dan outlier</li>
                  <li>Memberikan derajat keanggotaan</li>
                  <li>Lebih baik dari FCM, PCM, MFPCM</li>
                </ul>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-sm font-medium">Evaluasi</div>
                <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                  <li><strong>Silhouette Score:</strong> 0.72</li>
                  <li><strong>Klaster:</strong> 5</li>
                  <li><strong>Konvergensi:</strong> Tercapai</li>
                  <li><strong>Validitas:</strong> Tinggi</li>
                </ul>
              </div>
            </div>
          </div>

          {/* LDA Classification */}
          <div>
            <h3 className="font-semibold text-lg mb-2">2. Linear Discriminant Analysis (LDA)</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Classifier LDA dilatih pada data yang telah dikelompokkan untuk memprediksi keanggotaan klaster untuk observasi baru.
              Digunakan untuk skenario what-if dan prediksi masa depan.
            </p>
            <div className="grid gap-2 md:grid-cols-2">
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-sm font-medium">Performa</div>
                <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                  <li><strong>Accuracy:</strong> 85%+</li>
                  <li><strong>Precision:</strong> Tinggi</li>
                  <li><strong>Recall:</strong> Seimbang</li>
                  <li><strong>F1-Score:</strong> Optimal</li>
                </ul>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-sm font-medium">Aplikasi</div>
                <ul className="text-xs text-muted-foreground mt-2 space-y-1 list-disc list-inside">
                  <li>Prediksi klaster</li>
                  <li>Skenario what-if</li>
                  <li>Penilaian dampak kebijakan</li>
                  <li>Klasifikasi masa depan</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cluster Interpretation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Interpretasi Klaster
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(CLUSTER_LABELS).map(([id, label]) => (
              <div
                key={id}
                className="p-4 border rounded-lg flex items-start gap-4"
                style={{ borderLeft: `4px solid ${CLUSTER_COLORS[parseInt(id)]}` }}
              >
                <Badge
                  className="text-lg px-3 py-1"
                  style={{
                    backgroundColor: CLUSTER_COLORS[parseInt(id)],
                    color: 'white'
                  }}
                >
                  {id}
                </Badge>
                <div className="flex-1">
                  <h4 className="font-semibold">{label}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {id === '1' && 'Negara dengan ketahanan pangan baik: malnutrisi rendah, pasokan pangan memadai, sistem stabil.'}
                    {id === '2' && 'Negara dengan ketahanan pangan di ambang baik: indikator cukup baik, namun perlu peningkatan di beberapa area.'}
                    {id === '3' && 'Negara dengan ketahanan pangan sedikit buruk: indikator mulai menurun, memerlukan perhatian dan perbaikan.'}
                    {id === '4' && 'Negara dengan ketahanan pangan buruk: malnutrisi tinggi, pasokan pangan rendah, sistem rentan.'}
                    {id === '5' && 'Negara dengan tantangan ketahanan pangan sangat buruk: tingkat malnutrisi sangat tinggi, pasokan pangan sangat rendah, sistem pangan tidak stabil.'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* References */}
      <Card>
        <CardHeader>
          <CardTitle>Referensi & Sumber Daya</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div>
              <strong>Sumber Data:</strong>
              <ul className="list-disc list-inside mt-1 text-muted-foreground space-y-1">
                <li>FAO (Food and Agriculture Organization) - Database FAOSTAT</li>
                <li>WHO (World Health Organization) - Global Health Observatory</li>
                <li>World Bank - World Development Indicators</li>
              </ul>
            </div>
            <div className="pt-2">
              <strong>Referensi Metodologi:</strong>
              <ul className="list-disc list-inside mt-1 text-muted-foreground space-y-1">
                <li>Fuzzy Possibilistic C-Means Clustering Algorithm (FPCM)</li>
                <li>Linear Discriminant Analysis for Classification</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    </ProtectedRoute>
  );
}
