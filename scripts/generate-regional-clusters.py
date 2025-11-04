import csv
import json
from collections import defaultdict

# Read the CSV file
csv_file = '../other/dataset/B-clustered-data.csv'
regional_data = defaultdict(lambda: defaultdict(int))

valid_regions = {'Africa', 'Americas', 'Asia', 'Europe', 'Oceania', 'Other'}

with open(csv_file, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        region = row['Region']
        cluster = row['Cluster']

        # Skip invalid regions
        if region not in valid_regions:
            continue

        # Extract cluster number (e.g., "Cluster 5" -> 5)
        try:
            cluster_num = int(cluster.split()[-1])
            regional_data[region][cluster_num] += 1
        except (ValueError, IndexError):
            continue

# Convert to the format needed for the stacked bar chart
output_data = []
for region in ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania', 'Other']:
    region_entry = {'region': region}
    for cluster in [1, 2, 3, 4, 5]:
        region_entry[f'cluster_{cluster}'] = regional_data[region].get(cluster, 0)
    output_data.append(region_entry)

# Write to JSON file
output_file = '../public/data/regional-clusters.json'
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(output_data, f, indent=2, ensure_ascii=False)

print(f"Generated {output_file}")
print(f"Total regions: {len(output_data)}")
for entry in output_data:
    total = sum(entry[f'cluster_{i}'] for i in range(1, 6))
    print(f"{entry['region']}: {total} countries")
