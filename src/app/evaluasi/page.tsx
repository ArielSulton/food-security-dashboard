'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getClusterColor, getClusterLabel } from '@/lib/utils';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function EvaluasiPage() {
  // Data rata-rata atribut per cluster
  const clusterAverages = [
    { cluster: 1, count: 29, foodSupply: 2196.66, importRatio: 81.21, malnutrition: 31.00, protein: 56.25, stability: -0.90 },
    { cluster: 2, count: 43, foodSupply: 2985.79, importRatio: 55.02, malnutrition: 5.52, protein: 89.86, stability: 0.06 },
    { cluster: 3, count: 17, foodSupply: 3709.76, importRatio: 14.29, malnutrition: 2.50, protein: 121.35, stability: 0.33 },
    { cluster: 4, count: 43, foodSupply: 3354.40, importRatio: 15.72, malnutrition: 3.10, protein: 107.57, stability: 0.21 },
    { cluster: 5, count: 35, foodSupply: 2654.51, importRatio: 52.54, malnutrition: 13.76, protein: 73.14, stability: -0.64 },
  ];

  // Data evaluasi LDA
  const ldaEvaluation = {
    trainingAccuracy: 92.65,
    testingAccuracy: 96.77,
    cohensKappa: 95.84,
  };

  // Data komparasi metode clustering
  const clusteringComparison = [
    { k: 2, fpcm: { silhouette: 0.80, bssTss: 0.66 }, mfpcm: { silhouette: 0.87, bssTss: 0.66 }, fcm: { silhouette: 0.80, bssTss: 0.66 }, dbscan: { silhouette: 0.36, bssTss: 0.14 }, pcm: { silhouette: 0.65, bssTss: 0.00 } },
    { k: 3, fpcm: { silhouette: 0.86, bssTss: 0.83 }, mfpcm: { silhouette: 0.86, bssTss: 0.83 }, fcm: { silhouette: 0.79, bssTss: 0.83 }, dbscan: { silhouette: null, bssTss: null }, pcm: { silhouette: 0.62, bssTss: 0.62 } },
    { k: 4, fpcm: { silhouette: 0.82, bssTss: 0.88 }, mfpcm: { silhouette: 0.82, bssTss: 0.88 }, fcm: { silhouette: 0.74, bssTss: 0.88 }, dbscan: { silhouette: 0.24, bssTss: 0.63 }, pcm: { silhouette: 0.49, bssTss: 0.63 } },
    { k: 5, fpcm: { silhouette: 0.78, bssTss: 0.91 }, mfpcm: { silhouette: 0.78, bssTss: 0.91 }, fcm: { silhouette: 0.73, bssTss: 0.91 }, dbscan: { silhouette: 0.32, bssTss: 0.80 }, pcm: { silhouette: 0.66, bssTss: 0.64 } },
    { k: 6, fpcm: { silhouette: 0.73, bssTss: 0.93 }, mfpcm: { silhouette: 0.73, bssTss: 0.93 }, fcm: { silhouette: 0.70, bssTss: 0.93 }, dbscan: { silhouette: null, bssTss: null }, pcm: { silhouette: 0.20, bssTss: 0.73 } },
    { k: 7, fpcm: { silhouette: 0.67, bssTss: 0.94 }, mfpcm: { silhouette: 0.62, bssTss: 0.94 }, fcm: { silhouette: 0.69, bssTss: 0.94 }, dbscan: { silhouette: 0.41, bssTss: 0.92 }, pcm: { silhouette: 0.10, bssTss: 0.72 } },
    { k: 8, fpcm: { silhouette: 0.71, bssTss: 0.95 }, mfpcm: { silhouette: 0.68, bssTss: 0.95 }, fcm: { silhouette: 0.70, bssTss: 0.95 }, dbscan: { silhouette: null, bssTss: null }, pcm: { silhouette: 0.39, bssTss: 0.83 } },
    { k: 9, fpcm: { silhouette: 0.69, bssTss: 0.95 }, mfpcm: { silhouette: 0.63, bssTss: 0.95 }, fcm: { silhouette: 0.72, bssTss: 0.95 }, dbscan: { silhouette: 0.37, bssTss: 0.94 }, pcm: { silhouette: 0.23, bssTss: 0.86 } },
  ];

  return (
    <ProtectedRoute>
      <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Evaluasi Model</h1>
        <p className="text-muted-foreground">
          Hasil evaluasi clustering dan klasifikasi data ketahanan pangan
        </p>
      </div>

      {/* Tabel 3: Rata-rata Value Atribut Masing-masing Cluster */}
      <Card>
        <CardHeader>
          <CardTitle>Rata-rata Value Atribut Masing-masing Cluster</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Nilai rata-rata dari setiap atribut ketahanan pangan untuk masing-masing cluster
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-semibold">Cluster</th>
                  <th className="text-center p-3 font-semibold">Count</th>
                  <th className="text-right p-3 font-semibold">Food Supply</th>
                  <th className="text-right p-3 font-semibold">Import Ratio</th>
                  <th className="text-right p-3 font-semibold">Malnutrition</th>
                  <th className="text-right p-3 font-semibold">Protein</th>
                  <th className="text-right p-3 font-semibold">Stability</th>
                </tr>
              </thead>
              <tbody>
                {clusterAverages.map((data) => (
                  <tr key={data.cluster} className="border-b hover:bg-muted/50">
                    <td className="p-3">
                      <Badge
                        style={{
                          backgroundColor: getClusterColor(data.cluster),
                          color: 'white'
                        }}
                      >
                        {data.cluster} - {getClusterLabel(data.cluster)}
                      </Badge>
                    </td>
                    <td className="text-center p-3 font-medium">{data.count}</td>
                    <td className="text-right p-3">{data.foodSupply.toFixed(2)}</td>
                    <td className="text-right p-3">{data.importRatio.toFixed(2)}</td>
                    <td className="text-right p-3">{data.malnutrition.toFixed(2)}</td>
                    <td className="text-right p-3">{data.protein.toFixed(2)}</td>
                    <td className="text-right p-3">{data.stability.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Tabel 5: Hasil Evaluasi Klasifikasi Data Dengan LDA */}
      <Card>
        <CardHeader>
          <CardTitle>Hasil Evaluasi Klasifikasi Data Dengan LDA</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Linear Discriminant Analysis (LDA) digunakan untuk klasifikasi data ketahanan pangan
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-6 border rounded-lg text-center space-y-2 bg-linear-to-br from-blue-50 to-blue-100">
              <div className="text-sm text-muted-foreground font-medium">Akurasi Training</div>
              <div className="text-4xl font-bold text-blue-600">{ldaEvaluation.trainingAccuracy}%</div>
            </div>
            <div className="p-6 border rounded-lg text-center space-y-2 bg-linear-to-br from-green-50 to-green-100">
              <div className="text-sm text-muted-foreground font-medium">Akurasi Testing</div>
              <div className="text-4xl font-bold text-green-600">{ldaEvaluation.testingAccuracy}%</div>
            </div>
            <div className="p-6 border rounded-lg text-center space-y-2 bg-linear-to-br from-purple-50 to-purple-100">
              <div className="text-sm text-muted-foreground font-medium">Cohen&apos;s Kappa</div>
              <div className="text-4xl font-bold text-purple-600">{ldaEvaluation.cohensKappa}%</div>
            </div>
          </div>
          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Interpretasi:</strong> Model LDA menunjukkan performa yang sangat baik dengan akurasi testing mencapai 96.77%
              dan Cohen&apos;s Kappa sebesar 95.84%, menandakan kesepakatan yang sangat tinggi antara prediksi model dengan data aktual.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tabel 2: Hasil Komparasi Evaluasi Metode Clustering */}
      <Card>
        <CardHeader>
          <CardTitle>Hasil Komparasi Evaluasi Metode Clustering</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Perbandingan performa berbagai metode clustering menggunakan metrik Silhouette dan BSS/TSS
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th rowSpan={2} className="text-center p-2 font-semibold border-r">K</th>
                  <th colSpan={2} className="text-center p-2 font-semibold border-r">FPCM</th>
                  <th colSpan={2} className="text-center p-2 font-semibold border-r">MFPCM</th>
                  <th colSpan={2} className="text-center p-2 font-semibold border-r">FCM</th>
                  <th colSpan={2} className="text-center p-2 font-semibold border-r">DBSCAN</th>
                  <th colSpan={2} className="text-center p-2 font-semibold">PCM</th>
                </tr>
                <tr className="border-b bg-muted/50">
                  <th className="text-center p-2 font-medium">Silhouette</th>
                  <th className="text-center p-2 font-medium border-r">BSS/TSS</th>
                  <th className="text-center p-2 font-medium">Silhouette</th>
                  <th className="text-center p-2 font-medium border-r">BSS/TSS</th>
                  <th className="text-center p-2 font-medium">Silhouette</th>
                  <th className="text-center p-2 font-medium border-r">BSS/TSS</th>
                  <th className="text-center p-2 font-medium">Silhouette</th>
                  <th className="text-center p-2 font-medium border-r">BSS/TSS</th>
                  <th className="text-center p-2 font-medium">Silhouette</th>
                  <th className="text-center p-2 font-medium">BSS/TSS</th>
                </tr>
              </thead>
              <tbody>
                {clusteringComparison.map((data) => (
                  <tr key={data.k} className="border-b hover:bg-muted/50">
                    <td className="text-center p-2 font-semibold border-r">{data.k}</td>
                    <td className="text-center p-2">{data.fpcm.silhouette?.toFixed(2) ?? '-'}</td>
                    <td className="text-center p-2 border-r">{data.fpcm.bssTss?.toFixed(2) ?? '-'}</td>
                    <td className="text-center p-2">{data.mfpcm.silhouette?.toFixed(2) ?? '-'}</td>
                    <td className="text-center p-2 border-r">{data.mfpcm.bssTss?.toFixed(2) ?? '-'}</td>
                    <td className="text-center p-2">{data.fcm.silhouette?.toFixed(2) ?? '-'}</td>
                    <td className="text-center p-2 border-r">{data.fcm.bssTss?.toFixed(2) ?? '-'}</td>
                    <td className="text-center p-2">{data.dbscan.silhouette?.toFixed(2) ?? 'NaN'}</td>
                    <td className="text-center p-2 border-r">{data.dbscan.bssTss?.toFixed(2) ?? 'NaN'}</td>
                    <td className="text-center p-2">{data.pcm.silhouette?.toFixed(2) ?? '-'}</td>
                    <td className="text-center p-2">{data.pcm.bssTss?.toFixed(2) ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-2">
            <p className="text-sm text-muted-foreground">
              <strong>Keterangan Metrik:</strong>
            </p>
            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
              <li><strong>Silhouette Coefficient:</strong> Mengukur seberapa mirip objek dengan cluster-nya sendiri dibandingkan dengan cluster lain. Nilai mendekati 1 menunjukkan clustering yang baik.</li>
              <li><strong>BSS/TSS (Between Sum of Squares / Total Sum of Squares):</strong> Rasio variasi antar cluster terhadap variasi total. Nilai lebih tinggi menunjukkan pemisahan cluster yang lebih baik.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
    </ProtectedRoute>
  );
}
