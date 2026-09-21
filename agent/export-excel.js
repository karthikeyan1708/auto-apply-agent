import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as XLSX from 'xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const appsPath = path.join(rootDir, 'data', 'applications.json');
const excelPath = path.join(rootDir, 'data', 'applications_tracker.xlsx');

function readJSON(filePath, fallback = []) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    return fallback;
  }
}

export function exportApplicationsToExcel() {
  const apps = readJSON(appsPath, []);

  const excelRows = apps.map(app => ({
    'Application ID': app.id,
    'Company Name': app.company,
    'Job Title': app.title,
    'Location': app.location,
    'Platform': app.platform,
    'Match Score (%)': `${app.matchScore}%`,
    'Status': app.status,
    'Response State': app.responseStatus || app.status,
    'Applied Date': app.dateStr || (app.appliedAt ? app.appliedAt.split('T')[0] : ''),
    'Applied Timestamp': app.appliedAt,
    'Job URL': app.jobUrl,
    'Execution Notes': app.notes
  }));

  const worksheet = XLSX.utils.json_to_sheet(excelRows);

  // Set column widths for clean readability
  worksheet['!cols'] = [
    { wch: 18 }, // ID
    { wch: 22 }, // Company
    { wch: 35 }, // Title
    { wch: 20 }, // Location
    { wch: 14 }, // Platform
    { wch: 16 }, // Match Score
    { wch: 16 }, // Status
    { wch: 20 }, // Response State
    { wch: 14 }, // Date
    { wch: 24 }, // Timestamp
    { wch: 45 }, // Job URL
    { wch: 45 }  // Notes
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Applications');

  const dir = path.dirname(excelPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  XLSX.writeFile(workbook, excelPath);
  console.log(`📊 Excel Application Tracker successfully generated at: ${excelPath}`);
  return excelPath;
}

if (process.argv[1] && process.argv[1].endsWith('export-excel.js')) {
  exportApplicationsToExcel();
}
