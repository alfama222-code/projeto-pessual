"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, LogOut, Trash2 } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const [menuPerfilAberto, setMenuPerfilAberto] = useState(false);
  const [dadosUsuario, setDadosUsuario] = useState({
    nome: "Cliente Delícias",
    criadoEm: "01/03/2026", // Data mockada padrão caso não exista no localStorage
  });

  // Carrega as informações do usuário vindas do localStorage ao montar o componente
  useEffect(() => {
    const nomeSalvo = localStorage.getItem("delicias_isabel_user_name");
    const dataCriacaoSalva = localStorage.getItem("delicias_isabel_user_created");
    
    if (nomeSalvo || dataCriacaoSalva) {
      setDadosUsuario({
        nome: nomeSalvo || "Cliente Delícias",
        criadoEm: dataCriacaoSalva || "Recente",
      });
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

  return (
    <nav className="w-full bg-white border-b border-amber-100 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* LOGO */}
        <div 
          onClick={() => router.push("/shop")} 
          className="flex items-center gap-2 cursor-pointer font-black text-amber-800 uppercase tracking-wider text-sm"
        >
          <div className="h-3 w-3 bg-amber-500 rounded-full animate-pulse" />
          Delícias da Isabel
        </div>

        {/* MENUS DIREITA */}
        <div className="flex items-center gap-4 relative">
          <button 
            onClick={() => router.push("/sobre")}
            className="text-xs font-black tracking-widest uppercase text-gray-600 hover:text-amber-600 transition-colors mr-2"
          >
            Sobre Nós
          </button>

          {/* BOTÃO DO PERFIL */}
          <button
            onClick={() => setMenuPerfilAberto(!menuPerfilAberto)}
            className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-900 px-3 py-2 rounded-xl text-xs font-bold hover:bg-amber-100 transition-all active:scale-95"
          >
            <User size={16} />
            <span>Olá, {dadosUsuario.nome.split(" ")[0]}</span>
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