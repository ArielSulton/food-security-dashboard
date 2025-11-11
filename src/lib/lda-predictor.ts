// LDA (Linear Discriminant Analysis) Predictor
// Based on the trained LDA model for food security cluster prediction

import ldaModel from '../../public/model/lda_model.json';

export interface InputMetrics {
  food_supply: number;
  import_ratio: number;
  malnutrition_rate: number;
  protein_supply: number;
  stability_index: number;
}

export interface PredictionResult {
  predictedCluster: string;
  score: number;
  scores: Record<string, number>;
  confidence: number;
}

// Euclidean distance between two vectors
function euclideanDistance(vec1: number[], vec2: number[]): number {
  if (vec1.length !== vec2.length) {
    throw new Error('Vectors must have same length');
  }
  return Math.sqrt(
    vec1.reduce((sum, val, idx) => {
      const diff = val - vec2[idx];
      return sum + diff * diff;
    }, 0)
  );
}

// Normalize feature values to [0, 1] range
function normalizeVector(vector: number[], ranges: Array<{min: number, max: number}>): number[] {
  return vector.map((val, idx) => {
    const range = ranges[idx];
    return (val - range.min) / (range.max - range.min + 0.0001); // Add small epsilon to avoid division by zero
  });
}

// Main prediction function
export function predictCluster(input: InputMetrics): PredictionResult {
  const { features, classes, means, priors } = ldaModel;

  // Convert input object to vector in correct feature order
  const inputVector = features.map(feat => input[feat as keyof InputMetrics]);

  // Get feature ranges for normalization
  const featureRanges = features.map(feature => {
    const values = means.map(m => m[feature as keyof typeof m] as number);
    return {
      min: Math.min(...values) * 0.5,
      max: Math.max(...values) * 1.5
    };
  });

  // Normalize input vector
  const normalizedInput = normalizeVector(inputVector, featureRanges);

  // Calculate distance-based scores for each cluster
  const distances: Record<string, number> = {};
  const scores: Record<string, number> = {};
  let minDistance = Infinity;
  let predictedCluster = '';

  classes.forEach((clusterName) => {
    // Find the mean values for this cluster
    const clusterMeans = means.find(m => m._row === clusterName);

    if (!clusterMeans) {
      throw new Error(`No means found for cluster: ${clusterName}`);
    }

    // Extract mean vector in feature order
    const meanVector = features.map(feat => clusterMeans[feat as keyof typeof clusterMeans] as number);

    // Normalize mean vector
    const normalizedMean = normalizeVector(meanVector, featureRanges);

    // Calculate distance
    const distance = euclideanDistance(normalizedInput, normalizedMean);
    distances[clusterName] = distance;

    // Get prior for this cluster
    const prior = priors[clusterName as keyof typeof priors][0];

    // Score = -distance + log(prior) (higher score is better)
    // Weight distance more heavily than prior
    const score = -distance * 10 + Math.log(prior);
    scores[clusterName] = score;

    if (distance < minDistance) {
      minDistance = distance;
      predictedCluster = clusterName;
    }
  });

  // Use the cluster with highest score (combination of distance and prior)
  let maxScore = -Infinity;
  Object.entries(scores).forEach(([clusterName, score]) => {
    if (score > maxScore) {
      maxScore = score;
      predictedCluster = clusterName;
    }
  });

  // Calculate confidence based on relative distances
  const distanceValues = Object.values(distances);
  const minDist = Math.min(...distanceValues);
  const secondMinDist = distanceValues.sort((a, b) => a - b)[1] || minDist + 1;

  // Confidence based on how much closer we are to nearest cluster vs second nearest
  const confidence = Math.min(100, Math.max(40, 100 * (1 - minDist / (secondMinDist + 0.0001))));

  return {
    predictedCluster,
    score: maxScore,
    scores,
    confidence
  };
}

// Get reasonable input ranges based on model means
export function getInputRanges() {
  const { means, features } = ldaModel;

  const ranges: Record<string, { min: number; max: number; default: number }> = {};

  features.forEach(feature => {
    const values = means.map(m => m[feature as keyof typeof m] as number);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;

    ranges[feature] = {
      min: Math.floor(min * 0.8), // 20% below minimum
      max: Math.ceil(max * 1.2), // 20% above maximum
      default: Math.round(avg)
    };
  });

  return ranges;
}

// Get feature labels in Indonesian
export const FEATURE_LABELS: Record<keyof InputMetrics, string> = {
  food_supply: 'Pasokan Pangan (kcal/capita/day)',
  import_ratio: 'Rasio Impor (%)',
  malnutrition_rate: 'Tingkat Malnutrisi (%)',
  protein_supply: 'Pasokan Protein (g/capita/day)',
  stability_index: 'Indeks Stabilitas'
};

// Get cluster label from cluster name
export function getClusterNumberFromName(clusterName: string): number {
  const match = clusterName.match(/Cluster (\d)/);
  return match ? parseInt(match[1]) : 0;
}
