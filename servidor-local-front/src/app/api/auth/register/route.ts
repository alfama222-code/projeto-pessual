import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // 1. Validação básica de campos vazios
    if (!email || !password || !name) {
      return NextResponse.json(
        { message: "Por favor, preenche todos os campos necessários." },
        { status: 400 }
      );
    }

    // 2. Simulação de validação (Exemplo: bloquear um email que já "existiria")
    if (email === "admin@teste.com") {
      return NextResponse.json(
        { message: "Este email já está registado no sistema." },
        { status: 400 }
      );
    }

    // 3. Resposta de sucesso simulada
    // Como não temos base de dados, fingimos que guardamos e enviamos um OK
    return NextResponse.json(
      {
        message: "Utilizador registado com sucesso!",
        user: { id: "mock-id-999", name, email }
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Erro no registo simulado:", error);
    return NextResponse.json(
      { message: "Ocorreu um erro interno no servidor ao registar." },
      { status: 500 }
    );
  }
}