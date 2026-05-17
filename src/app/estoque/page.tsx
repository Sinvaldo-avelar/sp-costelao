'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/src/lib/supabase'
import toast from 'react-hot-toast'


export default function DashboardEstoque() {
  const [lotesCriticos, setLotesCriticos] = useState<any[]>([])
  const [produtos, setProdutos] = useState<any[]>([])
  const [carregandoProdutos, setCarregandoProdutos] = useState(true)

  useEffect(() => {
    async function verificarValidades() {
      const { data } = await supabase
        .from('lotes')
        .select(`
          id, 
          data_validade, 
          quantidade_atual, 
          numero_lote,
          dias_alerta_vencimento,
          produtos ( nome, marca )
        `)
        .gt('quantidade_atual', 0)
      if (data) {
        const hoje = new Date()
        hoje.setHours(0, 0, 0, 0)
        const alertas = data.filter(lote => {
          const dataVenc = new Date(lote.data_validade)
          dataVenc.setHours(0, 0, 0, 0)
          const diferencaDias = Math.ceil((dataVenc.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))
          return diferencaDias <= (lote.dias_alerta_vencimento || 5)
        })
        setLotesCriticos(alertas)
      }
    }
    async function carregarProdutos() {
      setCarregandoProdutos(true)
      const { data, error } = await supabase.from('produtos').select('*').order('nome', { ascending: true })
      if (error) {
        toast.error('Erro ao carregar produtos: ' + error.message)
      } else {
        setProdutos(data || [])
      }
      setCarregandoProdutos(false)
    }
    verificarValidades()
    carregarProdutos()
  }, [])

  async function excluirProduto(id: string) {
    if (!window.confirm('Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita!')) return;
    const { error } = await supabase.from('produtos').delete().eq('id', id)
    if (error) {
      toast.error('Erro ao excluir produto: ' + error.message)
    } else {
      toast.success('Produto excluído com sucesso!')
      setProdutos(produtos.filter(p => p.id !== id))
    }
  }

  return (
    <div className="p-4 space-y-6">
      {/* SEÇÃO DE ALERTAS CRÍTICOS */}
      {lotesCriticos.length > 0 && (
        <section className="bg-red-50 border-2 border-red-200 rounded-[2.5rem] p-6 shadow-inner">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white animate-pulse">
               <span className="text-xl font-bold">!</span>
            </div>
            <h2 className="text-2xl font-black text-red-700 uppercase tracking-tighter">
              Radar de Validade - Costelão
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lotesCriticos.map(lote => {
               const hoje = new Date()
               hoje.setHours(0,0,0,0)
               const dataVenc = new Date(lote.data_validade)
               dataVenc.setHours(0,0,0,0)
               const diasRestantes = Math.ceil((dataVenc.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))
               return (
                <div key={lote.id} className="bg-white p-5 rounded-3xl shadow-md border-l-[10px] border-red-600 flex flex-col justify-between relative overflow-hidden hover:shadow-xl transition-all">
                  <div className="absolute top-0 right-0 bg-slate-900 px-3 py-1.5 rounded-bl-xl shadow-sm">
                    <p className="text-[7px] font-black text-slate-400 uppercase leading-none">Lote</p>
                    <p className="text-[11px] font-black text-white tracking-tight">
                      {lote.numero_lote || 'S/L'}
                    </p>
                  </div>
                  <div className="pr-10">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      {lote.produtos?.marca || 'Sem Marca'}
                    </p>
                    <h3 className="font-black text-slate-900 uppercase text-base leading-tight">
                      {lote.produtos?.nome}
                    </h3>
                  </div>
                  <div className="mt-6 flex justify-between items-end border-t border-slate-50 pt-4">
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase italic">Expira em:</p>
                      <p className="text-sm font-black text-red-600">
                        {new Date(lote.data_validade).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase ${
                        diasRestantes <= 0 ? 'bg-black text-white' : 'bg-red-600 text-white shadow-lg shadow-red-100'
                      }`}>
                        {diasRestantes < 0 ? 'VENCIDO' : diasRestantes === 0 ? 'HOJE' : `${diasRestantes} DIAS`}
                      </div>
                      <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase">
                        Estoque: <span className="text-slate-900">{lote.quantidade_atual}</span>
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* LISTAGEM DE PRODUTOS COM EXCLUSÃO */}
      <section className="bg-white rounded-3xl shadow-xl p-6 border-t-4 border-blue-600">
        <h2 className="text-xl font-black text-slate-800 mb-4 uppercase tracking-tighter">Produtos Cadastrados</h2>
        {carregandoProdutos ? (
          <p className="text-slate-400 italic">Carregando produtos...</p>
        ) : produtos.length === 0 ? (
          <p className="text-slate-400 italic">Nenhum produto cadastrado.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-2 text-xs font-black text-slate-400 uppercase">Nome</th>
                <th className="p-2 text-xs font-black text-slate-400 uppercase">Marca</th>
                <th className="p-2 text-xs font-black text-slate-400 uppercase">Unidade</th>
                <th className="p-2 text-xs font-black text-slate-400 uppercase">Mínimo</th>
                <th className="p-2 text-xs font-black text-slate-400 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((p: any) => (
                <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-2 font-bold text-slate-800">{p.nome}</td>
                  <td className="p-2 text-slate-600">{p.marca || '—'}</td>
                  <td className="p-2 text-slate-600">{p.unidade_medida}</td>
                  <td className="p-2 text-slate-600">{p.estoque_minimo}</td>
                  <td className="p-2">
                    <button
                      className="px-3 py-1 bg-red-100 text-red-700 rounded font-bold text-xs hover:bg-red-200 border border-red-200 transition-colors"
                      title="Excluir produto"
                      onClick={() => excluirProduto(p.id)}
                    >
                      🗑️ Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  )
}