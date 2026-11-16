export interface Product {
  name: string;
  price: number;
}

export function parsePrice(text: string): number {
  const match = text.match(/\$(\d+\.\d{2})/);
  if (!match) {
    throw new Error(`No se encontró un precio en el texto: "${text}"`);
  }
  return Number(match[1]);
}
