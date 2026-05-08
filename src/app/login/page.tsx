"use client";

import { useState } from 'react';
import { supabase } from '@/src/lib/supabase';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    setErro('');
    setSucesso('');

    if (isLogin) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });

      if (error) {
        setErro('Email ou senha inválidos. Verifique suas credenciais.');
        setCarregando(false);
        return;
      }

      if (data.session) {
        // Redireciona para o painel principal após o login
        router.push('/estoque/inventario'); 
      }
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: senha,
        options: {
          data: {
            nome: nome,
          }
        }
      });

      if (error) {
        setErro(error.message || 'Erro ao criar conta.');
        setCarregando(false);
        return;
      }

      if (data.user) {
        setSucesso('Conta criada com sucesso! Faça login para continuar.');
        setIsLogin(true); // Retorna para a tela de login
      }
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 font-sans">
      <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-10 flex flex-col items-center border-t-8 border-red-600">
        
        {/* LOGO DO COSTELÃO */}
        <div className="w-24 h-24 relative mb-6 rounded-full overflow-hidden border-4 border-slate-100 shadow-lg">
          {/* Se a imagem não existir, você pode tratar o fallback ou colocar uma cor/texto provisório */}
          <div className="w-full h-full bg-slate-200 flex items-center justify-center font-black text-xs text-slate-500">LOGO</div>
        </div>

        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter text-center">
          {isLogin ? 'Acesso ao Sistema' : 'Criar Nova Conta'}
        </h2>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-8">
          {isLogin ? 'Insira suas credenciais' : 'Cadastre seus dados'}
        </p>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="relative">
            {!isLogin && (
              <input 
                type="text"
                placeholder="Digite o seu nome..."
                className="w-full p-4 mb-2 rounded-2xl border-2 outline-none transition-all font-bold border-slate-100 focus:border-red-600 bg-slate-50"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required={!isLogin}
              />
            )}
            <input 
              type="email"
              placeholder="Digite seu e-mail..."
              className="w-full p-4 mb-2 rounded-2xl border-2 outline-none transition-all font-bold border-slate-100 focus:border-red-600 bg-slate-50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input 
              type="password"
              placeholder="Digite a sua senha..."
              className={`w-full p-4 rounded-2xl border-2 outline-none transition-all font-bold ${
                erro ? 'border-red-500 bg-red-50' : 'border-slate-100 focus:border-red-600 bg-slate-50'
              }`}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
            {erro && <p className="text-red-500 text-[10px] font-black text-center mt-2 uppercase">{erro}</p>}
            {sucesso && <p className="text-green-600 text-[10px] font-black text-center mt-2 uppercase">{sucesso}</p>}
          </div>

          <button 
            type="submit"
            disabled={carregando}
            className="w-full py-4 bg-slate-900 hover:bg-black text-white rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95 shadow-xl disabled:opacity-50"
          >
            {carregando ? 'Aguarde...' : isLogin ? 'Fazer Login' : 'Cadastrar'}
          </button>
        </form>

        <div className="mt-6 flex flex-col items-center gap-4">
          <button 
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setErro('');
              setSucesso('');
            }}
            className="text-slate-600 text-[10px] font-bold hover:text-red-600 transition-colors uppercase tracking-widest"
          >
            {isLogin ? 'Ainda não tem conta? Criar agora' : 'Já tem conta? Fazer login'}
          </button>

          <button 
            onClick={() => router.push('/')}
            className="text-slate-400 text-[10px] font-bold hover:text-red-600 transition-colors uppercase tracking-widest"
          >
            ← Voltar para o Portal
          </button>
        </div>
      </div>
    </div>
  );
}