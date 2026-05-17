"use client";
import PainelCompras from '../../components/PainelCompras';
import AlertaEstoqueCritico from '../../components/AlertaEstoqueCritico';
import LoginSetor from '../../components/LoginSetor';
import Link from 'next/link';

export default function ComprasPage() {
  return (
    <LoginSetor setor="COMPRAS">
      <div className="p-6 bg-slate-50 min-h-screen">
        
        <nav className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-2xl font-black text-emerald-900 uppercase">Setor de Compras</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Gestão de Suprimentos</p>
          </div>
          
          <Link href="/" className="bg-red-500 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-red-600 transition-all shadow-md">
            ⬅ SAIR DO SETOR
          </Link>
        </nav>

        <AlertaEstoqueCritico />

        {/* O PainelCompras agora faz tudo: Cards, Busca e Lista */}
        <div className="mt-8">
           <PainelCompras />
        </div>
        
      </div>
    </LoginSetor>
  )
}