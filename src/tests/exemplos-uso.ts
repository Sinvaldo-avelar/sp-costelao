// Exemplo de uso prático das funções utilitárias do sistema
import { produtoSchema, validarProduto } from '../lib/validacao';
import { logEvento } from '../lib/logger';
import { registrarAuditoria } from '../lib/auditoria';
import { depositos, getDepositoById } from '../lib/depositos';

// 1. Validação de produto
const resultado = validarProduto({ nome: 'Arroz', quantidade: 10, unidade: 'kg', lote: 'A123' });
if (resultado.success) {
  logEvento('produto_validado', resultado.data);
} else {
  logEvento('erro_validacao', resultado.error.errors);
}

// 2. Logging de evento
logEvento('movimentacao_manual', { acao: 'ajuste_estoque', produto: 'Feijão', quantidade: 5 });

// 3. Auditoria de movimentação
registrarAuditoria('ajuste_estoque', 'usuario_demo', { produto: 'Feijão', quantidade: 5 });

// 4. Uso de múltiplos depósitos
const deposito = getDepositoById('1');
if (deposito) {
  logEvento('deposito_selecionado', deposito);
}

// 5. Listar todos os depósitos
logEvento('lista_depositos', depositos);
