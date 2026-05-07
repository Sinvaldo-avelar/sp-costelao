'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/src/lib/supabase'

export default function InventarioEstrategicoPage() {
  const [produtos, setProdutos] = useState<any[]>([])
  const [busca, setBusca] = useState('') // Estado para a barra de busca
  const [carregando, setCarregando] = useState(true)

  const formatarQtd = (valor: number, unidade: string) => {
    const num = Number.isInteger(valor) ? valor.toString() : valor.toLocaleString('pt-BR', { minimumFractionDigits: 3 });
    return `${num} ${unidade?.toUpperCase() || 'UN'}`;
  }

  async function carregarDados() {
    setCarregando(true)
    const { data } = await supabase
      .from('produtos')
      .select(`*, lotes (*)`)
      .order('nome', { ascending: true })

    if (data) {
      const produtosOrdenados = data.map(p => ({
        ...p,
        lotes: p.lotes
          ?.filter((l: any) => l.quantidade_atual > 0)
          .sort((a: any, b: any) => new Date(a.data_validade).getTime() - new Date(b.data_validade).getTime())
      }))
      setProdutos(produtosOrdenados)
    }
    setCarregando(false)
  }

  useEffect(() => { carregarDados() }, [])

  // FILTRO EM TEMPO REAL: Filtra por nome do produto ou marca
  const produtosFiltrados = produtos.filter(p => 
    p.nome.toLowerCase().includes(busca.toLowerCase()) || 
    (p.marca && p.marca.toLowerCase().includes(busca.toLowerCase()))
  )

  if (carregando) return <div className="p-10 font-black text-slate-400 animate-pulse">ORGANIZANDO MAPA DE SAÍDA...</div>

  return (
    <div className="w-full space-y-6 p-2">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-4 border-slate-900 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">🚀 Prioridade de Saída (PEPS)</h1>
          <p className="text-slate-500 font-bold text-xs uppercase italic tracking-widest">Localize o lote mais antigo para despacho</p>
        </div>

        {/* BARRA DE BUSCA ESTRATÉGICA */}
        <div className="relative w-full md:w-96">
          <input 
            type="text"
            placeholder="Pesquisar produto ou marca..."
            className="w-full p-4 pl-12 bg-slate-100 border-2 border-slate-200 rounded-2xl font-bold text-slate-700 outline-none focus:border-orange-500 focus:bg-white transition-all shadow-sm"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
        </div>
      </header>

      {/* LISTAGEM FILTRADA */}
      <div className="grid grid-cols-1 gap-8">
        {produtosFiltrados.length > 0 ? (
          produtosFiltrados.map((p) => (
            <div key={p.id} className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden hover:border-orange-200 transition-colors">
              
              {/* CABEÇALHO DO PRODUTO */}
              <div className="bg-slate-900 p-5 flex justify-between items-center text-white">
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight">
                    {p.nome} <span className="text-orange-400 text-xs ml-2">[{p.marca || 'SEM MARCA'}]</span>
                  </h2>
                  <div className="flex gap-4 mt-1">
                     <span className="text-[10px] font-black opacity-60 uppercase bg-white/10 px-2 py-0.5 rounded">UNID: {p.unidade_medida || 'UN'}</span>
                     <span className="text-[10px] font-black opacity-60 uppercase bg-white/10 px-2 py-0.5 rounded">ESTOQUE MÍN: {p.estoque_minimo}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black opacity-50 uppercase leading-none">Saldo Total</p>
                  <p className="text-2xl font-black text-orange-400">
                    {formatarQtd(p.lotes?.reduce((acc:any, cur:any) => acc + cur.quantidade_atual, 0), p.unidade_medida)}
                  </p>
                </div>
              </div>

              {/* FILA DE SAÍDA POR LOTE */}
              <div className="p-2 md:p-6 overflow-x-auto">
                <table className="w-full text-[11px]">
                  <thead>
                    <tr className="text-slate-400 font-black uppercase border-b-2 border-slate-50">
                      <th className="p-3 text-left">Fila de Saída</th>
                      <th className="p-3 text-left">Identificador (Lote)</th>
                      <th className="p-3 text-center">Data de Validade</th>
                      <th className="p-3 text-right">Saldo Disponível</th>
                      <th className="p-3 text-center">Status de Risco</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {p.lotes && p.lotes.length > 0 ? (
                      p.lotes.map((lote: any, index: number) => {
                        const diasParaVencer = Math.ceil((new Date(lote.data_validade).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                        const isPrioridade = index === 0;

                        return (
                          <tr key={lote.id} className={`${isPrioridade ? 'bg-orange-50/60' : ''} transition-colors`}>
                            <td className="p-4">
                              {isPrioridade ? (
                                <div className="flex items-center gap-2">
                                  <span className="flex h-3 w-3 rounded-full bg-orange-600 animate-ping"></span>
                                  <span className="bg-orange-600 text-white px-3 py-1 rounded-full font-black text-[9px] uppercase shadow-sm">
                                    Despachar Primeiro
                                  </span>
                                </div>
                              ) : (
                                <span className="text-slate-400 font-bold pl-5">{index + 1}º da Fila</span>
                              )}
                            </td>
                            <td className="p-4 font-black text-slate-700 tracking-tight">
                              {lote.numero_lote || 'NÃO INFORMADO'}
                            </td>
                            <td className="p-4 text-center">
                              <span className={`font-black px-3 py-1 rounded-lg ${isPrioridade ? 'text-orange-700' : 'text-slate-600'}`}>
                                {new Date(lote.data_validade).toLocaleDateString('pt-BR')}
                              </span>
                            </td>
                            <td className="p-4 text-right font-black text-slate-800 text-sm">
                              {formatarQtd(lote.quantidade_atual, p.unidade_medida)}
                            </td>
                            <td className="p-4 text-center">
                              {diasParaVencer <= (lote.dias_alerta_vencimento || 5) ? (
                                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full font-black uppercase text-[9px] border border-red-200">
                                  {diasParaVencer <= 0 ? 'VENCIDO' : `Vence em ${diasParaVencer} dias`}
                                </span>
                              ) : (
                                <span className="text-emerald-500 font-black uppercase text-[9px]">Seguro</span>
                              )}
                            </td>
                          </tr>
                        )
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-10 text-center text-slate-300 font-black uppercase italic">Sem estoque deste item no momento.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        ) : (
          <div className="p-20 text-center bg-slate-50 rounded-[3rem] border-4 border-dashed border-slate-200">
            <p className="text-2xl font-black text-slate-300 uppercase tracking-widest">Nenhum produto encontrado...</p>
          </div>
        )}
      </div>
    </div>
  )
}