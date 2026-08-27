import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // 1. Validação básica de campos vazios
    if (!email || !password) {
      return NextResponse.json(
        { message: "Por favor, preenche todos os campos." },
        { status: 400 }
      );
    }

    // 2. UTILIZADOR FICTÍCIO PARA TESTES
    // Podes usar estes dados para fazer o login no teu ecrã!
    const MOCK_EMAIL = "[EMAIL_ADDRESS]";
    const MOCK_PASSWORD = "[PASSWORD]";

    // 3. Validar se as credenciais coincidem com o utilizador fictício
    if (email === MOCK_EMAIL && password === MOCK_PASSWORD) {
      return NextResponse.json(
        { 
          message: "Login efetuado com sucesso!",
          token: "token_ficticio_de_teste_12345",
          user: { id: "1", name: "Utilizador Teste", email: MOCK_EMAIL }
        },
        { status: 200 }
      );
    }

    // 4. Se os dados estiverem errados, devolve erro 401
    return NextResponse.json(
      { message: "Credenciais inválidas. Usa admin@teste.com e password123." },
      { status: 401 }
    );

  } catch (error: any) {
    console.error("Erro no login simulado:", error);
    return NextResponse.json(
      { message: "Ocorreu um erro interno no servidor." },
      { status: 500 }
    );
  }
}