// Exemplo simples de logging estruturado
export function logEvento(evento: string, dados?: unknown) {
  // Em produção, envie para um serviço externo (ex: Sentry, LogRocket, etc)
  // Aqui apenas imprime no console
  console.log(`[LOG] ${new Date().toISOString()} | ${evento}`, dados || '');
}

// Exemplo de uso:
// logEvento('entrada_estoque', { produtoId: 123, quantidade: 10 });
