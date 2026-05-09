'use client'
import { useState, useEffect } from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)
import { exportarParaExcel } from '@/src/lib/exportarExcel'
import { supabase } from '@/src/lib/supabase'
import Select from 'react-select'
import { valoresUnicos } from '@/src/lib/valoresUnicos'

export default function RelatoriosPage() {
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')
  const [movimentacoes, setMovimentacoes] = useState<any[]>([])
  const [movsFiltradas, setMovsFiltradas] = useState<any[]>([])
  const [resumo, setResumo] = useState<any[]>([])
  const [carregando, setCarregando] = useState(false)
  const [produtoFiltro, setProdutoFiltro] = useState<{value: string, label: string} | null>(null)
  const [marcaFiltro, setMarcaFiltro] = useState<{value: string, label: string} | null>(null)
  const [tipoFiltro, setTipoFiltro] = useState<{value: string, label: string} | null>(null)
  const [destinoFiltro, setDestinoFiltro] = useState<{value: string, label: string} | null>(null)

  // Estado para modal do gráfico
  const [modalAberto, setModalAberto] = useState(false)
  const [produtoGrafico, setProdutoGrafico] = useState<{value: string, label: string} | null>(null)

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
      .select(`*, produtos ( nome, marca, unidade_medida, estoque_minimo ), lotes ( numero_lote ), responsavel`) // ajuste: inclui campo responsavel
      .gte('data_movimentacao', dataInicio + 'T00:00:00Z')
      .lte('data_movimentacao', dataFim + 'T23:59:59Z')
      .order('data_movimentacao', { ascending: false })

    if (error) {
      alert("Erro: " + error.message)
    } else {
      setMovimentacoes(movs || [])
      setMovsFiltradas(movs || [])
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

  // Filtros avançados
  function aplicarFiltros() {
    let filtradas = [...movimentacoes]
    if (produtoFiltro) filtradas = filtradas.filter(m => m.produtos?.nome === produtoFiltro.value)
    if (marcaFiltro) filtradas = filtradas.filter(m => m.produtos?.marca === marcaFiltro.value)
    if (tipoFiltro) filtradas = filtradas.filter(m => m.tipo === tipoFiltro.value)
    if (destinoFiltro) filtradas = filtradas.filter(m => (m.destino || '').toLowerCase().includes(destinoFiltro.value.toLowerCase()))
    setMovsFiltradas(filtradas)
  }

  // Atualiza filtros sempre que algum filtro ou movimentações mudam
  useEffect(() => { aplicarFiltros() }, [produtoFiltro, marcaFiltro, tipoFiltro, destinoFiltro, movimentacoes])

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
        <div className="flex gap-2">
          <button onClick={() => window.print()} className="print:hidden bg-red-600 text-white px-6 py-2 text-xs font-black uppercase rounded-full hover:bg-red-700 transition-all shadow-lg">
            IMPRIMIR PDF
          </button>
          <button
            onClick={() => exportarParaExcel(movimentacoes, 'relatorio-movimentacoes.xlsx')}
            className="print:hidden bg-emerald-600 text-white px-6 py-2 text-xs font-black uppercase rounded-full hover:bg-emerald-700 transition-all shadow-lg"
            disabled={movimentacoes.length === 0}
          >
            EXPORTAR EXCEL
          </button>
        </div>
      </header>

      {/* FILTROS */}
      <div className="bg-slate-100 p-6 rounded-3xl flex flex-wrap items-end gap-6 print:hidden">
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-black uppercase text-slate-500">Início do Período</span>
          <input type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)} className="border-2 border-slate-200 rounded-xl p-2 text-sm font-bold outline-none focus:border-red-600" />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-black uppercase text-slate-500">Fim do Período</span>
          <input type="date" value={dataFim} onChange={e => setDataFim(e.target.value)} className="border-2 border-slate-200 rounded-xl p-2 text-sm font-bold outline-none focus:border-red-600" />
        </div>
        <div className="flex flex-col gap-2 min-w-[180px]">
          <span className="text-[10px] font-black uppercase text-slate-500">Produto</span>
          <Select
            options={valoresUnicos<any>(movimentacoes, 'produtos').map((p: any) => ({ label: p?.nome, value: p?.nome }))}
            value={produtoFiltro}
            onChange={setProdutoFiltro}
            isClearable
            placeholder="Todos"
            classNamePrefix="react-select"
          />
        </div>
        <div className="flex flex-col gap-2 min-w-[140px]">
          <span className="text-[10px] font-black uppercase text-slate-500">Marca</span>
          <Select
            options={valoresUnicos<any>(movimentacoes, 'produtos').map((p: any) => ({ label: p?.marca, value: p?.marca })).filter((o: any) => o.value)}
            value={marcaFiltro}
            onChange={setMarcaFiltro}
            isClearable
            placeholder="Todas"
            classNamePrefix="react-select"
          />
        </div>
        <div className="flex flex-col gap-2 min-w-[120px]">
          <span className="text-[10px] font-black uppercase text-slate-500">Tipo</span>
          <Select
            options={[{ label: 'ENTRADA', value: 'ENTRADA' }, { label: 'SAÍDA', value: 'SAIDA' }, { label: 'AJUSTE', value: 'AJUSTE' }]}
            value={tipoFiltro}
            onChange={setTipoFiltro}
            isClearable
            placeholder="Todos"
            classNamePrefix="react-select"
          />
        </div>
        <div className="flex flex-col gap-2 min-w-[180px]">
          <span className="text-[10px] font-black uppercase text-slate-500">Destino/Setor</span>
          <input type="text" value={destinoFiltro?.value || ''} onChange={e => setDestinoFiltro(e.target.value ? { value: e.target.value, label: e.target.value } : null)} placeholder="Todos" className="border-2 border-slate-200 rounded-xl p-2 text-sm font-bold outline-none focus:border-red-600" />
        </div>
        <button onClick={gerarRelatorioCompleto} className="bg-slate-900 text-white px-8 py-3 rounded-xl text-xs font-black uppercase hover:scale-105 transition-all">
          {carregando ? 'GERANDO...' : 'CONSULTAR ESTOQUE'}
        </button>
      </div>

      {/* BOTÃO PARA ABRIR O MODAL DO GRÁFICO */}
      {resumo.length > 0 && (
        <div className="flex justify-end">
          <button
            className="bg-emerald-600 text-white px-6 py-2 text-xs font-black uppercase rounded-full hover:bg-emerald-700 transition-all shadow-lg"
            onClick={() => setModalAberto(true)}
          >
            Ver Gráfico de Entradas/Saídas
          </button>
        </div>
      )}

      {/* MODAL DO GRÁFICO */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-3xl w-full relative">
            <button
              className="absolute top-2 right-2 text-slate-500 hover:text-red-600 text-xl font-black"
              onClick={() => setModalAberto(false)}
              aria-label="Fechar"
            >
              ×
            </button>
            <h2 className="text-[13px] font-black bg-emerald-600 text-white px-4 py-2 rounded-full inline-block uppercase tracking-widest italic mb-4">Saídas por Marca</h2>
            <div className="mb-4 max-w-xs">
              <Select
                options={valoresUnicos<any>(movimentacoes, 'produtos').map((p: any) => ({ label: p?.nome, value: p?.nome }))}
                value={produtoGrafico}
                onChange={setProdutoGrafico}
                isClearable
                placeholder="Selecione o produto"
                classNamePrefix="react-select"
              />
            </div>
            {produtoGrafico ? (
              <Bar
                data={{
                  labels: valoresUnicos<any>(movimentacoes.filter(m => m.produtos?.nome === produtoGrafico.value), 'produtos').map((p: any) => p?.marca),
                  datasets: [
                    {
                      label: 'Saídas',
                      data: valoresUnicos<any>(movimentacoes.filter(m => m.produtos?.nome === produtoGrafico.value), 'produtos').map((p: any) => {
                        // Soma as saídas desse produto e marca
                        return movimentacoes.filter(m => m.produtos?.nome === produtoGrafico.value && m.produtos?.marca === p?.marca && m.tipo === 'SAIDA').reduce((acc, cur) => acc + cur.quantidade, 0)
                      }),
                      backgroundColor: 'rgba(239, 68, 68, 0.7)'
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'top' as const },
                    title: { display: false }
                  },
                  scales: {
                    x: { ticks: { color: '#111' } },
                    y: { ticks: { color: '#111' } }
                  }
                }}
                height={120}
              />
            ) : (
              <div className="text-slate-500 text-sm italic">Selecione um produto para visualizar o gráfico.</div>
            )}
          </div>
        </div>
      )}

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
            {resumo.map((r, i) => {
              const saldoNegativo = r.balancoPeriodo < 0;
              const abaixoMinimo = r.balancoPeriodo < (r.estoque_minimo || 0);
              return (
                <tr key={i} className={`hover:bg-slate-50 transition-colors ${saldoNegativo ? 'bg-red-50' : abaixoMinimo ? 'bg-yellow-50' : ''}`}>
                  <td className="p-4 font-black uppercase text-slate-800">
                    {r.nome} <span className="text-slate-400 font-bold ml-2">[{r.marca}]</span>
                  </td>
                  <td className="p-4 text-center font-bold text-emerald-600">
                    {r.totalEntradas > 0 ? `+ ${exibirQtdComUnidade(r.totalEntradas, r.unidade)}` : '---'}
                  </td>
                  <td className="p-4 text-center font-bold text-red-600">
                    {r.totalSaidas > 0 ? `- ${exibirQtdComUnidade(r.totalSaidas, r.unidade)}` : '---'}
                  </td>
                  <td className={`p-4 text-center font-black text-base ${saldoNegativo ? 'text-red-600 border-l-4 border-red-600' : abaixoMinimo ? 'text-yellow-600 border-l-4 border-yellow-400' : 'text-slate-900 border-l-4 border-slate-900'}`}>
                    {exibirQtdComUnidade(r.balancoPeriodo, r.unidade)}
                    {saldoNegativo && <span className="ml-2 text-xs font-bold text-red-600">SALDO NEGATIVO</span>}
                    {!saldoNegativo && abaixoMinimo && <span className="ml-2 text-xs font-bold text-yellow-600">ABAIXO DO MÍNIMO</span>}
                  </td>
                </tr>
              )
            })}
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
              <th className="p-3 text-left">Lote</th>
              <th className="p-3 text-left">Validade</th>
              <th className="p-3 text-left">Depósito</th>
              <th className="p-3 text-left">Destino</th>
              <th className="p-3 text-left">Responsável</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {movsFiltradas.map((m, i) => (
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
                <td className="p-3 text-slate-700 font-mono text-xs">{m.lotes?.numero_lote || '---'}</td>
                <td className="p-3 text-slate-700 font-mono text-xs">{m.data_validade ? new Date(m.data_validade).toLocaleDateString('pt-BR') : '---'}</td>
                <td className="p-3 text-slate-700 font-mono text-xs">{m.deposito_nome || '---'}</td>
                <td className="p-3 text-slate-500 italic uppercase font-bold text-[9px] max-w-[200px] truncate">{m.destino || '---'}</td>
                <td className="p-3 text-slate-700 font-mono text-xs">{m.responsavel || '---'}</td>
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