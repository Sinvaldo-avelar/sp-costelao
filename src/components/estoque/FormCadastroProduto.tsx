'use client'

import { useState } from 'react'
import { supabase } from '@/src/lib/supabase'
import toast from 'react-hot-toast'

export default function FormCadastroProduto() {
  const [nome, setNome] = useState('')
  const [marca, setMarca] = useState('')
  const [unidade, setUnidade] = useState('UN')
  const [minimo, setMinimo] = useState(0)
  const [carregando, setCarregando] = useState(false)

  async function salvarProduto(e: React.FormEvent) {
    e.preventDefault()
    setCarregando(true)

    // Envia os dados para a tabela 'produtos' no Supabase
    const { error } = await supabase.from('produtos').insert([
      { 
        nome: nome, 
        marca: marca, 
        unidade_medida: unidade, 
        estoque_minimo: minimo 
      }
    ])

    setCarregando(false)

    if (error) {
      toast.error('Erro ao salvar no banco: ' + error.message)
    } else {
      toast.success('Produto cadastrado com sucesso!')
      // Limpa os campos
      setNome('')
      setMarca('')
      setMinimo(0)
      // Atualiza a página para mostrar o novo item na tabela
      setTimeout(() => window.location.reload(), 1500)
    }
  }

  return (
    <form onSubmit={salvarProduto} className="bg-white p-6 rounded-lg shadow-md mb-8 border-t-4 border-blue-600">
      <h2 className="text-xl font-bold mb-4 text-gray-700">Cadastrar Novo Produto</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nome</label>
          <input
            type="text"
            className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            placeholder="Ex: Arroz 5kg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Marca</label>
          <input
            type="text"
            className="mt-1 block w-full p-2 border rounded-md shadow-sm"
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
            placeholder="Ex: Tio João"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Unidade</label>
          <select 
            className="mt-1 block w-full p-2 border rounded-md shadow-sm"
            value={unidade}
            onChange={(e) => setUnidade(e.target.value)}
          >
            <option value="UN">Unidade (UN)</option>
            <option value="KG">Quilo (KG)</option>
            <option value="FARDO">Fardo</option>
            <option value="LITRO">Litro (L)</option>
               <option value="CAIXA">Caixa (C)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Estoque Mínimo</label>
          <input
            type="number"
            className="mt-1 block w-full p-2 border rounded-md shadow-sm"
            value={minimo}
            onChange={(e) => setMinimo(Number(e.target.value))}
            min="0"
          />
        </div>
      </div>

      <button 
        type="submit"
        disabled={carregando}
        className={`mt-4 w-full md:w-auto px-6 py-2 rounded-md font-bold text-white transition-colors ${
          carregando ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {carregando ? 'Salvando...' : 'Confirmar Cadastro'}
      </button>
    </form>
  )
}