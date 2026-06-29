"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// 1. Definição das regras de validação para o Registo usando Zod
const registerSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  email: z.string().min(1, "O e-mail é obrigatório").email("Introduza um e-mail válido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string().min(1, "A confirmação da senha é obrigatória"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // 2. Proteção: Se JÁ tiver sessão ativa, pula o registo e vai para a home
  useEffect(() => {
    const token = localStorage.getItem("auth_token"); 
    if (token) {
      router.push("/page"); 
    }
  }, [router]);

  // 3. Configuração do React Hook Form integrado ao Zod
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormValues) => {
    setIsLoading(true);
    console.log("Conta validada com sucesso:", data);
    
    // Simulação do envio dos dados para a API / Base de Dados
    setTimeout(() => {
      setIsLoading(false);
      
      // Redireciona diretamente para a página de Login para efetuar o acesso
      router.push("/login"); 
    }, 1200);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 antialiased selection:bg-gray-900 selection:text-white px-4 sm:px-6 py-12">
      
      {/* CARD CENTRALIZADO */}
      <div className="w-full max-w-[380px] bg-white border border-gray-200/60 p-8 rounded-3xl shadow-sm space-y-8">
        
        {/* Cabeçalho */}
        <div className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-8 w-8 rounded-xl bg-gray-950 flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
            </div>
          </div>
          <h1 className="text-2xl font-medium tracking-tight text-gray-950">Solicitar registo</h1>
          <p className="text-sm text-gray-400">Preencha os campos para criar o seu perfil de Chef.</p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-3">
            
            {/* Input Nome */}
            <div>
              <div className={`relative group border rounded-2xl transition-all duration-300 bg-white ${
                errors.name ? "border-red-400 focus-within:border-red-500" : "border-gray-200/80 focus-within:border-gray-950"
              }`}>
                <input
                  type="text"
                  {...register("name")}
                  placeholder=" "
                  disabled={isLoading}
                  className="block w-full px-4 pt-6 pb-2 text-sm text-gray-950 bg-transparent outline-none rounded-2xl peer disabled:opacity-50"
                />
                <label className="absolute text-xs text-gray-400 duration-200 transform -translate-y-3.5 scale-90 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-3.5 peer-focus:text-gray-950 pointer-events-none font-medium">
                  Nome completo
                </label>
              </div>
              {errors.name && <p className="text-[11px] text-red-500 font-medium mt-1 ml-2">{errors.name.message}</p>}
            </div>

            {/* Input E-mail */}
            <div>
              <div className={`relative group border rounded-2xl transition-all duration-300 bg-white ${
                errors.email ? "border-red-400 focus-within:border-red-500" : "border-gray-200/80 focus-within:border-gray-950"
              }`}>
                <input
                  type="text"
                  {...register("email")}
                  placeholder=" "
                  disabled={isLoading}
                  className="block w-full px-4 pt-6 pb-2 text-sm text-gray-950 bg-transparent outline-none rounded-2xl peer disabled:opacity-50"
                />
                <label className="absolute text-xs text-gray-400 duration-200 transform -translate-y-3.5 scale-90 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-3.5 peer-focus:text-gray-950 pointer-events-none font-medium">
                  Endereço de e-mail
                </label>
              </div>
              {errors.email && <p className="text-[11px] text-red-500 font-medium mt-1 ml-2">{errors.email.message}</p>}
            </div>

            {/* Input Senha */}
            <div>
              <div className={`relative group border rounded-2xl transition-all duration-300 bg-white ${
                errors.password ? "border-red-400 focus-within:border-red-500" : "border-gray-200/80 focus-within:border-gray-950"
              }`}>
                <input
                  type="password"
                  {...register("password")}
                  placeholder=" "
                  disabled={isLoading}
                  className="block w-full px-4 pt-6 pb-2 text-sm text-gray-950 bg-transparent outline-none rounded-2xl peer disabled:opacity-50"
                />
                <label className="absolute text-xs text-gray-400 duration-200 transform -translate-y-3.5 scale-90 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-3.5 peer-focus:text-gray-950 pointer-events-none font-medium">
                  Senha
                </label>
              </div>
              {errors.password && <p className="text-[11px] text-red-500 font-medium mt-1 ml-2">{errors.password.message}</p>}
            </div>

            {/* Input Confirmar Senha */}
            <div>
              <div className={`relative group border rounded-2xl transition-all duration-300 bg-white ${
                errors.confirmPassword ? "border-red-400 focus-within:border-red-500" : "border-gray-200/80 focus-within:border-gray-950"
              }`}>
                <input
                  type="password"
                  {...register("confirmPassword")}
                  placeholder=" "
                  disabled={isLoading}
                  className="block w-full px-4 pt-6 pb-2 text-sm text-gray-950 bg-transparent outline-none rounded-2xl peer disabled:opacity-50"
                />
                <label className="absolute text-xs text-gray-400 duration-200 transform -translate-y-3.5 scale-90 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-3.5 peer-focus:text-gray-950 pointer-events-none font-medium">
                  Confirmar Senha
                </label>
              </div>
              {errors.confirmPassword && <p className="text-[11px] text-red-500 font-medium mt-1 ml-2">{errors.confirmPassword.message}</p>}
            </div>

          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gray-950 hover:bg-gray-900 text-white py-3 rounded-2xl text-sm font-medium transition-all duration-200 active:scale-[0.98] shadow-sm mt-4 flex items-center justify-center min-h-[46px]"
          >
            {isLoading ? "A criar conta..." : "Criar Conta e Ir para Login"}
          </button>
        </form>

        {/* Link para voltar ao Login manualmente */}
        <p className="text-center text-xs text-gray-400 pt-2">
          Já tem uma conta?{" "}
          <Link href="/login" className="font-semibold text-gray-950 hover:underline underline-offset-4">
            Iniciar sessão
          </Link>
        </p>

      </div>
    </div>
  );
}