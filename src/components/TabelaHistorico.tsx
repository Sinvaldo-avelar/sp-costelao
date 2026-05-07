'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function TabelaHistorico() {
  const [historico, setHistorico] = useState<any[]>([])

  useEffect(() => {
    async function buscarHistorico() {
      const { data, error } = await supabase
        .from('movimentacoes')
        .select('*')
        .order('data_hora', { ascending: false })
        .limit(15) 
      
      if (error) {
        console.error("Erro ao buscar histórico:", error.message)
      } else if (data) {
        setHistorico(data)
      }
    }
    buscarHistorico()
  }, [])

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
      <div className="bg-gray-700 p-4">
        <h3 className="text-white font-bold flex items-center gap-2">
          🕒 Movimentações Recentes
        </h3>
      </div>
      <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
        {historico.length > 0 ? (
          historico.map((h) => (
            <div key={h.id} className={`text-xs p-3 rounded-lg border-l-4 shadow-sm ${
              h.tipo === 'SAIDA' ? 'border-red-500 bg-red-50' : 'border-green-500 bg-green-50'
            }`}>
              <div className="flex justify-between mb-1">
                <span className="font-bold text-gray-700">
                  {new Date(h.data_hora).toLocaleString('pt-BR')}
                </span>
                <span className={`font-black ${h.tipo === 'SAIDA' ? 'text-red-600' : 'text-green-600'}`}>
                  {h.tipo}
                </span>
              </div>
              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">{h.quantidade}</span> de 
                <span className="font-semibold text-gray-800"> {h.produto_nome}</span>
              </p>
              {h.destino_origem && (
                <p className="text-[10px] text-gray-500 mt-1 italic">Destino: {h.destino_origem}</p>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 text-sm py-8 italic">
            Nenhuma movimentação registrada ainda.
          </p>
        )}
      </div>
    </div>
  )
}