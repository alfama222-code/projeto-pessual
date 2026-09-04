import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Se você está usando localStorage no cliente, o Middleware (que roda no servidor) 
  // não consegue ler o localStorage direto. 
  // Para evitar que o middleware bloqueie o cliente, vamos deixar o /shop passar pelo middleware 
  // e deixar que o useEffect dentro da própria página /shop controle o acesso.
  
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/'], // Deixe rodar apenas na raiz para não travar o /shop
}