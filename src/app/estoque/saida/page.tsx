import { Suspense } from 'react';
import FormSaidaLote from '@/src/components/FormSaidaLote';

export default function SaidaPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Cabeçalho do Módulo */}
      <header className="mb-8">
        <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">
          📤 Saída de Mercadoria
        </h1>
        <p className="text-slate-500 font-medium">
          Registre as baixas do estoque, vendas ou descartes de produtos.
        </p>
      </header>

      {/* Formulário de Saída */}
      <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100">
        <Suspense fallback={<div className="p-4 text-center font-bold text-slate-400">Carregando formulário...</div>}>
          <FormSaidaLote />
        </Suspense>
      </div>

      <div className="mt-8 p-4 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-3">
        <span className="text-2xl">🚨</span>
        <p className="text-sm text-red-700 font-medium">
          <strong>Lembrete:</strong> Certifique-se de selecionar o lote correto para garantir que a validade no sistema bata com a prateleira.
        </p>
      </div>
    </div>
  );
}