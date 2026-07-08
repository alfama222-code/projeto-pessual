"use client";

import { useRouter } from "next/navigation";
import { UtensilsCrossed, Phone, CreditCard, Info } from "lucide-react";

export default function SobrePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-white text-gray-950 antialiased font-sans">
      
      {/* HEADER / BARRA DE NAVEGAÇÃO SUPERIOR */}
      <header className="sticky top-0 z-50 w-full border-b border-amber-100 bg-white/80 backdrop-blur-md transition-all">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => router.push("/shop")}>
            <div className="bg-amber-500 text-white p-2 rounded-xl shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <UtensilsCrossed size={20} />
            </div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
              Delícias da Isabel
            </span>
          </div>
          
          <button 
            onClick={() => router.push("/shop")}
            className="text-xs font-black tracking-widest uppercase text-gray-600 hover:text-amber-600 transition-colors"
          >
            ← Voltar à Loja
          </button>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        
        {/* Título de Impacto */}
        <div className="space-y-4 mb-16 text-center sm:text-left">
          <span className="text-[11px] font-bold tracking-widest uppercase bg-amber-500 text-white px-3 py-1.5 rounded-lg shadow-sm shadow-amber-500/20">
            A Nossa História
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mt-4 bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
            A Arte da Confeitaria Artesanal.
          </h1>
        </div>

        {/* Bloco de Texto Conceitual */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-gray-700 leading-relaxed text-sm border-t border-amber-200/60 pt-12">
          <div className="space-y-6">
            <p>
              O projeto <strong className="text-amber-700 font-bold">Delícias da Isabel</strong> nasceu da paixão por transformar ingredientes simples em experiências gastronómicas memoráveis. Cada doce e cada salgado que sai da nossa cozinha carrega uma herança de rigor, dedicação e técnica.
            </p>
            <p>
              Acreditamos que a comida não alimenta apenas o corpo, mas celebra momentos. Por isso, a nossa produção é estritamente artesanal, feita sob encomenda para garantir o máximo de frescura, textura e sabor.
            </p>
          </div>
          
          <div className="space-y-6">
            <p>
              Sob a liderança criativa da Chef Isabel, a marca destaca-se pelo equilíbrio perfeito entre receitas tradicionais e uma apresentação moderna de estética minimalista.
            </p>
            
            <blockquote className="border-l-4 border-amber-500 pl-4 italic text-gray-900 font-medium my-4">
              "A nossa missão é elevar a confeitaria e os salgados tradicionais ao nível de arte, servidos com excelência."
            </blockquote>
          </div>
        </div>

        {/* REGRA DE ENCOMENDA (AVISO DE 50%) */}
        <div className="bg-amber-50 border border-amber-200/70 rounded-2xl p-5 mt-16 flex gap-3 items-start shadow-sm shadow-amber-500/5">
          <div className="text-amber-600 mt-0.5 shrink-0">
            <Info size={18} />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-900">Política de Produção</h4>
            <p className="text-xs text-amber-800/90 leading-relaxed uppercase tracking-wide font-medium">
              Nota importante: Para garantirmos a frescura e reserva dei ingredientes, a produção e entrega do teu pedido só serão iniciadas após a confirmação do pagamento de <strong className="font-black text-amber-950">50% do valor total</strong>.
            </p>
          </div>
        </div>

        {/* INFORMAÇÕES DE CONTACTO E DADOS BANCÁRIOS */}
        <div className="bg-white border border-amber-100 rounded-2xl p-8 mt-6 space-y-8 shadow-sm">
          
          {/* Canais Sociais e Telefónicos */}
          <div className="space-y-4">
            <h3 className="text-xs font-black tracking-widest uppercase text-amber-600">Canais de Contacto</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs uppercase tracking-wider font-bold text-gray-800">
              
              {/* TELEFONE */}
              <div className="flex items-center gap-3 p-3 bg-gray-50/50 border border-gray-100 rounded-xl">
                <div className="text-amber-600 shrink-0"><Phone size={16} /></div>
                <div>
                  <p className="text-[10px] tracking-widest text-gray-400 font-bold block normal-case">Telefone / WhatsApp</p>
                  <a href="https://wa.me/2389814798" target="_blank" rel="noopener noreferrer" className="hover:text-amber-600 transition-colors">
                    +238 981 4798
                  </a>
                </div>
              </div>

              {/* INSTAGRAM (SVG NATIVO) */}
              <div className="flex items-center gap-3 p-3 bg-gray-50/50 border border-gray-100 rounded-xl">
                <div className="text-amber-600 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] tracking-widest text-gray-400 font-bold block normal-case">Instagram</p>
                  <a href="https://instagram.com/isabel.teixeira.92167" target="_blank" rel="noopener noreferrer" className="hover:text-amber-600 transition-colors">
                    @isabelteixeira
                  </a>
                </div>
              </div>

              {/* FACEBOOK (SVG NATIVO) */}
              <div className="flex items-center gap-3 p-3 bg-gray-50/50 border border-gray-100 rounded-xl">
                <div className="text-amber-600 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] tracking-widest text-gray-400 font-bold block normal-case">Facebook</p>
                  <a href="https://facebook.com/IsabelTeixeira" target="_blank" rel="noopener noreferrer" className="hover:text-amber-600 transition-colors">
                    Isabel Teixeira
                  </a>
                </div>
              </div>

              {/* LOCALIZAÇÃO */}
              <div className="flex items-center gap-3 p-3 bg-gray-50/50 border border-gray-100 rounded-xl">
                <div className="text-amber-600 shrink-0" style={{ transform: "rotate(-10deg)" }}>📍</div>
                <div>
                  <p className="text-[10px] tracking-widest text-gray-400 font-bold block normal-case">Localização</p>
                  <span className="text-gray-900">Praia, Cabo Verde</span>
                </div>
              </div>

            </div>
          </div>

          {/* Dados Bancários para Transferência */}
          <div className="pt-6 border-t border-gray-100 space-y-4">
            <h3 className="text-xs font-black tracking-widest uppercase text-amber-600 flex items-center gap-2">
              <CreditCard size={15} /> Dados de Pagamento (Transferência)
            </h3>
            
            <div className="bg-neutral-900 text-white p-6 rounded-2xl space-y-4 font-mono shadow-inner relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-amber-500/10 rounded-full blur-xl" />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs tracking-wider uppercase">
                <div>
                  <span className="text-[10px] text-neutral-400 block font-sans normal-case mb-0.5">Banco</span>
                  <span className="text-amber-400 font-bold">Banco Comercial do Atlântico (BCA)</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 block font-sans normal-case mb-0.5">Titular da Conta</span>
                  <span className="text-white font-bold">Isabel Pina Teixeira</span>
                </div>
              </div>

              <div className="pt-2">
                <span className="text-[10px] text-neutral-400 block font-sans normal-case mb-0.5">Número de Conta</span>
                <span className="text-base sm:text-lg text-white font-black tracking-widest block select-all bg-neutral-800/50 px-3 py-2 rounded-xl border border-neutral-800">
                  0001 2345 6789 10
                </span>
                <span className="text-[9px] text-amber-500/70 block mt-1 font-sans normal-case">
                  * Envia o comprovativo de transferência via WhatsApp juntamente com o sumário do teu pedido.
                </span>
              </div>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}