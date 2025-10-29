import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';

// TypeScript interfaces
interface Country {
  name: string;
  cluster: number;
  membership: number[];
  food_supply: number;
  import_ratio: number;
  malnutrition_rate: number;
  protein_supply: number;
  stability_index: number;
}

interface Cluster {
  id: number;
  label: string;
  count: number;
  members: string[];
  avg_metrics: {
    food_supply: number;
    import_ratio: number;
    malnutrition_rate: number;
    protein_supply: number;
    stability_index: number;
  };
  color: string;
}

interface IndonesiaData {
  year: number;
  food_supply: number;
  import_ratio: number;
  malnutrition_rate: number;
  protein_supply: number;
  stability_index: number;
  is_forecast: boolean;
}

interface GlobalStats {
  total_countries: number;
  total_clusters: number;
  avg_metrics: Record<string, number>;
  best_countries: Array<{ name: string; stability: number }>;
  worst_countries: Array<{ name: string; stability: number }>;
  indonesia_rank: number;
}

// Cluster labels and colors
const CLUSTER_LABELS: Record<number, string> = {
  1: 'Poor',
  2: 'Below Average',
  3: 'Moderate',
  4: 'Good',
  5: 'Excellent'
};

const CLUSTER_COLORS: Record<number, string> = {
  1: '#d73027',
  2: '#fc8d59',
  3: '#fee090',
  4: '#91cf60',
  5: '#1a9850'
};

// Read CSV file
function readCSV(filePath: string): any[] {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });
  return records;
}

// Process countries data
function processCountries(cleanData: any[], clusteredData: any[]): Country[] {
  const countries: Country[] = [];

  // Create a map for quick lookup
  const clusteredMap = new Map();
  clusteredData.forEach(row => {
    const name = row.Area || row.Country || row.country || row.name;
    clusteredMap.set(name, row);
  });

  clusteredData.forEach(row => {
    const countryName = row.Area || row.Country || row.country || row.name;

    // Extract cluster number from "Cluster 5" format
    const clusterStr = row.Cluster || row.cluster || '';
    const clusterMatch = clusterStr.match(/\d+/);
    const clusterNum = clusterMatch ? parseInt(clusterMatch[0]) : 3;

    countries.push({
      name: countryName,
      cluster: clusterNum,
      membership: [
        parseFloat(row.Cluster1 || row.cluster_1 || 0),
        parseFloat(row.Cluster2 || row.cluster_2 || 0),
        parseFloat(row.Cluster3 || row.cluster_3 || 0),
        parseFloat(row.Cluster4 || row.cluster_4 || 0),
        parseFloat(row.Cluster5 || row.cluster_5 || 0)
      ],
      food_supply: parseFloat(row.food_supply || 0),
      import_ratio: parseFloat(row.import_ratio || 0),
      malnutrition_rate: parseFloat(row.malnutrition_rate || 0),
      protein_supply: parseFloat(row.protein_supply || 0),
      stability_index: parseFloat(row.stability_index || 0)
    });
  });

  return countries;
}

// Process clusters data
function processClusters(countries: Country[]): Cluster[] {
  const clusters: Cluster[] = [];

  for (let i = 1; i <= 5; i++) {
    const members = countries.filter(c => c.cluster === i);

    const avgMetrics = {
      food_supply: members.reduce((sum, c) => sum + c.food_supply, 0) / members.length,
      import_ratio: members.reduce((sum, c) => sum + c.import_ratio, 0) / members.length,
      malnutrition_rate: members.reduce((sum, c) => sum + c.malnutrition_rate, 0) / members.length,
      protein_supply: members.reduce((sum, c) => sum + c.protein_supply, 0) / members.length,
      stability_index: members.reduce((sum, c) => sum + c.stability_index, 0) / members.length
    };

    clusters.push({
      id: i,
      label: CLUSTER_LABELS[i],
      count: members.length,
      members: members.map(c => c.name),
      avg_metrics: avgMetrics,
      color: CLUSTER_COLORS[i]
    });
  }

  return clusters;
}

// Process Indonesia historical data
function processIndonesiaHistorical(data: any[]): IndonesiaData[] {
  return data.map(row => ({
    year: parseInt(row.Year || row.year),
    food_supply: parseFloat(row.Food_Supply || row.food_supply || 0),
    import_ratio: parseFloat(row.Import_Ratio || row.import_ratio || 0),
    malnutrition_rate: parseFloat(row.Malnutrition_Rate || row.malnutrition_rate || 0),
    protein_supply: parseFloat(row.Protein_Supply || row.protein_supply || 0),
    stability_index: parseFloat(row.Stability_Index || row.stability_index || 0),
    is_forecast: false
  }));
}

// Process Indonesia forecast data
function processIndonesiaForecast(data: any[]): IndonesiaData[] {
  return data
    .filter(row => parseInt(row.Year || row.year) > 2022)
    .map(row => ({
      year: parseInt(row.Year || row.year),
      food_supply: parseFloat(row.Food_Supply || row.food_supply || 0),
      import_ratio: parseFloat(row.Import_Ratio || row.import_ratio || 0),
      malnutrition_rate: parseFloat(row.Malnutrition_Rate || row.malnutrition_rate || 0),
      protein_supply: parseFloat(row.Protein_Supply || row.protein_supply || 0),
      stability_index: parseFloat(row.Stability_Index || row.stability_index || 0),
      is_forecast: true
    }));
}

// Generate global statistics
function generateGlobalStats(countries: Country[]): GlobalStats {
  const sortedByStability = [...countries].sort((a, b) => b.stability_index - a.stability_index);

  const indonesia = countries.find(c => c.name && c.name.toLowerCase().includes('indonesia'));
  const indonesiaRank = indonesia
    ? sortedByStability.findIndex(c => c.name && c.name.toLowerCase().includes('indonesia')) + 1
    : 0;

  return {
    total_countries: countries.length,
    total_clusters: 5,
    avg_metrics: {
      food_supply: countries.reduce((sum, c) => sum + c.food_supply, 0) / countries.length,
      import_ratio: countries.reduce((sum, c) => sum + c.import_ratio, 0) / countries.length,
      malnutrition_rate: countries.reduce((sum, c) => sum + c.malnutrition_rate, 0) / countries.length,
      protein_supply: countries.reduce((sum, c) => sum + c.protein_supply, 0) / countries.length,
      stability_index: countries.reduce((sum, c) => sum + c.stability_index, 0) / countries.length
    },
    best_countries: sortedByStability.slice(0, 10).map(c => ({
      name: c.name,
      stability: c.stability_index
    })),
    worst_countries: sortedByStability.slice(-10).reverse().map(c => ({
      name: c.name,
      stability: c.stability_index
    })),
    indonesia_rank: indonesiaRank
  };
}

// Main ETL process
async function main() {
  try {
    console.log('🚀 Starting ETL process...');

    // Define paths
    const datasetDir = path.join(__dirname, '../../dataset');
    const outputDir = path.join(__dirname, '../public/data');

    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Read CSV files
    console.log('📖 Reading CSV files...');
    const cleanData = readCSV(path.join(datasetDir, 'A-clean-data.csv'));
    const clusteredData = readCSV(path.join(datasetDir, 'B-clustered-data.csv'));
    const indonesiaHistorical = readCSV(path.join(datasetDir, 'C-indonesia-combined-data.csv'));
    const indonesiaForecast = readCSV(path.join(datasetDir, 'D-indonesia-combined-data-with-forecast.csv'));

    // Process data
    console.log('⚙️  Processing countries data...');
    const countries = processCountries(cleanData, clusteredData);

    console.log('⚙️  Processing clusters data...');
    const clusters = processClusters(countries);

    console.log('⚙️  Processing Indonesia historical data...');
    const indonesiaHist = processIndonesiaHistorical(indonesiaHistorical);

    console.log('⚙️  Processing Indonesia forecast data...');
    const indonesiaFcst = processIndonesiaForecast(indonesiaForecast);

    console.log('⚙️  Generating global statistics...');
    const globalStats = generateGlobalStats(countries);

    // Write JSON files
    console.log('💾 Writing JSON files...');
    fs.writeFileSync(
      path.join(outputDir, 'countries.json'),
      JSON.stringify(countries, null, 2)
    );

    fs.writeFileSync(
      path.join(outputDir, 'clusters.json'),
      JSON.stringify(clusters, null, 2)
    );

    fs.writeFileSync(
      path.join(outputDir, 'indonesia-historical.json'),
      JSON.stringify(indonesiaHist, null, 2)
    );

    fs.writeFileSync(
      path.join(outputDir, 'indonesia-forecast.json'),
      JSON.stringify(indonesiaFcst, null, 2)
    );

    fs.writeFileSync(
      path.join(outputDir, 'global-stats.json'),
      JSON.stringify(globalStats, null, 2)
    );

    // Write metadata
    const metadata = {
      generation_date: new Date().toISOString(),
      source_files: [
        'A-clean-data.csv',
        'B-clustered-data.csv',
        'C-indonesia-combined-data.csv',
        'D-indonesia-combined-data-with-forecast.csv'
      ],
      total_records: countries.length,
      data_version: '1.0.0'
    };

    fs.writeFileSync(
      path.join(outputDir, '_metadata.json'),
      JSON.stringify(metadata, null, 2)
    );

    // Print summary
    console.log('\n✅ ETL process completed successfully!');
    console.log(`   Countries: ${countries.length}`);
    console.log(`   Clusters: ${clusters.length}`);
    console.log(`   Indonesia historical records: ${indonesiaHist.length}`);
    console.log(`   Indonesia forecast records: ${indonesiaFcst.length}`);
    console.log(`\n📂 Output files saved to: ${outputDir}`);

  } catch (error) {
    console.error('❌ ETL process failed:', error);
    process.exit(1);
  }
}

// Run the ETL process
main();
