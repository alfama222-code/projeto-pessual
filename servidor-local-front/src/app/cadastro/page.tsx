"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// 1. Definição das regras de validação usando Zod
const cadastroSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z.string().min(1, "O e-mail é obrigatório").email("Introduza um e-mail válido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string().min(1, "A confirmação de senha é obrigatória")
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type CadastroFormValues = z.infer<typeof cadastroSchema>;

export default function CadastroPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  // 2. Validação de Sessão Ativa
  useEffect(() => {
    const token = localStorage.getItem("auth_token"); 
    if (token) {
      router.push("/shop"); 
    }
  }, [router]);

  // 3. Configuração do React Hook Form integrado ao Zod
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CadastroFormValues>({
    resolver: zodResolver(cadastroSchema),
  });

  const onSubmit = async (data: CadastroFormValues) => {
    setIsLoading(true);
    setServerError(null);

    try {
      // 4. Chamada real para o teu endpoint de cadastro do backend
      const response = await fetch("http://localhost:3001/api/auth/registro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: data.name,
          email: data.email,
          senha: data.password, // O backend vai receber e passar pelo Bcrypt
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        // Se for um erro de validação do Zod no backend, ele retorna os "detalhes"
        if (result.detalhes && result.detalhes.length > 0) {
          throw new Error(result.detalhes[0].mensagem);
        }
        throw new Error(result.erro || result.message || "Ocorreu um erro ao efetuar o registo.");
      }

      // Sucesso! Redireciona para o login
      router.push("/login");
    } catch (error: any) {
      console.error("Erro no cadastro:", error.message);
      setServerError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex antialiased selection:bg-amber-600 selection:text-white">

      {/* ===== PAINEL ESQUERDO — Informações da Delicias da Isabel ===== */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative flex-col justify-between p-12 overflow-hidden bg-gradient-to-br from-amber-500 via-amber-600 to-orange-700">
        
        {/* Padrão decorativo de fundo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-[-80px] left-[-80px] w-[400px] h-[400px] rounded-full bg-white" />
          <div className="absolute bottom-[-120px] right-[-60px] w-[500px] h-[500px] rounded-full bg-white" />
          <div className="absolute top-1/2 left-1/3 w-[200px] h-[200px] rounded-full bg-white" />
        </div>

        {/* Conteúdo principal do painel */}
        <div className="relative z-10 flex flex-col h-full justify-between">

          {/* Logo / Marca */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl shadow-lg">
                🍰
              </div>
              <div>
                <p className="text-white/70 text-xs font-medium tracking-widest uppercase">Bem-vindo a</p>
                <h2 className="text-white text-xl font-bold tracking-tight leading-none">Delicias da Isabel</h2>
              </div>
            </div>
          </div>

          {/* Texto central de destaque */}
          <div className="space-y-6 my-auto py-12">
            <h1 className="text-white text-4xl xl:text-5xl font-extrabold leading-tight tracking-tight drop-shadow-sm">
              Sabores que <br />
              <span className="text-amber-100">contam histórias.</span>
            </h1>
            <p className="text-amber-100/90 text-base leading-relaxed max-w-sm">
              Há mais de 10 anos, a Isabel transforma ingredientes simples em momentos inesquecíveis. 
              Uma cozinha feita com amor, dedicação e o segredo que só o tempo ensina.
            </p>

            {/* Cards de destaques */}
            <div className="space-y-3 pt-2">
              {[
                { icon: "🎂", title: "Bolos Artesanais", desc: "Feitos à mão, com receitas exclusivas da família" },
                { icon: "🥐", title: "Doces Regionais", desc: "Tradição portuguesa em cada mordida" },
                { icon: "🚚", title: "Entrega ao Domicílio", desc: "Frescura garantida até à sua porta" },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/20 hover:bg-white/15 transition-colors duration-200"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="text-white font-semibold text-sm">{item.title}</p>
                    <p className="text-amber-100/80 text-xs">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Testemunho / rodapé */}
          <div className="relative z-10">
            <blockquote className="border-l-2 border-white/40 pl-4">
              <p className="text-amber-100/90 text-sm italic leading-relaxed">
                "Cada encomenda é tratada como se fosse para a minha própria família."
              </p>
              <footer className="mt-2 flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-white/30 flex items-center justify-center text-sm">👩‍🍳</div>
                <span className="text-white/80 text-xs font-semibold">Isabel · Fundadora</span>
              </footer>
            </blockquote>
          </div>

        </div>
      </div>

      {/* ===== PAINEL DIREITO — Formulário de Cadastro ===== */}
      <div className="w-full lg:w-1/2 xl:w-[45%] flex items-center justify-center bg-gradient-to-b from-amber-50/40 to-white px-6 py-12 sm:px-10">
        <div className="w-full max-w-[360px] space-y-8">

          {/* Cabeçalho do formulário */}
          <div className="space-y-2">
            {/* Logo visível apenas em mobile */}
            <div className="flex items-center gap-2 mb-4 lg:hidden">
              <span className="text-2xl">🍰</span>
              <span className="text-amber-600 font-bold text-lg">Delicias da Isabel</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-950">Solicitar Registo</h1>
            <p className="text-sm text-gray-400">Insira os seus dados para criar o seu perfil de Chef na plataforma.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-3">

              {/* Input Nome Completo */}
              <div>
                <div className={`relative group border rounded-2xl transition-all duration-300 bg-white ${
                  errors.name ? "border-red-400 focus-within:border-red-500 focus-within:shadow-[0_0_0_1px_rgba(239,68,68,1)]" : "border-gray-200/80 focus-within:border-amber-500 focus-within:shadow-[0_0_0_1px_rgba(245,158,11,1)]"
                }`}>
                  <input
                    type="text"
                    {...register("name")}
                    placeholder=" "
                    disabled={isLoading}
                    className="block w-full px-4 pt-6 pb-2 text-sm text-gray-950 bg-transparent outline-none rounded-2xl peer disabled:opacity-50"
                  />
                  <label className="absolute text-xs text-gray-400 duration-200 transform -translate-y-3.5 scale-90 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-3.5 peer-focus:text-amber-700 pointer-events-none font-medium">
                    Nome Completo
                  </label>
                </div>
                {errors.name && <p className="text-[11px] text-red-500 font-medium mt-1 ml-2">{errors.name.message}</p>}
              </div>

              {/* Input E-mail */}
              <div>
                <div className={`relative group border rounded-2xl transition-all duration-300 bg-white ${
                  errors.email ? "border-red-400 focus-within:border-red-500 focus-within:shadow-[0_0_0_1px_rgba(239,68,68,1)]" : "border-gray-200/80 focus-within:border-amber-500 focus-within:shadow-[0_0_0_1px_rgba(245,158,11,1)]"
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
                <div className={`relative group border rounded-2xl transition-all duration-300 bg-white ${
                  errors.password ? "border-red-400 focus-within:border-red-500 focus-within:shadow-[0_0_0_1px_rgba(239,68,68,1)]" : "border-gray-200/80 focus-within:border-amber-500 focus-within:shadow-[0_0_0_1px_rgba(245,158,11,1)]"
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

              {/* Input Confirmar Senha */}
              <div>
                <div className={`relative group border rounded-2xl transition-all duration-300 bg-white ${
                  errors.confirmPassword ? "border-red-400 focus-within:border-red-500 focus-within:shadow-[0_0_0_1px_rgba(239,68,68,1)]" : "border-gray-200/80 focus-within:border-amber-500 focus-within:shadow-[0_0_0_1px_rgba(245,158,11,1)]"
                }`}>
                  <input
                    type="password"
                    {...register("confirmPassword")}
                    placeholder=" "
                    disabled={isLoading}
                    className="block w-full px-4 pt-6 pb-2 text-sm text-gray-950 bg-transparent outline-none rounded-2xl peer disabled:opacity-50"
                  />
                  <label className="absolute text-xs text-gray-400 duration-200 transform -translate-y-3.5 scale-90 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-3.5 peer-focus:text-amber-700 pointer-events-none font-medium">
                    Confirmar Senha
                  </label>
                </div>
                {errors.confirmPassword && <p className="text-[11px] text-red-500 font-medium mt-1 ml-2">{errors.confirmPassword.message}</p>}
              </div>

            </div>

            {/* Exibição de Erro do Servidor */}
            {serverError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-medium rounded-xl text-center">
                {serverError}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-2xl text-sm font-bold transition-all duration-200 active:scale-[0.98] shadow-md shadow-amber-500/20 mt-4 flex items-center justify-center min-h-[46px]"
            >
              {isLoading ? "A processar..." : "Finalizar Registo de Chef"}
            </button>
          </form>

          {/* Link para retornar ao login */}
          <p className="text-center text-xs text-gray-400 pt-4">
            Já possui uma conta?{" "}
            <Link href="/login" className="font-semibold text-amber-600 hover:text-amber-700 hover:underline underline-offset-4 transition-colors">
              Voltar para o Login
            </Link>
          </p>

        </div>
      </div>

    </div>
  );
}