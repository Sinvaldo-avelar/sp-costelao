import { NextRequest, NextResponse } from 'next/server';

// Exemplo de middleware para proteção de rotas e RBAC
// Adapte conforme a lógica de autenticação real do seu sistema

const PUBLIC_PATHS = ['/login', '/public'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Permite acesso a rotas públicas
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Exemplo: busca token do Supabase (ajuste conforme necessário)
  const token = request.cookies.get('sb-access-token')?.value;
  const role = request.cookies.get('user-role')?.value;

  // Se não autenticado, redireciona para login
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Exemplo de RBAC: só permite admin acessar /estoque/relatorios
  if (pathname.startsWith('/estoque/relatorios') && role !== 'admin') {
    return NextResponse.redirect(new URL('/estoque', request.url));
  }

  // Permite acesso
  return NextResponse.next();
}

export const config = {
  matcher: ['/estoque/:path*', '/compras/:path*'],
};
