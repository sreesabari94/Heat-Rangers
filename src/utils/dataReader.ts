import * as XLSX from 'xlsx';

export async function readSheet<T>(url: string, sheetName: string): Promise<T[]> {
  // For demo purposes, use mock JSON data if Excel files are not available
  if (url.includes('GRI Data 2023 & 2024.xlsx')) {
    if (sheetName === 'Geo') {
      const mockGeoData = [
        { Location: 'United States', Value: 450000, GRI_year: 2024 },
        { Location: 'Brazil', Value: 380000, GRI_year: 2024 },
        { Location: 'India', Value: 520000, GRI_year: 2024 },
        { Location: 'Nigeria', Value: 280000, GRI_year: 2023 },
        { Location: 'Kenya', Value: 150000, GRI_year: 2023 },
        { Location: 'Philippines', Value: 190000, GRI_year: 2023 },
      ];
      return mockGeoData as T[];
    }
    if (sheetName === 'GRI') {
      const mockGRIData = [
        { focus_area: 'Clean Water', lives_impacted_total: 45000, GRI_year: 2024 },
        { focus_area: 'Food Security', lives_impacted_total: 38000, GRI_year: 2024 },
        { focus_area: 'Digital Access', lives_impacted_total: 22000, GRI_year: 2023 },
        { focus_area: 'Climate Action', lives_impacted_total: 19000, GRI_year: 2023 },
      ];
      return mockGRIData as T[];
    }
  }
  
  if (url.includes('TUPSF Tree Data')) {
    const mockTreeData = [
      { Country: 'United States', '2023': 15000, '2024': 18000 },
      { Country: 'Brazil', '2023': 25000, '2024': 28000 },
      { Country: 'India', '2023': 35000, '2024': 42000 },
      { Country: 'Nigeria', '2023': 12000, '2024': 14000 },
    ];
    return mockTreeData as T[];
  }

  const res = await fetch(url);
  
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  }
  
  const buf = await res.arrayBuffer();
  const workbook = XLSX.read(buf, { type: 'array' });
  const sheet = workbook.Sheets[sheetName];
  
  if (!sheet) {
    throw new Error(`Sheet "${sheetName}" not found in ${url}`);
  }
  
  return XLSX.utils.sheet_to_json<T>(sheet, { defval: null });
}

export interface GeoData {
  Location: string;
  Value: number;
  GRI_year: number;
  [key: string]: any;
}

export interface GRIData {
  focus_area: string;
  lives_impacted_total: number;
  GRI_year: number;
  [key: string]: any;
}

export interface TreeData {
  Country: string;
  [year: string]: any;
}

export interface TreeRecord {
  country: string;
  year: number;
  trees: number;
}

export function transformTreeData(data: TreeData[]): TreeRecord[] {
  const records: TreeRecord[] = [];
  
  data.forEach(row => {
    const country = row.Country;
    Object.keys(row).forEach(key => {
      if (key !== 'Country' && !isNaN(Number(key))) {
        const year = Number(key);
        const trees = Number(row[key]) || 0;
        if (trees > 0) {
          records.push({ country, year, trees });
        }
      }
    });
  });
  
  return records;
}