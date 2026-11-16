import { fileURLToPath } from 'node:url';
import ExcelJS from 'exceljs';
import { TestCase } from './TestCase.ts';

type Row = Record<string, string>;

const SHEET_BY_ID_PREFIX: Record<string, string> = {
  'CP-LOGIN': 'login',
  'CP-CARRITO': 'carrito',
  'CP-COMPRA': 'compra',
};
const USERS_SHEET = 'usuarios';

export class TestDataRepository {
  private readonly workbookPath: string;
  private workbook?: Promise<ExcelJS.Workbook>;

  constructor(workbookPath: string) {
    this.workbookPath = workbookPath;
  }

  async findTestCase(id: string): Promise<TestCase> {
    const sheetName = this.sheetFor(id);
    const row = (await this.rowsOf(sheetName)).find((candidate) => candidate.id === id);
    if (!row) {
      throw new Error(`No existe el caso ${id} en la hoja "${sheetName}"`);
    }
    return new TestCase(id, row);
  }

  async passwordOf(username: string): Promise<string> {
    const user = (await this.rowsOf(USERS_SHEET)).find((candidate) => candidate.usuario === username);
    if (!user) {
      throw new Error(`No existe el usuario ${username} en la hoja "${USERS_SHEET}"`);
    }
    return user.password;
  }

  private sheetFor(id: string): string {
    const prefix = id.split('-').slice(0, 2).join('-');
    const sheetName = SHEET_BY_ID_PREFIX[prefix];
    if (!sheetName) {
      throw new Error(`El ID ${id} no corresponde a ninguna hoja. Prefijos válidos: ${Object.keys(SHEET_BY_ID_PREFIX).join(', ')}`);
    }
    return sheetName;
  }

  private async rowsOf(sheetName: string): Promise<Row[]> {
    const sheet = (await this.loadWorkbook()).getWorksheet(sheetName);
    if (!sheet) {
      throw new Error(`La hoja "${sheetName}" no existe en ${this.workbookPath}`);
    }
    const headers = (sheet.getRow(1).values as unknown[]).map((header) => String(header ?? '').trim());
    const rows: Row[] = [];
    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) {
        return;
      }
      const record: Row = {};
      headers.forEach((header, column) => {
        if (header) {
          record[header] = row.getCell(column).text.trim();
        }
      });
      rows.push(record);
    });
    return rows;
  }

  private loadWorkbook(): Promise<ExcelJS.Workbook> {
    this.workbook ??= new ExcelJS.Workbook().xlsx.readFile(this.workbookPath);
    return this.workbook;
  }
}

export const testData = new TestDataRepository(fileURLToPath(new URL('./saucedemo.xlsx', import.meta.url)));
