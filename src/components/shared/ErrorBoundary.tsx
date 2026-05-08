import { ReactNode } from 'react';

// Provider global para tratamento de erros
export function ErrorBoundary({ children }: { children: ReactNode }) {
  // Aqui você pode usar uma lib como react-error-boundary para produção
  // Exemplo simples:
  try {
    return <>{children}</>;
  } catch (error) {
    return <div>Ocorreu um erro inesperado.</div>;
  }
}
