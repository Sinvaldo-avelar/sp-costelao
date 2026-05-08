'use client'
import Sidebar from '@/src/components/Sidebar';

export default function EstoqueLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar com o logo do Costelão */}
      <Sidebar />
      
      {/* Conteúdo das páginas */}
      <main className="flex-1 p-8 overflow-y-auto print:p-0">
        {children}
      </main>
    </div>
  );
}