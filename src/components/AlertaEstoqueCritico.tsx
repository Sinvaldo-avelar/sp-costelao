'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function AlertaEstoqueCritico() {
  const [criticos, setCriticos] = useState<any[]>([])

  useEffect(() => {
    async function verificarEstoque() {
      // Busca produtos e seus lotes
      const { data } = await supabase
        .from('produtos')
        .select('nome, estoque_minimo, lotes(quantidade_atual)')

      if (data) {
        const itensParaComprar = data.filter((prod: any) => {
          // Soma o total de todos os lotes do produto
          const totalAtual = prod.lotes.reduce((acc: number, lote: any) => acc + lote.quantidade_atual, 0)
          // Retorna true se o total for menor que o mínimo
          return totalAtual < prod.estoque_minimo
        }).map((prod: any) => ({
          nome: prod.nome,
          minimo: prod.estoque_minimo,
          atual: prod.lotes.reduce((acc: number, lote: any) => acc + lote.quantidade_atual, 0)
        }))

        setCriticos(itensParaComprar)
      }
    }
    verificarEstoque()
  }, [])

  if (criticos.length === 0) return null // Não mostra nada se estiver tudo ok

  return (
    <div className="bg-amber-50 border-l-8 border-amber-500 p-4 mb-8 rounded-r-xl shadow-md">
      <div className="flex items-center mb-2">
        <span className="text-2xl mr-2">⚠️</span>
        <h3 className="text-amber-800 font-black uppercase text-sm">Atenção: Necessário Reposição</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {criticos.map((item, index) => (
          <div key={index} className="bg-white p-3 rounded border border-amber-200 flex justify-between items-center">
            <div>
              <p className="font-bold text-gray-800 uppercase text-xs">{item.nome}</p>
              <p className="text-[10px] text-gray-500">Mínimo sugerido: {item.minimo}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-black text-red-600">{item.atual}</p>
              <p className="text-[9px] uppercase font-bold text-gray-400">Em estoque</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}