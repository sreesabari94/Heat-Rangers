import * as XLSX from 'xlsx';

export async function readSheet<T>(url: string, sheetName: string): Promise<T[]> {
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