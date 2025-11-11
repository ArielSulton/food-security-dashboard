#!/usr/bin/env python3
"""
Update country regions in CSV and regenerate regional-clusters.json
This script replaces 'Other' region with proper continent assignments
"""

import csv
import json
from collections import defaultdict

# Country to Continent mapping
COUNTRY_TO_CONTINENT = {
    # Africa
    'Algeria': 'Africa', 'Angola': 'Africa', 'Benin': 'Africa', 'Botswana': 'Africa',
    'Burkina Faso': 'Africa', 'Cabo Verde': 'Africa', 'Cameroon': 'Africa',
    'Central African Republic': 'Africa', 'Chad': 'Africa', 'Comoros': 'Africa',
    'Congo': 'Africa', "Côte d'Ivoire": 'Africa', 'Democratic Republic of the Congo': 'Africa',
    'Djibouti': 'Africa', 'Egypt': 'Africa', 'Eswatini': 'Africa', 'Ethiopia': 'Africa',
    'Gabon': 'Africa', 'Gambia': 'Africa', 'Ghana': 'Africa', 'Guinea': 'Africa',
    'Guinea-Bissau': 'Africa', 'Kenya': 'Africa', 'Lesotho': 'Africa', 'Liberia': 'Africa',
    'Madagascar': 'Africa', 'Malawi': 'Africa', 'Mali': 'Africa', 'Mauritania': 'Africa',
    'Mauritius': 'Africa', 'Morocco': 'Africa', 'Mozambique': 'Africa', 'Namibia': 'Africa',
    'Niger': 'Africa', 'Nigeria': 'Africa', 'Rwanda': 'Africa', 'Senegal': 'Africa',
    'Sierra Leone': 'Africa', 'Somalia': 'Africa', 'South Africa': 'Africa',
    'South Sudan': 'Africa', 'Sudan': 'Africa', 'Togo': 'Africa', 'Tunisia': 'Africa',
    'Uganda': 'Africa', 'United Republic of Tanzania': 'Africa', 'Zambia': 'Africa',
    'Zimbabwe': 'Africa',

    # Americas
    'Argentina': 'Americas', 'Barbados': 'Americas', 'Belize': 'Americas',
    'Bolivia (Plurinational State of)': 'Americas', 'Brazil': 'Americas', 'Canada': 'Americas',
    'Chile': 'Americas', 'Colombia': 'Americas', 'Costa Rica': 'Americas', 'Cuba': 'Americas',
    'Dominica': 'Americas', 'Dominican Republic': 'Americas', 'Ecuador': 'Americas',
    'El Salvador': 'Americas', 'Grenada': 'Americas', 'Guatemala': 'Americas',
    'Guyana': 'Americas', 'Haiti': 'Americas', 'Honduras': 'Americas', 'Jamaica': 'Americas',
    'Mexico': 'Americas', 'Nicaragua': 'Americas', 'Panama': 'Americas', 'Paraguay': 'Americas',
    'Peru': 'Americas', 'Saint Lucia': 'Americas', 'Saint Vincent and the Grenadines': 'Americas',
    'Suriname': 'Americas', 'Trinidad and Tobago': 'Americas', 'United States of America': 'Americas',
    'Uruguay': 'Americas', 'Venezuela (Bolivarian Republic of)': 'Americas',

    # Asia
    'Afghanistan': 'Asia', 'Armenia': 'Asia', 'Azerbaijan': 'Asia', 'Bangladesh': 'Asia',
    'Bhutan': 'Asia', 'Brunei Darussalam': 'Asia', 'Cambodia': 'Asia', 'China': 'Asia',
    'China, Hong Kong SAR': 'Asia', 'China, Macao SAR': 'Asia', 'Cyprus': 'Asia',
    'Georgia': 'Asia', 'India': 'Asia', 'Indonesia': 'Asia', 'Iran (Islamic Republic of)': 'Asia',
    'Iraq': 'Asia', 'Israel': 'Asia', 'Japan': 'Asia', 'Jordan': 'Asia', 'Kazakhstan': 'Asia',
    'Kuwait': 'Asia', 'Kyrgyzstan': 'Asia', "Lao People's Democratic Republic": 'Asia',
    'Lebanon': 'Asia', 'Malaysia': 'Asia', 'Maldives': 'Asia', 'Mongolia': 'Asia',
    'Myanmar': 'Asia', 'Nepal': 'Asia', 'Oman': 'Asia', 'Pakistan': 'Asia',
    'Philippines': 'Asia', 'Qatar': 'Asia', 'Republic of Korea': 'Asia', 'Saudi Arabia': 'Asia',
    'Singapore': 'Asia', 'Sri Lanka': 'Asia', 'State of Palestine': 'Asia',
    'Syrian Arab Republic': 'Asia', 'Tajikistan': 'Asia', 'Thailand': 'Asia',
    'Timor-Leste': 'Asia', 'Turkey': 'Asia', 'Turkmenistan': 'Asia',
    'United Arab Emirates': 'Asia', 'Uzbekistan': 'Asia', 'Viet Nam': 'Asia', 'Yemen': 'Asia',

    # Europe
    'Albania': 'Europe', 'Austria': 'Europe', 'Belarus': 'Europe', 'Belgium': 'Europe',
    'Bosnia and Herzegovina': 'Europe', 'Bulgaria': 'Europe', 'Croatia': 'Europe',
    'Czechia': 'Europe', 'Denmark': 'Europe', 'Estonia': 'Europe', 'Finland': 'Europe',
    'France': 'Europe', 'Germany': 'Europe', 'Greece': 'Europe', 'Hungary': 'Europe',
    'Iceland': 'Europe', 'Ireland': 'Europe', 'Italy': 'Europe', 'Latvia': 'Europe',
    'Lithuania': 'Europe', 'Luxembourg': 'Europe', 'Malta': 'Europe', 'Montenegro': 'Europe',
    'Netherlands': 'Europe', 'North Macedonia': 'Europe', 'Norway': 'Europe', 'Poland': 'Europe',
    'Portugal': 'Europe', 'Republic of Moldova': 'Europe', 'Romania': 'Europe',
    'Russian Federation': 'Europe', 'Serbia': 'Europe', 'Slovakia': 'Europe', 'Slovenia': 'Europe',
    'Spain': 'Europe', 'Sweden': 'Europe', 'Switzerland': 'Europe', 'Ukraine': 'Europe',
    'United Kingdom': 'Europe',

    # Oceania
    'Australia': 'Oceania', 'Fiji': 'Oceania', 'Kiribati': 'Oceania', 'New Zealand': 'Oceania',
    'Papua New Guinea': 'Oceania', 'Samoa': 'Oceania', 'Solomon Islands': 'Oceania',
    'Tonga': 'Oceania', 'Vanuatu': 'Oceania',
}

def update_csv_regions():
    """Update the Region column in the CSV file"""
    input_file = '../other/dataset/B-clustered-data.csv'
    output_file = '../other/dataset/B-clustered-data.csv'

    # Read CSV
    rows = []
    updated_count = 0
    with open(input_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            country = row['Area']
            old_region = row['Region']

            # Update region if country is in our mapping
            if country in COUNTRY_TO_CONTINENT:
                new_region = COUNTRY_TO_CONTINENT[country]
                if old_region != new_region:
                    row['Region'] = new_region
                    updated_count += 1
                    print(f"Updated: {country}: {old_region} → {new_region}")

            rows.append(row)

    # Write back to CSV
    with open(output_file, 'w', encoding='utf-8', newline='') as f:
        fieldnames = list(rows[0].keys())
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f"\n✓ Updated {updated_count} countries in {output_file}")
    return rows

def generate_regional_clusters(rows):
    """Generate regional-clusters.json from updated CSV data"""
    regional_data = defaultdict(lambda: defaultdict(int))

    for row in rows:
        region = row['Region']
        cluster = row['Cluster']

        # Extract cluster number
        try:
            cluster_num = int(cluster.split()[-1])
            regional_data[region][cluster_num] += 1
        except (ValueError, IndexError):
            continue

    # Convert to output format (without 'Other')
    output_data = []
    for region in ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania']:
        region_entry = {'region': region}
        for cluster in [1, 2, 3, 4, 5]:
            region_entry[f'cluster_{cluster}'] = regional_data[region].get(cluster, 0)
        output_data.append(region_entry)

    # Write to JSON
    output_file = '../public/data/regional-clusters.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)

    print(f"\n✓ Generated {output_file}")
    print(f"Total regions: {len(output_data)}")
    for entry in output_data:
        total = sum(entry[f'cluster_{i}'] for i in range(1, 6))
        print(f"  {entry['region']}: {total} countries")

    return output_data

def main():
    print("=== Updating Country Regions ===\n")

    # Step 1: Update CSV regions
    rows = update_csv_regions()

    # Step 2: Generate regional-clusters.json
    generate_regional_clusters(rows)

    print("\n✓ All done!")

if __name__ == '__main__':
    main()
