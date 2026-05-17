'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'

interface LoginProps {
  children: React.ReactNode
  setor: 'ESTOQUE' | 'COMPRAS'
}

export default function LoginSetor({ children, setor }: LoginProps) {
  const [autorizado, setAutorizado] = useState(false)
  const [senhaDigitada, setSenhaDigitada] = useState('')
  const [erro, setErro] = useState(false)

  // As senhas que você definiu
  const SENHAS = {
    ESTOQUE: 'estoque123',
    COMPRAS: 'compras123'
  }

  useEffect(() => {
    // Verifica se já logou nesta sessão para não pedir senha toda hora
    const chaveSessao = `acesso_${setor.toLowerCase()}`
    const jaLogado = sessionStorage.getItem(chaveSessao)
    if (jaLogado === 'true') setAutorizado(true)
  }, [setor])

  const validarAcesso = (e: React.FormEvent) => {
    e.preventDefault()
    if (senhaDigitada === SENHAS[setor]) {
      sessionStorage.setItem(`acesso_${setor.toLowerCase()}`, 'true')
      setAutorizado(true)
      setErro(false)
    } else {
      setErro(true)
      setSenhaDigitada('')
    }
  }

  if (autorizado) return <>{children}</>

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 font-sans">
      <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-10 flex flex-col items-center border-t-8 border-red-600">
        
        {/* LOGO DO COSTELÃO */}
        <div className="w-24 h-24 relative mb-6 rounded-full overflow-hidden border-4 border-slate-100 shadow-lg">
          <Image src="/costelão.jpeg" alt="Logo Costelão" fill sizes="100vw" className="object-cover" />
        </div>

        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter text-center">
          Acesso Restrito
        </h2>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-8">
          Setor: {setor}
        </p>

        <form onSubmit={validarAcesso} className="w-full space-y-4">
          <div className="relative">
            <input 
              type="password"
              placeholder="Digite a senha do setor..."
              className={`w-full p-4 rounded-2xl border-2 outline-none transition-all text-center font-bold ${
                erro ? 'border-red-500 animate-shake bg-red-50' : 'border-slate-100 focus:border-red-600 bg-slate-50'
              }`}
              value={senhaDigitada}
              onChange={(e) => setSenhaDigitada(e.target.value)}
              autoFocus
            />
            {erro && <p className="text-red-500 text-[10px] font-black text-center mt-2 uppercase">Senha Incorreta!</p>}
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-slate-900 hover:bg-black text-white rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95 shadow-xl"
          >
            Entrar no {setor}
          </button>
        </form>

        <button 
          onClick={() => window.location.href = '/'}
          className="mt-6 text-slate-400 text-[10px] font-bold hover:text-red-600 transition-colors uppercase tracking-widest"
        >
          ← Voltar para o Portal
        </button>
      </div>
    </div>
  )
}