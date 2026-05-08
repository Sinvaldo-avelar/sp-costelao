'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/src/contexts/AuthContext'
import Select from 'react-select'
import toast from 'react-hot-toast'

export default function FormSaidaLote() {
  const searchParams = useSearchParams()
  const parametroLoteId = searchParams.get('loteId')

  const { user } = useAuth()
  const usuarioFormatado = user?.email || 'usuário_demo'

  const [lotes, setLotes] = useState<any[]>([])
  const [loteId, setLoteId] = useState<any>(null)
  const [quantidadeDigitada, setQuantidadeDigitada] = useState('') 
  const [destino, setDestino] = useState('')
  const [carregando, setCarregando] = useState(false)

  const inputQtdRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function buscarLotes() {
      const { data } = await supabase
        .from('lotes')
        .select('id, numero_lote, quantidade_atual, produto_id, produtos(nome)')
        .gt('quantidade_atual', 0)
        .order('numero_lote', { ascending: true })
      if (data) {
        setLotes(data)
        // Se a página for carregada com um ID predefinido (saindo do inventario) e existir na lista:
        if (parametroLoteId && data.find(l => l.id === parametroLoteId)) {
          setLoteId({ value: parametroLoteId, label: 'Lote selecionado' }) // simplified label
        }
      }
    }
    buscarLotes()
  }, [parametroLoteId])

  // Tratando a seleção do Select (leitor de código de barras ou busca)
  const handleChangeLote = (selectedOption: any) => {
    setLoteId(selectedOption)
    if (selectedOption && inputQtdRef.current) {
      setTimeout(() => {
        inputQtdRef.current?.focus()
      }, 50)
    }
  }

  // Atalho Enter para submit no último field
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !!quantidadeDigitada) {
      // Deixe o submit padrão lidar ou force se quiser
    }
  }

  async function registrarSaida(e: React.FormEvent) {
    e.preventDefault()
    const qtdNum = parseFloat(quantidadeDigitada.replace(',', '.')) 

    if (!loteId?.value || isNaN(qtdNum) || qtdNum <= 0) {
      toast.error('Por favor, selecione o lote e digite uma quantidade válida.')
      return
    }

    setCarregando(true)
    const lote = lotes.find(l => l.id === loteId.value)

    if (qtdNum > lote.quantidade_atual) {
      toast.error(`Saldo insuficiente! Só existem ${lote.quantidade_atual} unidades no lote selecionado.`)
      setCarregando(false)
      return
    }

    const novoSaldo = parseFloat((lote.quantidade_atual - qtdNum).toFixed(3))

    const { error: erroUpdate } = await supabase
      .from('lotes')
      .update({ quantidade_atual: novoSaldo })
      .eq('id', loteId.value)

    if (erroUpdate) {
      toast.error('Erro ao atualizar estoque: ' + erroUpdate.message)
    } else {
      const { error: erroHist } = await supabase
        .from('historico_estoque')
        .insert([{
          tipo: 'SAIDA',
          produto_id: lote.produto_id,
          quantidade: qtdNum,
          destino: destino || 'Saída PDV / Consumo',
          lote_id: loteId.value,
          usuario: usuarioFormatado
        }])

      if (erroHist) {
        toast.error('Estoque baixado, mas falha ao salvar log de movimentação.')
      } else {
        toast.success(`Baixa concluída: ${qtdNum} unidades removidas com sucesso!`, {
          icon: '✅',
        })
        setLoteId(null)
        setQuantidadeDigitada('')
        setDestino('')
        window.history.replaceState({}, '', '/estoque/saida')
        setLotes(prev => prev.map(l => l.id === loteId.value ? { ...l, quantidade_atual: novoSaldo } : l))
      }
    }
    setCarregando(false)
  }

  // Opções para o react-select formatadas
  const opcoesLotes = lotes.map(l => ({
    value: l.id,
    label: `${l.produtos.nome} (Lote: ${l.numero_lote || 'S/N'} - Qtd: ${l.quantidade_atual})`
  }))

  return (
    <form onSubmit={registrarSaida} className="space-y-6 bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* SELEÇÃO DO PRODUTO/LOTE COM LEITOR */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Produto no Estoque (Bipe ou Busque)</label>
          <Select
            options={opcoesLotes}
            value={loteId}
            onChange={handleChangeLote}
            placeholder="Leia o código ou nome..."
            isClearable
            autoFocus
            classNamePrefix="react-select"
            styles={{
              control: (base) => ({ ...base, minHeight: '56px', borderRadius: '1rem', borderColor: '#f1f5f9', borderWidth: '2px' })
            }}
          />
        </div>

        {/* QUANTIDADE DIGITADA */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Quantidade a Retirar</label>
          <input 
            type="text" 
            ref={inputQtdRef}
            onKeyDown={handleKeyDown}
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
            onKeyDown={e => e.key === 'Enter' && registrarSaida(e as any)}
          />
        </div>
      </div>

      <button 
        type="submit" 
        disabled={carregando}
        className="w-full py-5 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-red-100 transition-all active:scale-95 disabled:bg-slate-300"
      >
        {carregando ? 'PROCESSANDO...' : 'CONFIRMAR BAIXA NO ESTOQUE (ENTER)'}
      </button>
    </form>
  )
}