import FormEntradaLote from '@/src/components/FormEntradaLote';

export default function EntradaPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Cabeçalho do Módulo */}
      <header className="mb-8">
        <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">
          📥 Entrada de Lotes
        </h1>
        <p className="text-slate-500 font-medium">
          Registre a chegada de mercadorias, números de nota fiscal e datas de validade.
        </p>
      </header>

      {/* Formulário de Entrada */}
      <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100">
        <FormEntradaLote />
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3">
          <span className="text-xl">✅</span>
          <p className="text-xs text-emerald-700 font-bold uppercase">
            Confira a NF antes de salvar
          </p>
        </div>
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-center gap-3">
          <span className="text-xl">⚠️</span>
          <p className="text-xs text-amber-700 font-bold uppercase">
            Atenção redobrada na validade
          </p>
        </div>
      </div>
    </div>
  );
}