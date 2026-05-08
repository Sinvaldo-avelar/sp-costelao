export interface Produto {
  id: string;
  nome: string;
  marca?: string;
  unidade_medida: 'KG' | 'UN' | 'FARDO';
  estoque_minimo: number;
}

export interface Lote {
  id: string;
  produto_id: string;
  numero_lote: string;
  data_validade: string;
  quantidade_atual: number;
  nf_entrada: string;
}

export interface Perfil {
  id: string;
  nome: string;
  email: string;
  nivel_acesso: string;
  criado_em: string;
}

export interface Movimentacao {
  tipo: 'ENTRADA' | 'SAIDA';
  produto_id: string;
  lote_id: string;
  quantidade: number;
  nf_documento: string;
  destino_origem: string;
  usuario_id?: string;
}