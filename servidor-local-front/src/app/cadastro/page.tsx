"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// 1. Definição das regras de validação usando Zod (Igual ao padrão do login + novos campos)
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
  const router = useRouter();

  // 2. Validação de Sessão Ativa (Se logado, vai direto para o /shop)
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

  const onSubmit = (data: CadastroFormValues) => {
    setIsLoading(true);
    console.log("Dados do Chef validados e prontos para envio:", data);
    
    // Simulação de cadastro e redirecionamento para o Login
    setTimeout(() => {
      setIsLoading(false);
      alert("Solicitação de registo enviada com sucesso!");
      router.push("/login"); 
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-amber-50/50 to-white antialiased selection:bg-amber-600 selection:text-white px-4 sm:px-6 py-12">
      
      {/* CARD DO FORMULÁRIO CENTRALIZADO */}
      <div className="w-full max-w-[360px] space-y-8">
        
        {/* Cabeçalho identico ao Login */}
        <div className="space-y-2">
          <h1 className="text-2xl font-medium tracking-tight text-gray-950">Solicitar Registo</h1>
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
  );
}