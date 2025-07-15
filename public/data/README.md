# Data Files

This directory should contain the following Excel files for the dashboard to work properly:

1. `GRI Data 2023 & 2024.xlsx` - Contains grant and lives impacted data
   - Required sheets: "Geo", "GRI"

2. `TUPSF Tree Data - Year+Country - 2012-2024.xlsx` - Contains tree planting data
   - Required sheet: "Running Totals"

Please place these Excel files in this directory for the dashboard to load data correctly.

## File Structure Expected:

### GRI Data 2023 & 2024.xlsx
- **Geo sheet**: Location, Value, GRI_year columns
- **GRI sheet**: focus_area, lives_impacted_total, GRI_year columns

### TUPSF Tree Data - Year+Country - 2012-2024.xlsx
- **Running Totals sheet**: Country column + year columns (2012, 2013, etc.)

The dashboard will automatically read these files and display the data in the respective tabs.