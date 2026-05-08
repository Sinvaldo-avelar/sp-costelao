import { useState } from 'react';

// Exemplo de hook customizado para controlar loading
export function useLoading(initial = false) {
  const [loading, setLoading] = useState(initial);
  const start = () => setLoading(true);
  const stop = () => setLoading(false);
  return { loading, start, stop };
}
