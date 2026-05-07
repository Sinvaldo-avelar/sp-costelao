import FormCadastroProduto from '@/src/components/estoque/FormCadastroProduto';
import Link from 'next/link';

export default function CadastroPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Cabeçalho do Módulo */}
      <header className="mb-8">
        <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">
          📦 Cadastro de Novo Produto
        </h1>
        <p className="text-slate-500 font-medium">
          Adicione novos itens ao catálogo do supermercado para gerenciar lotes e validades.
        </p>
      </header>

      {/* O Formulário que você já tem pronto */}
      <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100">
        <FormCadastroProduto />
      </div>

      {/* Dica de navegação rápida */}
      <div className="mt-8 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-3">
        <span className="text-2xl">💡</span>
        <p className="text-sm text-blue-700 font-medium">
          Após cadastrar o produto, utilize o menu <strong>Entradas</strong> na barra lateral para registrar o primeiro lote.
        </p>
      </div>
    </div>
  );
}