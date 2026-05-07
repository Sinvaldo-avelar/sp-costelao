'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function FormSaidaLote() {
  const [lotes, setLotes] = useState<any[]>([])
  const [loteId, setLoteId] = useState('')
  const [quantidadeDigitada, setQuantidadeDigitada] = useState('') // Texto para facilitar a digitação
  const [destino, setDestino] = useState('')
  const [carregando, setCarregando] = useState(false)

  useEffect(() => {
    async function buscarLotes() {
      const { data } = await supabase
        .from('lotes')
        .select('id, numero_lote, quantidade_atual, produto_id, produtos(nome)')
        .gt('quantidade_atual', 0)
        .order('numero_lote', { ascending: true })
      if (data) setLotes(data)
    }
    buscarLotes()
  }, [])

  async function registrarSaida(e: React.FormEvent) {
    e.preventDefault()
    const qtdNum = parseFloat(quantidadeDigitada.replace(',', '.')) // Aceita vírgula ou ponto

    if (!loteId || isNaN(qtdNum) || qtdNum <= 0) {
      alert("Por favor, selecione o lote e digite uma quantidade válida.")
      return
    }

    setCarregando(true)
    const lote = lotes.find(l => l.id === loteId)

    if (qtdNum > lote.quantidade_atual) {
      alert(`Saldo insuficiente! Você tentou retirar ${qtdNum}, mas só existem ${lote.quantidade_atual} no lote.`)
      setCarregando(false)
      return
    }

    // Cálculo limpo evitando erros de decimais
    const novoSaldo = parseFloat((lote.quantidade_atual - qtdNum).toFixed(3))

    // 1. Atualiza o Lote
    const { error: erroUpdate } = await supabase
      .from('lotes')
      .update({ quantidade_atual: novoSaldo })
      .eq('id', loteId)

    if (erroUpdate) {
      alert('Erro ao atualizar: ' + erroUpdate.message)
    } else {
      // 2. Grava no Histórico (O que alimenta o seu Relatório)
      const { error: erroHist } = await supabase
        .from('historico_estoque')
        .insert([{
          tipo: 'SAIDA',
          produto_id: lote.produto_id,
          quantidade: qtdNum,
          destino: destino || 'Saída PDV / Consumo',
          lote_id: loteId
        }])

      if (erroHist) {
        alert('Estoque baixado, mas o histórico falhou. Verifique a tabela historico_estoque.')
      } else {
        alert('✅ Saída de ' + qtdNum + ' registrada com sucesso!')
        // Resetar campos
        setLoteId('')
        setQuantidadeDigitada('')
        setDestino('')
        window.location.reload() // Atualiza para mostrar os novos saldos
      }
    }
    setCarregando(false)
  }

  return (
    <form onSubmit={registrarSaida} className="space-y-6 bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* SELEÇÃO DO PRODUTO/LOTE */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Produto no Estoque</label>
          <select 
            className="p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:border-red-500 transition-all"
            value={loteId}
            onChange={(e) => setLoteId(e.target.value)}
            required
          >
            <option value="">Selecione o item...</option>
            {lotes.map(l => (
              <option key={l.id} value={l.id}>
                {l.produtos.nome} (Lote: {l.numero_lote || 'S/N'} - Saldo: {l.quantidade_atual})
              </option>
            ))}
          </select>
        </div>

        {/* QUANTIDADE DIGITADA */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Quantidade a Retirar</label>
          <input 
            type="text" 
            inputMode="decimal"
            placeholder="Ex: 0,500 ou 10"
            className="p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-xl text-red-600 outline-none focus:border-red-500 transition-all"
            value={quantidadeDigitada}
            onChange={(e) => setQuantidadeDigitada(e.target.value)}
            required
          />
        </div>

        {/* DESTINO */}
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Para onde vai? (Destino)</label>
          <input 
            type="text" 
            placeholder="Ex: Prateleira, Balcão, Descarte..."
            className="p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-600 outline-none focus:border-red-500 transition-all"
            value={destino}
            onChange={(e) => setDestino(e.target.value)}
          />
        </div>
      </div>

      <button 
        type="submit" 
        disabled={carregando}
        className="w-full py-5 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-red-100 transition-all active:scale-95 disabled:bg-slate-300"
      >
        {carregando ? 'PROCESSANDO...' : 'CONFIRMAR BAIXA NO ESTOQUE'}
      </button>
    </form>
  )
}