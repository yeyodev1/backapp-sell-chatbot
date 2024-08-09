import process from "node:process";
import { JWT } from "google-auth-library";
import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from "google-spreadsheet";

process.loadEnvFile();

class GoogleSheetService {
  private doc: GoogleSpreadsheet;
  private isInitialized: boolean = false;

  constructor() {
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY, // Asegura que las nuevas líneas en la clave se manejan correctamente
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
      ]
    });

    this.doc = new GoogleSpreadsheet(process.env.SPREADSHEET_ID!, serviceAccountAuth);
    this.initialize();
  }

  private async initialize() {
    if (!this.isInitialized) {
      await this.doc.loadInfo();
      this.isInitialized = true;
    }
  }

  async getSheetByIndex(index = 0): Promise<GoogleSpreadsheetWorksheet> {
    await this.initialize();
    return this.doc.sheetsByIndex[index];
  }

  async getAllRows(sheetIndex = 0): Promise<any[]> {
    const sheet = await this.getSheetByIndex(sheetIndex);
    const rows = await sheet.getRows();
    return rows;
  }

  async getSheetData(sheetIndex = 1): Promise<string | null> {
    await this.initialize();
    try {
      const rows = await this.getAllRows(sheetIndex);
      let resultString = '';

      rows.forEach(row => {
        resultString += `Ciudad: ${row.get('Ciudad')}, Sede: ${row.get('Sede')}, Horario: ${row.get('Horario')}\n`;
      });

      return resultString.trim();
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }
}

export default GoogleSheetService;
