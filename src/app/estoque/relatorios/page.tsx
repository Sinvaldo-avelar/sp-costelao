'use client'
import { useState } from 'react'
import { supabase } from '@/src/lib/supabase'

export default function RelatoriosPage() {
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')
  const [movimentacoes, setMovimentacoes] = useState<any[]>([])
  const [resumo, setResumo] = useState<any[]>([])
  const [carregando, setCarregando] = useState(false)

  // FUNÇÃO DE FORMATAÇÃO: Exibe a quantidade e a sigla da unidade (ex: 20 FD, 1,450 KG)
  const exibirQtdComUnidade = (valor: number, unidade: string) => {
    const numeroFormatado = Number.isInteger(valor) 
      ? valor.toString() 
      : valor.toLocaleString('pt-BR', { minimumFractionDigits: 3, maximumFractionDigits: 3 });
    
    // Se não tiver unidade cadastrada, assume 'UN' (Unidade)
    const sigla = unidade ? unidade.toUpperCase() : 'UN';
    return `${numeroFormatado} ${sigla}`;
  }

  async function gerarRelatorioCompleto() {
    if (!dataInicio || !dataFim) return alert("Selecione o período!")
    setCarregando(true)

    const { data: movs, error } = await supabase
      .from('historico_estoque')
      .select(`*, produtos ( nome, marca, unidade_medida, estoque_minimo ), lotes ( numero_lote )`)
      .gte('data_movimentacao', dataInicio + 'T00:00:00Z')
      .lte('data_movimentacao', dataFim + 'T23:59:59Z')
      .order('data_movimentacao', { ascending: false })

    if (error) {
      alert("Erro: " + error.message)
    } else {
      setMovimentacoes(movs || [])

      const produtosUnicos = Array.from(new Set(movs?.map(m => m.produtos?.nome)))
      
      const calculoResumo = produtosUnicos.map(nomeProd => {
        const itens = movs?.filter(m => m.produtos?.nome === nomeProd) || []
        const prodData = itens[0]?.produtos; 
        const entradas = itens.filter(i => i.tipo === 'ENTRADA').reduce((acc, cur) => acc + cur.quantidade, 0)
        const saidas = itens.filter(i => i.tipo === 'SAIDA').reduce((acc, cur) => acc + cur.quantidade, 0)
        
        return {
          nome: nomeProd,
          marca: prodData?.marca || '',
          unidade: prodData?.unidade_medida || 'UN',
          totalEntradas: entradas,
          totalSaidas: saidas,
          balancoPeriodo: entradas - saidas
        }
      })
      setResumo(calculoResumo)
    }
    setCarregando(false)
  }

  return (
    <div className="max-w-full mx-auto p-2 space-y-8 font-sans bg-white min-h-screen">
      {/* CABEÇALHO EMPRESARIAL */}
      <header className="flex justify-between items-center border-b-4 border-slate-900 pb-4">
        <div className="flex items-center gap-4">
           <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center text-white font-black text-[10px] text-center leading-tight p-2 uppercase">
            Sistema Costelão
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tighter leading-none">Balanço de Movimentação</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Conferência Física de Estoque</p>
          </div>
        </div>
        <button onClick={() => window.print()} className="print:hidden bg-red-600 text-white px-6 py-2 text-xs font-black uppercase rounded-full hover:bg-red-700 transition-all shadow-lg">
          IMPRIMIR PDF
        </button>
      </header>

      {/* FILTROS */}
      <div className="bg-slate-100 p-6 rounded-3xl flex items-end gap-6 print:hidden">
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-black uppercase text-slate-500">Início do Período</span>
          <input type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)} className="border-2 border-slate-200 rounded-xl p-2 text-sm font-bold outline-none focus:border-red-600" />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-black uppercase text-slate-500">Fim do Período</span>
          <input type="date" value={dataFim} onChange={e => setDataFim(e.target.value)} className="border-2 border-slate-200 rounded-xl p-2 text-sm font-bold outline-none focus:border-red-600" />
        </div>
        <button onClick={gerarRelatorioCompleto} className="bg-slate-900 text-white px-8 py-3 rounded-xl text-xs font-black uppercase hover:scale-105 transition-all">
          {carregando ? 'GERANDO...' : 'CONSULTAR ESTOQUE'}
        </button>
      </div>

      {/* 1. SEÇÃO: RESUMO CONSOLIDADO */}
      <section className="space-y-4">
        <h2 className="text-[11px] font-black bg-slate-900 text-white px-4 py-2 rounded-full inline-block uppercase tracking-widest italic">1. Resumo Quantitativo</h2>
        <table className="w-full border-collapse text-[12px]">
          <thead>
            <tr className="text-slate-400 font-black uppercase text-[10px] border-b-2 border-slate-100">
              <th className="p-4 text-left">Item / Marca</th>
              <th className="p-4 text-center text-emerald-600">Total Entradas</th>
              <th className="p-4 text-center text-red-600">Total Saídas</th>
              <th className="p-4 text-center bg-slate-50">Saldo Físico</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {resumo.map((r, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-black uppercase text-slate-800">
                  {r.nome} <span className="text-slate-400 font-bold ml-2">[{r.marca}]</span>
                </td>
                <td className="p-4 text-center font-bold text-emerald-600">
                  {r.totalEntradas > 0 ? `+ ${exibirQtdComUnidade(r.totalEntradas, r.unidade)}` : '---'}
                </td>
                <td className="p-4 text-center font-bold text-red-600">
                  {r.totalSaidas > 0 ? `- ${exibirQtdComUnidade(r.totalSaidas, r.unidade)}` : '---'}
                </td>
                <td className={`p-4 text-center font-black text-base ${r.balancoPeriodo >= 0 ? 'text-slate-900 border-l-4 border-slate-900' : 'text-red-600 border-l-4 border-red-600'}`}>
                  {exibirQtdComUnidade(r.balancoPeriodo, r.unidade)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* 2. SEÇÃO: HISTÓRICO DETALHADO */}
      <section className="space-y-4">
        <h2 className="text-[11px] font-black bg-slate-900 text-white px-4 py-2 rounded-full inline-block uppercase tracking-widest italic">2. Extrato Detalhado</h2>
        <table className="w-full border-collapse text-[10px]">
          <thead className="bg-slate-50">
            <tr className="uppercase font-black text-slate-500 border-b border-slate-200">
              <th className="p-3 text-left">Data/Hora</th>
              <th className="p-3 text-left">Produto</th>
              <th className="p-3 text-center">Operação</th>
              <th className="p-3 text-right">Qtd Movimentada</th>
              <th className="p-3 text-left">Destino</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {movimentacoes.map((m, i) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="p-3 font-bold text-slate-500">{new Date(m.data_movimentacao).toLocaleString('pt-BR')}</td>
                <td className="p-3 font-black uppercase text-slate-700 leading-tight">
                  {m.produtos?.nome} <br/>
                  <span className="text-[8px] text-slate-400 font-bold">MARCA: {m.produtos?.marca}</span>
                </td>
                <td className={`p-3 text-center font-black ${m.tipo === 'ENTRADA' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {m.tipo}
                </td>
                <td className="p-3 text-right font-black text-sm">
                  {exibirQtdComUnidade(m.quantidade, m.produtos?.unidade_medida)}
                </td>
                <td className="p-3 text-slate-500 italic uppercase font-bold text-[9px] max-w-[200px] truncate">{m.destino || '---'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <footer className="mt-12 pt-4 border-t-2 border-slate-100 text-[10px] text-slate-400 flex justify-between uppercase font-black italic">
        <span>Extraído em: {new Date().toLocaleString('pt-BR')}</span>
        <span>Supermercado Costelão - Gestão de Logística</span>
      </footer>
    </div>
  )
}