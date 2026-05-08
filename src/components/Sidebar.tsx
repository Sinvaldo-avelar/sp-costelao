'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
  const pathname = usePathname()

  const menus = [
    { name: 'Dashboard', path: '/estoque', icon: '📊' },
    { name: 'Novo Produto', path: '/estoque/cadastro', icon: '📝' },
    { name: 'Entrada de Lote', path: '/estoque/entrada', icon: '📥' },
    { name: 'Saída de Lote', path: '/estoque/saida', icon: '📤' },
    { name: 'Inventário', path: '/estoque/inventario', icon: '🔍' },
    { name: 'Relatórios', path: '/estoque/relatorios', icon: '📜' },
  ]

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen sticky top-0 shadow-2xl print:hidden">
      
      {/* Cabeçalho com o Logo do Costelão */}
      <div className="p-6 border-b border-slate-800 flex flex-col items-center gap-3 bg-black/20">
        <div className="w-24 h-24 relative overflow-hidden rounded-full border-4 border-slate-700 shadow-xl">
           <Image 
            src="/costelão.jpeg" // Certifique-se de que o nome do arquivo na pasta public seja exatamente este
            alt="Logo Costelão"
            fill
            priority
            loading="eager"
            sizes="96px"
            className="object-cover"
          />
        </div>
        <div className="text-center mt-2">
          <h2 className="text-white font-black text-xl tracking-tighter uppercase leading-none">Costelão</h2>
          <p className="text-[9px] text-red-500 font-black tracking-[0.2em] uppercase italic">Supermercado</p>
        </div>
      </div>

      {/* Menu de Navegação */}
      <nav className="flex-1 p-4 space-y-2 mt-4">
        {menus.map((item) => {
          const isActive = pathname === item.path
          
          return (
            <Link 
              key={item.path} 
              href={item.path}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all font-bold text-sm group ${
                isActive 
                  ? 'bg-red-600 text-white shadow-lg shadow-red-900/50 scale-105' 
                  : 'hover:bg-slate-800 hover:text-white hover:pl-5'
              }`}
            >
              <span className={`text-xl transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                {item.icon}
              </span>
              <span className="tracking-tight uppercase text-[11px]">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Rodapé: Troca de Setor e Sair */}
      <div className="p-4 border-t border-slate-800 space-y-2 bg-black/40">
        <Link 
          href="/compras" 
          className="flex items-center gap-3 p-3 rounded-xl text-xs font-black text-emerald-400 hover:bg-emerald-900/30 transition-all border border-transparent hover:border-emerald-900"
        >
          <span>🛒</span> COMPRAS
        </Link>
        
        <button 
          onClick={async () => {
            const { supabase } = await import('@/src/lib/supabase')
            await supabase.auth.signOut()
            window.location.href = '/'
          }}
          className="w-full flex items-center gap-3 p-3 rounded-xl text-xs font-black text-slate-500 hover:bg-red-900/30 hover:text-red-400 transition-all"
        >
          <span>⬅</span> SAIR DO SISTEMA
        </button>
      </div>
    </aside>
  )
}