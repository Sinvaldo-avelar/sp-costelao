'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { produtoSchema } from '../lib/validacao'
import { logEvento } from '../lib/logger'
import { registrarAuditoria } from '../lib/auditoria'
import toast from 'react-hot-toast'

export default function FormEntradaLote() {
  const [produtos, setProdutos] = useState<any[]>([])
  const [busca, setBusca] = useState('')
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false)
  const [produtoSelecionado, setProdutoSelecionado] = useState<any>(null)
  
  const [quantidade, setQuantidade] = useState('')
  const [validade, setValidade] = useState('')
  const [nf, setNf] = useState('')
  const [loteNumero, setLoteNumero] = useState('')
  const [diasAlerta, setDiasAlerta] = useState('5') // Padrão de 5 dias sugerido
  const [carregando, setCarregando] = useState(false)
  
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function buscarProdutos() {
      const { data } = await supabase
        .from('produtos')
        .select('id, nome, marca')
        .order('nome', { ascending: true })
      if (data) setProdutos(data)
    }
    buscarProdutos()

    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setMostrarSugestoes(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const produtosFiltrados = produtos.filter(p => 
    `${p.nome} ${p.marca}`.toLowerCase().includes(busca.toLowerCase())
  )

  async function salvarLote(e: React.FormEvent) {
    e.preventDefault()
    if (!produtoSelecionado) return toast.error("Por favor, selecione um produto da lista!")

    const qtdNum = parseFloat(quantidade.replace(',', '.'))
    if (isNaN(qtdNum) || qtdNum <= 0) return toast.error("Quantidade inválida!")

    // Validação com Zod
    const validacao = produtoSchema.safeParse({
      nome: produtoSelecionado.nome,
      quantidade: qtdNum,
      unidade: produtoSelecionado.unidade || 'un',
      lote: loteNumero
    })
    if (!validacao.success) {
      toast.error('Erro de validação: ' + validacao.error.message)
      return
    }

    setCarregando(true)
    logEvento('entrada_estoque_iniciada', { produtoId: produtoSelecionado.id, quantidade: qtdNum })

    // 1. Registra o novo Lote com a sua regra de alerta personalizada
    const { error: erroLote } = await supabase.from('lotes').insert([
      { 
        produto_id: produtoSelecionado.id,
        quantidade_inicial: qtdNum,
        quantidade_atual: qtdNum,
        data_validade: validade,
        nf_entrada: nf,
        numero_lote: loteNumero,
        dias_alerta_vencimento: parseInt(diasAlerta)
      }
    ])

    if (erroLote) {
      logEvento('erro_entrada_estoque', { erro: erroLote.message })
      toast.error('Erro ao salvar lote: ' + erroLote.message)
    } else {
      await supabase.from('historico_estoque').insert([{
        tipo: 'ENTRADA',
        produto_id: produtoSelecionado.id,
        quantidade: qtdNum,
        destino: `Entrada NF: ${nf || 'S/N'}`,
      }])
      registrarAuditoria('entrada_estoque', 'usuario_atual', {
        produtoId: produtoSelecionado.id,
        quantidade: qtdNum,
        lote: loteNumero,
        nf,
        validade,
        diasAlerta
      })
      logEvento('entrada_estoque_sucesso', { produtoId: produtoSelecionado.id, quantidade: qtdNum })
      toast.success(`Entrada de ${produtoSelecionado.nome.toUpperCase()} registrada com sucesso!`, { icon: '📦' })
      setTimeout(() => window.location.reload(), 1500)
    }
    setCarregando(false)
  }

  return (
    <form onSubmit={salvarLote} className="bg-white p-8 rounded-[2.5rem] shadow-xl mb-10 border-t-8 border-emerald-600">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">📥 Registro de Entrada</h2>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest italic">Gestão de Lotes — Sistema Costelão</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* BUSCA INTELIGENTE */}
        <div className="flex flex-col gap-2 md:col-span-2 lg:col-span-1 relative" ref={wrapperRef}>
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Procurar Produto</label>
          <input 
            type="text"
            placeholder="Nome ou Marca..."
            className={`w-full p-4 bg-slate-50 border-2 rounded-2xl font-bold outline-none transition-all ${
              produtoSelecionado ? 'border-emerald-500 bg-emerald-50 text-emerald-900' : 'border-slate-100 focus:border-emerald-500'
            }`}
            value={produtoSelecionado ? `${produtoSelecionado.nome.toUpperCase()} — [ ${produtoSelecionado.marca?.toUpperCase()} ]` : busca}
            onChange={(e) => {
              setBusca(e.target.value)
              setProdutoSelecionado(null)
              setMostrarSugestoes(true)
            }}
            onFocus={() => setMostrarSugestoes(true)}
          />
          
          {mostrarSugestoes && busca.length > 0 && !produtoSelecionado && (
            <div className="absolute top-full left-0 w-full bg-white border-2 border-slate-100 shadow-2xl rounded-2xl mt-2 z-50 max-h-60 overflow-y-auto font-sans text-sm">
              {produtosFiltrados.map(p => (
                <div key={p.id} className="p-4 hover:bg-emerald-50 cursor-pointer border-b border-slate-50 last:border-none"
                  onClick={() => { setProdutoSelecionado(p); setMostrarSugestoes(false); }}>
                  <p className="font-black uppercase">{p.nome}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{p.marca || 'Sem Marca'}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* QUANTIDADE */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Qtd / Peso (Ex: 10,500)</label>
          <input type="text" inputMode="decimal" className="p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-emerald-600 text-xl outline-none"
            value={quantidade} onChange={(e) => setQuantidade(e.target.value)} placeholder="0,000" required />
        </div>

        {/* VALIDADE */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Data de Validade</label>
          <input type="date" className="p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold"
            value={validade} onChange={(e) => setValidade(e.target.value)} required />
        </div>

        {/* ALERTA PERSONALIZADO (NOVO CAMPO) */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase text-red-500 tracking-widest pl-1 animate-pulse">
            Avisar Vencimento (Dias antes)
          </label>
          <input 
            type="number" 
            className="p-4 bg-red-50 border-2 border-red-100 rounded-2xl font-black text-red-600 outline-none focus:border-red-500"
            value={diasAlerta} 
            onChange={(e) => setDiasAlerta(e.target.value)} 
            placeholder="Ex: 5"
            required
          />
        </div>

        {/* NOTA FISCAL */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Nota Fiscal</label>
          <input type="text" className="p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold"
            value={nf} onChange={(e) => setNf(e.target.value)} placeholder="Nº da NF" />
        </div>

        {/* LOTE */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Número do Lote</label>
          <input type="text" className="p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold"
            value={loteNumero} onChange={(e) => setLoteNumero(e.target.value)} placeholder="Lote Fornecedor" />
        </div>
      </div>

      <button type="submit" disabled={carregando || !produtoSelecionado}
        className="mt-10 w-full lg:w-auto px-12 py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 disabled:bg-slate-300">
        {carregando ? 'PROCESSANDO...' : 'REGISTRAR ENTRADA NO COSTELÃO'}
      </button>
    </form>
  )
}