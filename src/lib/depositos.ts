// Exemplo de estrutura para múltiplos depósitos
export interface Deposito {
  id: string;
  nome: string;
  endereco: string;
}

export const depositos: Deposito[] = [
  { id: '1', nome: 'Depósito Central', endereco: 'Rua Principal, 100' },
  { id: '2', nome: 'Depósito Secundário', endereco: 'Rua Secundária, 200' },
];

// Função para buscar depósito por ID
export function getDepositoById(id: string) {
  return depositos.find((d) => d.id === id);
}
