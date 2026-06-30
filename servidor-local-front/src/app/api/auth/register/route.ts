import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // 1. Validação simples
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Todos os campos são obrigatórios." },
        { status: 400 }
      );
    }

    // [AQUI ENTRA SEU BANCO DE DADOS]
    // Exemplo fictício com Prisma:
    // const userExists = await prisma.user.findUnique({ where: { email } });
    // if (userExists) return NextResponse.json({ message: "E-mail já cadastrado." }, { status: 400 });
    // const newUser = await prisma.user.create({ data: { name, email, password: hashPassword(password) } });

    console.log("Dados recebidos no servidor:", { name, email, password });

    // Simulando que o cadastro salvou com sucesso
    return NextResponse.json(
      { message: "Usuário criado com sucesso!", user: { name, email } },
      { status: 201 }
    );

  } catch (error) {
    return NextResponse.json(
      { message: "Erro interno no servidor." },
      { status: 500 }
    );
  }
}