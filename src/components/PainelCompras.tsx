'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function PainelCompras() {
  const [produtos, setProdutos] = useState<any[]>([])
  const [busca, setBusca] = useState('')
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    async function carregarDados() {
      const { data, error } = await supabase
        .from('produtos')
        .select(`*, lotes (*)`)
        .order('nome', { ascending: true })

      if (error) {
        console.error("Erro ao carregar:", error.message)
      } else {
        setProdutos(data || [])
      }
      setCarregando(false)
    }
    carregarDados()
  }, [])

  const produtosFiltrados = produtos.filter(p => 
    p.nome.toLowerCase().includes(busca.toLowerCase())
  )

  const totalItens = produtos.length
  const totalLotes = produtos.reduce((acc, p) => acc + (p.lotes?.length || 0), 0)
  const totalAbaixoMinimo = produtos.filter(p => {
    const saldo = p.lotes?.reduce((acc: number, l: any) => acc + l.quantidade_atual, 0) || 0
    return saldo < p.estoque_minimo
  }).length

  if (carregando) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-slate-500 font-black uppercase text-xs tracking-widest">Sincronizando Banco Costelão...</p>
    </div>
  )

  return (
    <div className="space-y-10">
      
      {/* 1. INDICADORES DE DESEMPENHO (Estilo Dashboard Moderno) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] shadow-xl border-l-8 border-slate-800 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 text-slate-100 text-8xl font-black group-hover:text-slate-200 transition-colors">#</div>
          <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest relative z-10">Catálogo Total</p>
          <h2 className="text-5xl font-black text-slate-800 italic relative z-10">{totalItens}</h2>
          <p className="text-[9px] text-slate-400 font-bold mt-1 relative z-10">Produtos cadastrados</p>
        </div>

        <div className="bg-white p-6 rounded-[2rem] shadow-xl border-l-8 border-emerald-500 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 text-emerald-50 text-8xl font-black">L</div>
          <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest relative z-10">Volume de Lotes</p>
          <h2 className="text-5xl font-black text-emerald-600 italic relative z-10">{totalLotes}</h2>
          <p className="text-[9px] text-slate-400 font-bold mt-1 relative z-10">Gestão de armazenamento</p>
        </div>

        <div className="bg-red-600 p-6 rounded-[2rem] shadow-2xl border-l-8 border-red-900 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 text-red-700 text-8xl font-black opacity-40">!</div>
          <p className="text-[10px] text-red-200 uppercase font-black tracking-widest relative z-10">Urgência de Compra</p>
          <h2 className="text-5xl font-black text-white italic relative z-10">{totalAbaixoMinimo}</h2>
          <p className="text-[9px] text-red-200 font-bold mt-1 relative z-10 uppercase tracking-tighter">Itens abaixo do mínimo</p>
        </div>
      </div>

      {/* 2. BARRA DE BUSCA COSTELÃO */}
      <div className="relative">
        <input 
          type="text"
          placeholder="Pesquisar item no banco de compras..."
          className="w-full p-6 pl-16 rounded-3xl bg-white border-none shadow-xl focus:ring-4 focus:ring-red-100 outline-none transition-all text-xl font-black text-slate-700 placeholder:text-slate-300 uppercase tracking-tighter"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl">🔍</div>
        {busca && (
          <button 
            onClick={() => setBusca('')}
            className="absolute right-6 top-1/2 -translate-y-1/2 bg-slate-100 hover:bg-slate-200 text-slate-500 px-4 py-1 rounded-full text-[10px] font-black transition-all"
          >
            LIMPAR BUSCA
          </button>
        )}
      </div>

      {/* 3. GRID DE PRODUTOS (Estilo Cards de Gôndola) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {produtosFiltrados.length > 0 ? (
          produtosFiltrados.map(produto => {
            const totalAtual = produto.lotes?.reduce((acc: number, l: any) => acc + l.quantidade_atual, 0) || 0
            const statusCritico = totalAtual < produto.estoque_minimo

            return (
              <div key={produto.id} className={`group relative bg-white p-6 rounded-[2.5rem] shadow-lg border-2 transition-all hover:shadow-2xl hover:-translate-y-1 ${
                statusCritico ? 'border-red-100 bg-red-50/30' : 'border-slate-50'
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
                  <div className="text-right">
                    <p className={`text-3xl font-black leading-none ${statusCritico ? 'text-red-600' : 'text-slate-800'}`}>
                      {totalAtual.toFixed(2)}
                    </p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">Unidades</p>
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
          <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
            <p className="text-slate-300 font-black uppercase text-sm italic tracking-widest">Nenhum resultado para o filtro selecionado.</p>
          </div>
        )}
      </div>
    </div>
  )
}