const LIST_SEPARATOR = ';';

export class TestCase {
  readonly id: string;
  private readonly values: Record<string, string>;

  constructor(id: string, values: Record<string, string>) {
    this.id = id;
    this.values = values;
  }

  text(column: string): string {
    const value = this.values[column];
    if (value === undefined) {
      throw new Error(`El caso ${this.id} no tiene la columna "${column}"`);
    }
    return value;
  }

  list(column: string): string[] {
    return this.text(column)
      .split(LIST_SEPARATOR)
      .map((value) => value.trim())
      .filter((value) => value.length > 0);
  }
}
