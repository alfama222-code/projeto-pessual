"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { User, LogOut, Trash2, UtensilsCrossed } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const [menuPerfilAberto, setMenuPerfilAberto] = useState(false);
  const [dadosUsuario, setDadosUsuario] = useState({
    nome: "Cliente Delícias",
    criadoEm: "01/03/2026", // Data mockada padrão caso não exista no localStorage
  });

  const [isAdmin, setIsAdmin] = useState(false);

  // Carrega as informações do usuário vindas do localStorage ao montar o componente
  useEffect(() => {
    const nomeSalvo = localStorage.getItem("delicias_isabel_user_name");
    const dataCriacaoSalva = localStorage.getItem("delicias_isabel_user_created");
    const tokenAdmin = localStorage.getItem("auth_token");
    
    if (nomeSalvo || dataCriacaoSalva) {
      setDadosUsuario({
        nome: nomeSalvo || "Cliente Delícias",
        criadoEm: dataCriacaoSalva || "Recente",
      });
    }

    if (tokenAdmin) {
      setIsAdmin(true);
    }
  }, []);

  // Função para fazer logout normal
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    router.replace("/login");
  };

  // Função para deletar a conta permanentemente
  const handleEliminarConta = () => {
    const confirmar = window.confirm(
      "Tens a certeza que desejas eliminar a tua conta? Esta ação é irreversível e apagará todo o teu histórico."
    );

    if (confirmar) {
      // 1. Limpa os dados de sessão do navegador
      localStorage.clear();
      sessionStorage.clear();
      
      // Nota: Se tiveres uma API real para apagar a conta na base de dados, 
      // farias o fetch aqui: await fetch('/api/user/delete', { method: 'DELETE' })

      alert("A tua conta foi removida com sucesso.");
      
      // 2. Redireciona imediatamente para o login
      router.replace("/login");
    }
  };

  // Ref para detetar cliques fora do dropdown
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickFora = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMenuPerfilAberto(false);
      }
    };
    if (menuPerfilAberto) {
      document.addEventListener("mousedown", handleClickFora);
    }
    return () => document.removeEventListener("mousedown", handleClickFora);
  }, [menuPerfilAberto]);

  return (
    <nav className="w-full bg-white border-b border-amber-100 sticky top-0 z-40 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">

        {/* LOGO */}
        <div
          className="flex items-center gap-2 cursor-pointer group shrink-0"
          onClick={() => router.push("/shop")}
        >
          <div className="bg-amber-500 text-white p-2 rounded-xl shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <UtensilsCrossed size={18} />
          </div>
          <span className="text-base sm:text-xl font-extrabold tracking-tight bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent leading-tight">
            Delícias da Isabel
          </span>
        </div>

        {/* MENUS DIREITA */}
        <div className="flex items-center gap-2 sm:gap-4 relative" ref={dropdownRef}>

          {/* Botão Sobre Nós — oculto em mobile muito pequeno */}
          <button
            onClick={() => router.push("/sobre")}
            className="hidden xs:block sm:block text-[11px] font-black tracking-widest uppercase text-gray-600 hover:text-amber-600 transition-colors whitespace-nowrap"
          >
            Sobre Nós
          </button>

          {/* Botão Admin — visível apenas se for admin */}
          {isAdmin && (
            <button
              onClick={() => router.push("/admin")}
              className="hidden xs:block sm:block text-[11px] font-black tracking-widest uppercase text-amber-600 hover:text-amber-800 transition-colors whitespace-nowrap bg-amber-100 px-3 py-1.5 rounded-lg"
            >
              Painel Admin
            </button>
          )}

          {/* BOTÃO DO PERFIL */}
          <button
            onClick={() => setMenuPerfilAberto(!menuPerfilAberto)}
            className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-900 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-bold hover:bg-amber-100 transition-all active:scale-95 max-w-[140px] sm:max-w-none"
          >
            <User size={15} className="shrink-0" />
            <span className="truncate hidden sm:block">Olá, {dadosUsuario.nome.split(" ")[0]}</span>
            <span className="truncate sm:hidden">Perfil</span>
          </button>

          {/* DROPDOWN DO PERFIL */}
          {menuPerfilAberto && (
            <div className="absolute right-0 top-12 w-64 bg-white border border-amber-100 rounded-2xl p-4 shadow-xl animate-fade-in z-50">

              {/* INFO DO USUÁRIO */}
              <div className="border-b border-gray-100 pb-3 mb-3">
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Utilizador</p>
                <p className="text-xs font-black text-gray-800 uppercase tracking-wide truncate">
                  {dadosUsuario.nome}
                </p>
                <p className="text-[9px] text-gray-400 mt-1">
                  Membro desde: <span className="font-semibold text-gray-600">{dadosUsuario.criadoEm}</span>
                </p>
              </div>

              {/* Link Sobre Nós visível apenas em mobile pequeno */}
              <div className="sm:hidden mb-2 pb-2 border-b border-gray-100">
                <button
                  onClick={() => { router.push("/sobre"); setMenuPerfilAberto(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs font-bold text-amber-700 hover:bg-amber-50 transition-colors"
                >
                  Sobre Nós
                </button>
              </div>

              {/* Link Admin visível no dropdown */}
              {isAdmin && (
                <div className="mb-2 pb-2 border-b border-gray-100">
                  <button
                    onClick={() => { router.push("/admin"); setMenuPerfilAberto(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs font-bold text-amber-700 hover:bg-amber-50 transition-colors bg-amber-50/50"
                  >
                    Painel Administrador
                  </button>
                </div>
              )}

              {/* BOTÕES DE ACÇÃO */}
              <div className="flex flex-col gap-1">

                {/* LOGOUT */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <LogOut size={14} className="text-gray-400" />
                  Sair da Conta
                </button>

                {/* ELIMINAR CONTA */}
                <button
                  onClick={handleEliminarConta}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs font-bold text-red-600 hover:bg-red-50 transition-colors mt-1 border border-transparent hover:border-red-100"
                >
                  <Trash2 size={14} className="text-red-500" />
                  Eliminar Conta
                </button>

              </div>

              {/* BOTÃO PARA FECHAR */}
              <button
                onClick={() => setMenuPerfilAberto(false)}
                className="w-full text-center text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-amber-600 pt-3 mt-2 border-t border-gray-50 block transition-colors"
              >
                Fechar Painel
              </button>

            </div>
          )}

        </div>
      </div>
    </nav>
  );
}