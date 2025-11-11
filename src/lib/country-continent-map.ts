// Country to Continent Mapping
// Comprehensive mapping of all 195 countries to their respective continents

export type Continent = 'Africa' | 'Americas' | 'Asia' | 'Europe' | 'Oceania';

export const COUNTRY_TO_CONTINENT: Record<string, Continent> = {
  // Africa
  'Algeria': 'Africa',
  'Angola': 'Africa',
  'Benin': 'Africa',
  'Botswana': 'Africa',
  'Burkina Faso': 'Africa',
  'Cabo Verde': 'Africa',
  'Cameroon': 'Africa',
  'Central African Republic': 'Africa',
  'Chad': 'Africa',
  'Comoros': 'Africa',
  'Congo': 'Africa',
  'Côte d\'Ivoire': 'Africa',
  'Democratic Republic of the Congo': 'Africa',
  'Djibouti': 'Africa',
  'Egypt': 'Africa',
  'Eswatini': 'Africa',
  'Ethiopia': 'Africa',
  'Gabon': 'Africa',
  'Gambia': 'Africa',
  'Ghana': 'Africa',
  'Guinea': 'Africa',
  'Guinea-Bissau': 'Africa',
  'Kenya': 'Africa',
  'Lesotho': 'Africa',
  'Liberia': 'Africa',
  'Madagascar': 'Africa',
  'Malawi': 'Africa',
  'Mali': 'Africa',
  'Mauritania': 'Africa',
  'Mauritius': 'Africa',
  'Morocco': 'Africa',
  'Mozambique': 'Africa',
  'Namibia': 'Africa',
  'Niger': 'Africa',
  'Nigeria': 'Africa',
  'Rwanda': 'Africa',
  'Senegal': 'Africa',
  'Sierra Leone': 'Africa',
  'Somalia': 'Africa',
  'South Africa': 'Africa',
  'South Sudan': 'Africa',
  'Sudan': 'Africa',
  'Togo': 'Africa',
  'Tunisia': 'Africa',
  'Uganda': 'Africa',
  'United Republic of Tanzania': 'Africa',
  'Zambia': 'Africa',
  'Zimbabwe': 'Africa',

  // Americas
  'Argentina': 'Americas',
  'Barbados': 'Americas',
  'Belize': 'Americas',
  'Bolivia (Plurinational State of)': 'Americas',
  'Brazil': 'Americas',
  'Canada': 'Americas',
  'Chile': 'Americas',
  'Colombia': 'Americas',
  'Costa Rica': 'Americas',
  'Cuba': 'Americas',
  'Dominica': 'Americas',
  'Dominican Republic': 'Americas',
  'Ecuador': 'Americas',
  'El Salvador': 'Americas',
  'Grenada': 'Americas',
  'Guatemala': 'Americas',
  'Guyana': 'Americas',
  'Haiti': 'Americas',
  'Honduras': 'Americas',
  'Jamaica': 'Americas',
  'Mexico': 'Americas',
  'Nicaragua': 'Americas',
  'Panama': 'Americas',
  'Paraguay': 'Americas',
  'Peru': 'Americas',
  'Saint Lucia': 'Americas',
  'Saint Vincent and the Grenadines': 'Americas',
  'Suriname': 'Americas',
  'Trinidad and Tobago': 'Americas',
  'United States of America': 'Americas',
  'Uruguay': 'Americas',
  'Venezuela (Bolivarian Republic of)': 'Americas',

  // Asia
  'Afghanistan': 'Asia',
  'Armenia': 'Asia',
  'Azerbaijan': 'Asia',
  'Bangladesh': 'Asia',
  'Bhutan': 'Asia',
  'Brunei Darussalam': 'Asia',
  'Cambodia': 'Asia',
  'China': 'Asia',
  'China, Hong Kong SAR': 'Asia',
  'China, Macao SAR': 'Asia',
  'Cyprus': 'Asia',  // Geographically in Asia, politically EU
  'Georgia': 'Asia',  // Transcontinental, but mainly Asia
  'India': 'Asia',
  'Indonesia': 'Asia',
  'Iran (Islamic Republic of)': 'Asia',
  'Iraq': 'Asia',
  'Israel': 'Asia',
  'Japan': 'Asia',
  'Jordan': 'Asia',
  'Kazakhstan': 'Asia',
  'Kuwait': 'Asia',
  'Kyrgyzstan': 'Asia',
  'Lao People\'s Democratic Republic': 'Asia',
  'Lebanon': 'Asia',
  'Malaysia': 'Asia',
  'Maldives': 'Asia',
  'Mongolia': 'Asia',
  'Myanmar': 'Asia',
  'Nepal': 'Asia',
  'Oman': 'Asia',
  'Pakistan': 'Asia',
  'Philippines': 'Asia',
  'Qatar': 'Asia',
  'Republic of Korea': 'Asia',
  'Saudi Arabia': 'Asia',
  'Singapore': 'Asia',
  'Sri Lanka': 'Asia',
  'State of Palestine': 'Asia',
  'Syrian Arab Republic': 'Asia',
  'Tajikistan': 'Asia',
  'Thailand': 'Asia',
  'Timor-Leste': 'Asia',
  'Turkey': 'Asia',  // Transcontinental, but mainly Asia
  'Turkmenistan': 'Asia',
  'United Arab Emirates': 'Asia',
  'Uzbekistan': 'Asia',
  'Viet Nam': 'Asia',
  'Yemen': 'Asia',

  // Europe
  'Albania': 'Europe',
  'Austria': 'Europe',
  'Belarus': 'Europe',
  'Belgium': 'Europe',
  'Bosnia and Herzegovina': 'Europe',
  'Bulgaria': 'Europe',
  'Croatia': 'Europe',
  'Czechia': 'Europe',
  'Denmark': 'Europe',
  'Estonia': 'Europe',
  'Finland': 'Europe',
  'France': 'Europe',
  'Germany': 'Europe',
  'Greece': 'Europe',
  'Hungary': 'Europe',
  'Iceland': 'Europe',
  'Ireland': 'Europe',
  'Italy': 'Europe',
  'Latvia': 'Europe',
  'Lithuania': 'Europe',
  'Luxembourg': 'Europe',
  'Malta': 'Europe',
  'Montenegro': 'Europe',
  'Netherlands': 'Europe',
  'North Macedonia': 'Europe',
  'Norway': 'Europe',
  'Poland': 'Europe',
  'Portugal': 'Europe',
  'Republic of Moldova': 'Europe',
  'Romania': 'Europe',
  'Russian Federation': 'Europe',  // Transcontinental, but capital in Europe
  'Serbia': 'Europe',
  'Slovakia': 'Europe',
  'Slovenia': 'Europe',
  'Spain': 'Europe',
  'Sweden': 'Europe',
  'Switzerland': 'Europe',
  'Ukraine': 'Europe',
  'United Kingdom': 'Europe',

  // Oceania
  'Australia': 'Oceania',
  'Fiji': 'Oceania',
  'Kiribati': 'Oceania',
  'New Zealand': 'Oceania',
  'Papua New Guinea': 'Oceania',
  'Samoa': 'Oceania',
  'Solomon Islands': 'Oceania',
  'Tonga': 'Oceania',
  'Vanuatu': 'Oceania',
};

/**
 * Get continent for a given country name
 * @param countryName - The name of the country
 * @returns The continent name or 'Other' if not found
 */
export function getCountryContinent(countryName: string): Continent | 'Other' {
  return COUNTRY_TO_CONTINENT[countryName] || 'Other';
}

/**
 * Get all countries in a specific continent
 * @param continent - The continent to filter by
 * @returns Array of country names in that continent
 */
export function getCountriesInContinent(continent: Continent): string[] {
  return Object.entries(COUNTRY_TO_CONTINENT)
    .filter(([, cont]) => cont === continent)
    .map(([country]) => country);
}

/**
 * Get list of all continents
 * @returns Array of continent names
 */
export function getAllContinents(): Continent[] {
  return ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];
}
