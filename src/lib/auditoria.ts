// Exemplo de função para log de auditoria de movimentações
import { logEvento } from '../lib/logger';

export function registrarAuditoria(acao: string, usuario: string, detalhes: unknown) {
  logEvento(`AUDITORIA: ${acao}`, { usuario, ...detalhes });
}

// Exemplo de uso:
// registrarAuditoria('entrada_estoque', 'usuario1', { produtoId: 123, quantidade: 10 });
