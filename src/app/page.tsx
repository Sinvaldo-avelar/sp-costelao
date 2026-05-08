import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Detalhe de fundo para dar um ar moderno */}
      <div className="absolute top-0 left-0 w-full h-2 bg-red-600"></div>

      <header className="text-center mb-12 flex flex-col items-center">
        {/* LOGO CENTRALIZADO */}
        <div className="w-32 h-32 relative mb-6 shadow-2xl rounded-full border-4 border-white">
          <Image 
            src="/costelão.jpeg" 
            alt="Logo Costelão" 
            fill 
            className="object-cover rounded-full"
          />
        </div>
        
        <h1 className="text-5xl font-black text-slate-900 uppercase tracking-tighter mb-2">
          Portal Administrativo
        </h1>
        <p className="text-red-600 font-black uppercase tracking-[0.3em] text-xs">
          Supermercado Costelão
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl relative z-10">
        
        {/* CARD ESTOQUE -> Redirecionado para LOGIN */}
        <Link href="/login" className="group col-span-1 md:col-span-2 max-w-lg mx-auto w-full">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border-2 border-transparent group-hover:border-red-600 transition-all h-72 flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 text-8xl group-hover:scale-110 transition-transform">🔒</div>
            <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform">🔑</div>
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Fazer Login</h2>
            <p className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-widest">Acessar o Sistema do Costelão</p>
            
            <div className="mt-6 px-6 py-2 bg-red-600 text-white text-[10px] font-black rounded-full opacity-0 group-hover:opacity-100 transition-all">
              ENTRAR NO SISTEMA
            </div>
          </div>
        </Link>

      </div>

      <footer className="mt-20 flex flex-col items-center gap-2">
        <div className="h-1 w-12 bg-slate-300 rounded-full"></div>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.5em]">
          Costelão v2.0 | Inteligência em Logística
        </p>
      </footer>

      {/* Marca d'água de fundo leve */}
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-red-50 rounded-full -z-0 opacity-50"></div>
    </div>
  );
}