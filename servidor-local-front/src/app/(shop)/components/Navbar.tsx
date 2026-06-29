"use client";

import Link from "next/link";
import { ShoppingBag, Menu, UtensilsCrossed, Phone } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100/80 bg-white/75 backdrop-blur-md transition-all">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Lado Esquerdo: Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-amber-500 text-white p-2 rounded-xl shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <UtensilsCrossed size={20} />
          </div>
          <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
            Delícias da Isabel
          </span>
        </Link>

        {/* Centro: Links de Navegação (Escondidos no Mobile) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
          <a href="#cardapio" className="hover:text-amber-600 transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-amber-500 hover:after:w-full after:transition-all">
            Cardápio
          </a>
          <a href="#sobre" className="hover:text-amber-600 transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-amber-500 hover:after:w-full after:transition-all">
            Sobre Nós
          </a>
          <a href="#contato" className="hover:text-amber-600 transition-colors flex items-center gap-1">
            <Phone size={14} /> Contato
          </a>
        </nav>

        {/* Lado Direito: Ações */}
        <div className="flex items-center gap-3">
          {/* Botão do Carrinho Moderno */}
          <button className="relative flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95">
            <ShoppingBag size={18} className="text-amber-400" />
            <span className="hidden sm:inline">Carrinho</span>
            <span className="bg-amber-500 text-gray-950 text-xs px-2 py-0.5 rounded-md font-extrabold">
              0
            </span>
          </button>

          {/* Menu Mobile (Hambúrguer) */}
          <button className="md:hidden p-2 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
            <Menu size={24} />
          </button>
        </div>

      </div>
    </header>
  );
}