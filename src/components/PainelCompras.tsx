"use client";

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { exportarParaExcel } from '../lib/exportarExcel'
import toast from 'react-hot-toast'

export default function PainelCompras() {
  const [produtos, setProdutos] = useState<any[]>([])
  const [busca, setBusca] = useState('')
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    "use client";

    import { useState, useEffect } from 'react'
    async function carregarDados() {
      const { data, error } = await supabase
        .from('produtos')
        .select(`*, lotes (*)`)
        .order('nome', { ascending: true })
    export default function PainelCompras() {
      const [produtos, setProdutos] = useState<any[]>([])
      const [busca, setBusca] = useState('')
      const [carregando, setCarregando] = useState(true)

      // Função para excluir produto agora dentro do componente
      async function excluirProduto(id: string) {
        if (!window.confirm('Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita!')) return;
        setCarregando(true);
        const { error } = await supabase.from('produtos').delete().eq('id', id);
        if (error) {
          toast.error('Erro ao excluir produto: ' + error.message);
        } else {
          toast.success('Produto excluído com sucesso!');
          setProdutos(produtos.filter(p => p.id !== id));
        }
        setCarregando(false);
      }
  const produtosAbaixoMinimo = produtos.map(p => {
    const totalAtual = p.lotes?.reduce((acc: number, l: any) => acc + l.quantidade_atual, 0) || 0
    return {
      ...p,
      totalAtual,
      faltante: p.estoque_minimo - totalAtual
    }
  }).filter(p => p.faltante > 0).sort((a, b) => b.faltante - a.faltante)

  const produtosFiltrados = produtos.filter(p => 
    p.nome.toLowerCase().includes(busca.toLowerCase())
  )

  const totalItens = produtos.length
  const totalLotes = produtos.reduce((acc, p) => acc + (p.lotes?.length || 0), 0)
  const totalAbaixoMinimo = produtosAbaixoMinimo.length

  const handleExportarSugestoes = () => {
    if (produtosAbaixoMinimo.length === 0) {
      toast.error('Nenhum produto abaixo do mínimo para exportar.')
      return
    }

    const dadosExportacao = produtosAbaixoMinimo.map(p => ({
      Produto: p.nome,
      Marca: p.marca || 'Sem marca',
      Unidade: p.unidade_medida || 'UN',
      'Estoque Atual': p.totalAtual,
      'Estoque Mínimo': p.estoque_minimo,
      'Quantidade Sugerida p/ Compra': p.faltante + Math.ceil(p.estoque_minimo * 0.2) // Sugere compl/ + 20% margem
    }))

    exportarParaExcel(dadosExportacao, 'Sugestao_Compras_Costelao.xlsx')
    toast.success('Relatório gerado com sucesso!')
  }

  if (carregando) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-slate-500 font-black uppercase text-xs tracking-widest">Sincronizando Banco Costelão...</p>
    </div>
  )

  return (
    <div className="space-y-10">
      
      {/* 1. INDICADORES DE DESEMPENHO (Estilo Dashboard Moderno) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-4xl shadow-xl border-l-8 border-slate-800 relative overflow-hidden group col-span-1">
          <div className="absolute -right-4 -top-4 text-slate-100 text-8xl font-black group-hover:text-slate-200 transition-colors">#</div>
          <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest relative z-10">Catálogo Total</p>
          <h2 className="text-4xl font-black text-slate-800 italic relative z-10">{totalItens}</h2>
          <p className="text-[9px] text-slate-400 font-bold mt-1 relative z-10">Produtos cadastrados</p>
        </div>

        <div className="bg-white p-6 rounded-4xl shadow-xl border-l-8 border-emerald-500 relative overflow-hidden group col-span-1">
          <div className="absolute -right-4 -top-4 text-emerald-50 text-8xl font-black">L</div>
          <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest relative z-10">Volume de Lotes</p>
          <h2 className="text-4xl font-black text-emerald-600 italic relative z-10">{totalLotes}</h2>
          <p className="text-[9px] text-slate-400 font-bold mt-1 relative z-10">Lotes armazenados</p>
        </div>

        <div className="bg-red-600 p-6 rounded-4xl shadow-2xl border-l-8 border-red-900 relative overflow-hidden group col-span-1 md:col-span-2 flex flex-col justify-between">
          <div className="absolute -right-4 top-0 text-red-700 text-8xl font-black opacity-40">!</div>
          <div>
            <p className="text-[10px] text-red-200 uppercase font-black tracking-widest relative z-10">Urgência de Compra</p>
            <h2 className="text-5xl font-black text-white italic relative z-10 leading-none">{totalAbaixoMinimo} <span className="text-xl">itens críticos</span></h2>
          </div>
          <button 
            onClick={handleExportarSugestoes}
            className="mt-4 px-6 py-2 bg-white text-red-700 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-red-50 hover:scale-105 transition-all text-left w-max z-10 border border-transparent"
          >
            ⏬ Exportar Sugestões (.xlsx)
          </button>
        </div>
      </div>

      {/* NOVO: SUGESTÕES DE COMPRA EXPLICITAS */}
      {produtosAbaixoMinimo.length > 0 && (
        <div className="bg-white rounded-[2.5rem] shadow-xl p-8 border-t-8 border-red-600">
          <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">🚨 Sugestão Automática de Pedidos</h3>
              <p className="text-xs text-slate-500 font-bold mt-1 tracking-widest uppercase">Baseado em reposição até o mínimo (+20% Margem Seg.)</p>
            </div>
            <button 
              onClick={() => window.print()}
              className="bg-slate-900 text-white px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-colors shadow-lg print:hidden"
            >
              🖨️ IMPRIMIR RELATÓRIO
            </button>
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Produto / Marca</th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Und</th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right border-x border-slate-100">Estoque Atual</th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Mín. Exigido</th>
                  <th className="p-4 text-[10px] font-black tracking-widest text-right text-emerald-700 bg-emerald-50">Comprar (+)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {produtosAbaixoMinimo.map((p, i) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <span className="font-black uppercase text-slate-800">{p.nome}</span>
                      <span className="block text-[9px] font-bold text-slate-400 uppercase">{p.marca || 'Sem Marca'}</span>
                    </td>
                    <td className="p-4 text-center font-bold text-xs text-slate-500">{p.unidade_medida || 'UN'}</td>
                    <td className="p-4 text-right font-black text-red-600 text-base border-x border-slate-100">{p.totalAtual}</td>
                    <td className="p-4 text-right font-bold text-slate-500 text-sm">{p.estoque_minimo}</td>
                    <td className="p-4 text-right font-black text-lg text-emerald-600 bg-emerald-50/30">
                      {p.faltante + Math.ceil(p.estoque_minimo * 0.2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <hr className="border-slate-200 border-dashed" />

      {/* 2. BARRA DE BUSCA COSTELÃO */}
      <div className="relative print:hidden">
        <input 
          type="text"
          placeholder="Pesquisar item no catálogo geral..."
          className="w-full p-6 pl-16 rounded-3xl bg-white border-2 border-transparent shadow-xl focus:border-red-500 outline-none transition-all text-xl font-black text-slate-700 placeholder:text-slate-300 uppercase tracking-tighter"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl">🔍</div>
      </div>

      {/* 3. GRID DE PRODUTOS (Estilo Cards de Gôndola) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 print:hidden">
        {produtosFiltrados.length > 0 ? (
          produtosFiltrados.map(produto => {
            const totalAtual = produto.lotes?.reduce((acc: number, l: any) => acc + l.quantidade_atual, 0) || 0
            const statusCritico = totalAtual < produto.estoque_minimo

            return (
              <div key={produto.id} className={`group relative bg-white p-6 rounded-[2.5rem] shadow-lg border-2 transition-all hover:shadow-2xl hover:-translate-y-1 ${
                statusCritico ? 'border-red-100 bg-red-50/30' : 'border-slate-50 hover:border-slate-200'
              }`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="max-w-[70%]">
                    <h4 className="font-black text-slate-800 uppercase text-base leading-none mb-1 group-hover:text-red-600 transition-colors">
                      {produto.nome}
                    </h4>
                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-full tracking-widest ${
                      statusCritico ? 'bg-red-600 text-white animate-pulse' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {statusCritico ? 'FALTA NO ESTOQUE' : 'SALDO DISPONÍVEL'}
                    </span>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                    <p className={`text-3xl font-black leading-none ${statusCritico ? 'text-red-600' : 'text-slate-800'}`}> 
                      {totalAtual.toFixed(2)}
                    </p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">{produto.unidade_medida}</p>
                    <button
                      className="mt-2 px-2 py-1 text-xs bg-red-100 text-red-700 rounded font-bold hover:bg-red-200 transition-colors border border-red-200"
                      title="Excluir produto"
                      onClick={() => excluirProduto(produto.id)}
                      disabled={carregando}
                    >
                      🗑️ Excluir
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-dashed border-slate-200 flex justify-between items-center">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Mínimo sugerido: {produto.estoque_minimo}</p>
                  {statusCritico && (
                    <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white text-xs shadow-lg shadow-red-200">
                      🛒
                    </div>
                  )}
                </div>
              </div>
            )
          })
        ) : (
          <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100 shadow-inner">
            <p className="text-slate-300 font-black uppercase text-sm italic tracking-widest">Nenhum resultado para o filtro selecionado.</p>
          </div>
        )}
      </div>
    </div>
  )
}