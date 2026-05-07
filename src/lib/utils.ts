// Funções utilitárias, por exemplo, cálculos de data de validade

export function calcularValidade(data: Date, dias: number): Date {
  const novaData = new Date(data);
  novaData.setDate(novaData.getDate() + dias);
  return novaData;
}
