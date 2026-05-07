'use client'
import Sidebar from '@/src/components/Sidebar';
import LoginSetor from '@/src/components/LoginSetor';

export default function EstoqueLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <LoginSetor setor="ESTOQUE">
      <div className="flex min-h-screen bg-slate-50">
        {/* Sidebar com o logo do Costelão */}
        <Sidebar />
        
        {/* Conteúdo das páginas */}
        <main className="flex-1 p-8 overflow-y-auto print:p-0">
          {children}
        </main>
      </div>
    </LoginSetor>
  );
}