// Utilitário para extrair valores únicos de um array de objetos
export function valoresUnicos<T = any>(arr: any[], campo: string): T[] {
  return Array.from(new Set(arr.map(item => item[campo]).filter(Boolean))) as T[];
}
