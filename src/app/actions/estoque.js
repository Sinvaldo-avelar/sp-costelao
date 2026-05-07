'use server'

import { createClient } from '@/lib/supabase/server' // sua config do supabase
import { revalidatePath } from 'next/cache'

export async function registrarSaida(formData: Movimentacao) {
  const supabase = createClient()

  // 1. Atualiza a quantidade atual no Lote específico (Baixa no lote)
  const { data: lote, error: erroLote } = await supabase
    .from('lotes')
    .select('quantidade_atual')
    .eq('id', formData.lote_id)
    .single()

  if (erroLote || lote.quantidade_atual < formData.quantidade) {
    throw new Error('Estoque insuficiente neste lote!')
  }

  const novaQuantidade = lote.quantidade_atual - formData.quantidade

  const { error: updateError } = await supabase
    .from('lotes')
    .update({ quantidade_atual: novaQuantidade })
    .eq('id', formData.lote_id)

  // 2. Registra a movimentação com a NF de Saída
  const { error: moveError } = await supabase
    .from('movimentacoes')
    .insert([{
      tipo: 'SAIDA',
      produto_id: formData.produto_id,
      lote_id: formData.lote_id,
      quantidade: formData.quantidade,
      nf_documento: formData.nf_documento,
      destino_origem: formData.destino_origem
    }])

  if (!updateError && !moveError) {
    revalidatePath('/estoque')
    return { success: true }
  }
}