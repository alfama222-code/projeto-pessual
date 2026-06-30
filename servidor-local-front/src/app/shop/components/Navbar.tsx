"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, ShoppingBag, LogOut } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const [menuPerfilAberto, setMenuPerfilAberto] = useState(false);
  const [totalGasto, setTotalGasto] = useState<number>(0);

  // Carrega o histórico de compras do localStorage ao montar o componente
  useEffect(() => {
    const historico = localStorage.getItem("delicias_isabel_total_gasto");
    if (historico) {
      setTotalGasto(parseFloat(historico));
    }
  }, [menuPerfilAberto]); // Atualiza sempre que o menu do perfil for aberto

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

        {/* MENUS DA ESQUERDA / DIREITA */}
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
            <span>Ver Perfil</span>
          </button>

          {/* DROPDOWN DO PERFIL COM O HISTÓRICO DE COMPRAS */}
          {menuPerfilAberto && (
            <div className="absolute right-0 top-12 w-64 bg-white border border-amber-100 rounded-2xl p-4 shadow-xl animate-fade-in z-50">
              <div className="border-b border-gray-100 pb-3 mb-3">
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Utilizador</p>
                <p className="text-xs font-black text-gray-800 uppercase tracking-wide">Cliente Delícias</p>
              </div>

              {/* VALOR ACUMULADO DE COMPRAS */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-100 rounded-xl p-3 mb-3 flex items-center gap-3">
                <div className="bg-amber-500 text-white p-2 rounded-lg shrink-0 shadow-sm shadow-amber-500/20">
                  <ShoppingBag size={16} />
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-amber-800/80 font-black block">Total em Compras</span>
                  <span className="text-sm font-black text-amber-900">{totalGasto.toFixed(2)} CVE</span>
                </div>
              </div>

              {/* BOTÃO PARA FECHAR */}
              <button
                onClick={() => setMenuPerfilAberto(false)}
                className="w-full text-center text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-amber-600 pt-1 block transition-colors"
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