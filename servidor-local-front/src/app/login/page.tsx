"use client";

import Link from "next/link";
import Image from "next/image"; // Importado para renderizar a foto
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Importado para fazer o redirecionamento
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// 1. Definição das regras de validação usando Zod
const loginSchema = z.object({
  email: z.string().min(1, "O e-mail é obrigatório").email("Introduza um e-mail válido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // 2. Validação de Sessão Ativa (Se logado, vai direto para a /dashboard ou /page)
  useEffect(() => {
    // Substitui 'seu_token_ou_sessao' pela chave real que usas no localStorage ou Cookies
    const token = localStorage.getItem("auth_token");

    if (token) {
      // Se já tiver conta logada, redireciona imediatamente
      router.push("/shop"); // Altera para a rota correta da tua app (ex: "/dashboard" ou "/")
    }
  }, [router]);

  // 3. Configuração do React Hook Form integrado ao Zod
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  // Adiciona um estado para gerir mensagens de erro vindas do servidor
  const [serverError, setServerError] = useState<string | null>(null);

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setServerError(null);

    try {
      const response = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          senha: data.password
        }),
      });

      const contentType = response.headers.get("content-type");
      let result = null;

      // 1. Ler o texto puro primeiro para garantir que não está vazio
      const responseText = await response.text();

      // 2. Se houver texto e for JSON, fazemos o parse manualmente
      if (responseText && contentType && contentType.includes("application/json")) {
        result = JSON.parse(responseText);
      }

      // 3. Se a resposta não for OK, trata o erro
      if (!response.ok) {
        if (result?.detalhes && result.detalhes.length > 0) {
          throw new Error(result.detalhes[0].mensagem);
        }
        throw new Error(result?.erro || result?.message || "Credenciais inválidas ou erro no servidor.");
      }

      // 4. Se correu bem mas o teu backend não devolveu um token (veio vazio)
      if (!result || !result.token) {
        throw new Error("O servidor não retornou um token de autenticação válido.");
      }

      // 5. Sucesso absoluto: Salvar token e dados do usuário
      localStorage.setItem("auth_token", result.token);
      if (result.usuario) {
        localStorage.setItem("user_data", JSON.stringify(result.usuario));
      }
      router.push("/shop");

    } catch (error: any) {
      console.error("Erro no login:", error.message);
      setServerError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-gradient-to-b from-amber-50/50 to-white antialiased selection:bg-amber-600 selection:text-white">

      {/* PAINEL ESQUERDO (Com a imagem da Chef Isabel) */}
      <div className="hidden lg:flex lg:w-[45%] bg-white border-r border-gray-200/60 p-12 flex-col justify-between relative overflow-hidden">
        {/* Imagem de Fundo Otimizada */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/WhatsApp Image 2026-05-27 at 09.03.38.jpeg" // Certifica-te de colocar a foto dentro da pasta public/ com este nome
            alt="Delícias da Isabel"
            fill
            className="object-cover object-center brightness-[0.9]"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 45vw"
          />
        </div>

        {/* Gradiente para garantir leitura do texto sobre a imagem */}
        <div className="absolute inset-0 bg-gradient-to-t from-amber-950/80 via-black/20 to-black/40 z-10" />

        <div className="flex items-center gap-2 relative z-20">
          <div className="h-6 w-6 rounded-lg bg-amber-500 flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-white">Plataforma Delícias</span>
        </div>

        <div className="space-y-3 relative z-20 max-w-sm text-white">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/20 backdrop-blur-md border border-amber-400/30 text-[11px] font-medium text-amber-100">
            Autêntica e Aconchegante
          </div>
          <h2 className="text-4xl font-bold tracking-tight leading-tight">
            Delícias da Isabel
          </h2>
          <p className="text-gray-200 text-sm">
            Culinária Autêntica e Aconchegante. Gerencie o seu restaurante num só lugar.
          </p>
        </div>

        <p className="text-xs text-gray-300 relative z-20">&copy; 2026 Delícias da Isabel Lda. Todos os direitos reservados.</p>
      </div>

      {/* PAINEL DIREITO (Formulário) */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12 relative">
        <div className="w-full max-w-[360px] space-y-8">

          <div className="space-y-2">
            <h1 className="text-2xl font-medium tracking-tight text-gray-950">Aceder à Plataforma</h1>
            <p className="text-sm text-gray-400">Introduza as suas credenciais para gerir o seu restaurante.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-3">

              {/* Input E-mail */}
              <div>
                <div className={`relative group border rounded-2xl transition-all duration-300 bg-white ${errors.email ? "border-red-400 focus-within:border-red-500 focus-within:shadow-[0_0_0_1px_rgba(239,68,68,1)]" : "border-gray-200/80 focus-within:border-amber-500 focus-within:shadow-[0_0_0_1px_rgba(245,158,11,1)]"
                  }`}>
                  <input
                    type="text"
                    {...register("email")}
                    placeholder=" "
                    disabled={isLoading}
                    className="block w-full px-4 pt-6 pb-2 text-sm text-gray-950 bg-transparent outline-none rounded-2xl peer disabled:opacity-50"
                  />
                  <label className="absolute text-xs text-gray-400 duration-200 transform -translate-y-3.5 scale-90 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-3.5 peer-focus:text-amber-700 pointer-events-none font-medium">
                    Endereço de e-mail
                  </label>
                </div>
                {errors.email && <p className="text-[11px] text-red-500 font-medium mt-1 ml-2">{errors.email.message}</p>}
              </div>

              {/* Input Senha */}
              <div>
                <div className={`relative group border rounded-2xl transition-all duration-300 bg-white ${errors.password ? "border-red-400 focus-within:border-red-500 focus-within:shadow-[0_0_0_1px_rgba(239,68,68,1)]" : "border-gray-200/80 focus-within:border-amber-500 focus-within:shadow-[0_0_0_1px_rgba(245,158,11,1)]"
                  }`}>
                  <input
                    type="password"
                    {...register("password")}
                    placeholder=" "
                    disabled={isLoading}
                    className="block w-full px-4 pt-6 pb-2 text-sm text-gray-950 bg-transparent outline-none rounded-2xl peer disabled:opacity-50"
                  />
                  <label className="absolute text-xs text-gray-400 duration-200 transform -translate-y-3.5 scale-90 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-3.5 peer-focus:text-amber-700 pointer-events-none font-medium">
                    Senha
                  </label>
                </div>
                {errors.password && <p className="text-[11px] text-red-500 font-medium mt-1 ml-2">{errors.password.message}</p>}
              </div>

            </div>

            <div className="flex items-center justify-end pt-1">
              <a href="#" className="text-xs font-medium text-gray-400 hover:text-amber-600 transition-colors">
                Esqueceu a senha?
              </a>
            </div>

            {serverError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-medium rounded-xl text-center">
                {serverError}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-2xl text-sm font-bold transition-all duration-200 active:scale-[0.98] shadow-md shadow-amber-500/20 mt-2 flex items-center justify-center min-h-[46px]"
            >
              {isLoading ? "A processar..." : "Entrar no Painel de Controlo"}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 pt-4">
            Não tem uma conta?{" "}
            <Link href="/cadastro" className="font-semibold text-amber-600 hover:text-amber-700 hover:underline underline-offset-4 transition-colors">
              Solicitar registo de Chef
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}
