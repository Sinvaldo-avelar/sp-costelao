// Utilitário para extrair valores únicos de um array de objetos
export function valoresUnicos(arr, campo) {
  return Array.from(new Set(arr.map(item => item[campo]).filter(Boolean)));
}
