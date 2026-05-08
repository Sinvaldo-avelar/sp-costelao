import * as z from 'zod';

// Exemplo de schema de validação para cadastro de produto
export const produtoSchema = z.object({
  nome: z.string().min(2, 'Nome obrigatório'),
  quantidade: z.number().int().min(0, 'Quantidade deve ser positiva'),
  unidade: z.string().min(1, 'Unidade obrigatória'),
  lote: z.string().optional(),
});

// Função utilitária para validar dados
export function validarProduto(data: unknown) {
  return produtoSchema.safeParse(data);
}
