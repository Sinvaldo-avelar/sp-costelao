'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/src/lib/supabase'

export default function DashboardEstoque() {
  const [lotesCriticos, setLotesCriticos] = useState<any[]>([])

  useEffect(() => {
    async function verificarValidades() {
      // Busca os lotes que ainda têm estoque, incluindo o número do lote e alerta personalizado
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
        .gt('quantidade_atual', 0) // Só o que ainda tem no estoque físico

      if (data) {
        const hoje = new Date()
        hoje.setHours(0, 0, 0, 0) // Zera as horas para comparação justa de dias
        
        const alertas = data.filter(lote => {
          const dataVenc = new Date(lote.data_validade)
          dataVenc.setHours(0, 0, 0, 0)
          
          const diferencaDias = Math.ceil((dataVenc.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))
          
          // Filtra se a diferença de dias for menor ou igual ao que você configurou no cadastro
          return diferencaDias <= (lote.dias_alerta_vencimento || 5)
        })

        setLotesCriticos(alertas)
      }
    }

    verificarValidades()
  }, [])

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
                  
                  {/* ETIQUETA DO LOTE (O detalhe que faltava) */}
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

      {/* RESTANTE DO DASHBOARD... */}
      
    </div>
  )
}