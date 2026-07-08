"use client";

import { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import Navbar from "./components/Navbar";
import { Info, CreditCard, X } from "lucide-react";

export default function ShopPage() {
  const { cart, addToCart, decreaseQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  
  // Estado para controlar o filtro ativo ("todos" | "doce" | "salgado")
  const [filtro, setFiltro] = useState<"todos" | "doce" | "salgado">("todos");

  // Estado para os produtos vindos da API
  const [produtos, setProdutos] = useState<{ id: string; name: string; type: "salgado" | "doce"; price: number; description: string; image: string }[]>([]);
  const [carregando, setCarregando] = useState(true);

  // Estado para controlar se mostramos todos os produtos ou apenas alguns (ex: 6)
  const [mostrarTodos, setMostrarTodos] = useState(false);

  // Buscar produtos da API do backend
  useEffect(() => {
    const buscarProdutos = async () => {
      try {
        const resposta = await fetch("http://localhost:3001/api/produtos");
        if (resposta.ok) {
          const dados = await resposta.json();
          setProdutos(dados);
        }
      } catch (erro) {
        console.error("Erro ao buscar produtos da API:", erro);
      } finally {
        setCarregando(false);
      }
    };
    
    buscarProdutos();
  }, []);

  // Filtra os produtos com base na escolha do utilizador
  const produtosFiltrados = produtos.filter((produto) => {
    if (filtro === "todos") return true;
    return produto.type === filtro;
  });

  const obterQuantidadeNoCarrinho = (id: string) => {
    const item = cart.find((i) => i.id === id);
    return item ? item.quantity : 0;
  };

  const [modalAberto, setModalAberto] = useState(false);
  const [dadosCheckout, setDadosCheckout] = useState({
    nome: "",
    telefone: "",
    local_de_entrega: "",
    dia_da_entrega: ""
  });

  const abrirCheckout = () => {
    if (cart.length === 0) return alert("O seu carrinho está vazio!");
    setModalAberto(true);
  };

  const enviarPedidoWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();

    let mensagem = `*Novo Pedido - Delícias da Isabel*\n\n`;
    mensagem += `*DADOS DO CLIENTE*\n`;
    mensagem += `Nome: ${dadosCheckout.nome}\n`;
    mensagem += `Telefone: ${dadosCheckout.telefone}\n`;
    mensagem += `Local de entrega: ${dadosCheckout.local_de_entrega}\n`;
    mensagem += `Dia da entrega: ${dadosCheckout.dia_da_entrega}\n\n`;
    
    mensagem += `*ITENS*\n`;
    cart.forEach((item) => {
      mensagem += `• ${item.quantity}x ${item.name} (${(item.price * item.quantity).toFixed(2)} CVE)\n`;
    });
    mensagem += `\n*Total a pagar:* ${cartTotal.toFixed(2)} CVE\n\n_Aguardo confirmação do pagamento de 50% para iniciar a produção!_`;

    const numeroWhatsApp = "2389814798";
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
    
    setModalAberto(false);
    clearCart();
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-amber-50/40 text-gray-900 flex flex-col justify-between relative overflow-x-hidden">
      
      <div className="flex w-full">
        <div className={`w-full transition-all duration-300 ${cart.length > 0 ? "lg:mr-80 xl:mr-96" : ""}`}>
          <Navbar />
          
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            
            {/* Cabeçalho da Seção e Botões de Filtro */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-6">
              <div className="text-center sm:text-left">
                <h2 className="text-xs font-black tracking-widest uppercase text-amber-600">Cardápio Exclusivo</h2>
                <h1 className="text-3xl font-black tracking-tight uppercase mt-2 bg-gradient-to-r from-amber-700 to-amber-900 bg-clip-text text-transparent">
                  Nossas Delícias
                </h1>
              </div>

              {/* BARRA DE FILTROS */}
              <div className="flex justify-center sm:justify-start gap-2 bg-amber-100/40 p-1.5 rounded-2xl border border-amber-100/80 self-center md:self-auto">
                <button
                  onClick={() => setFiltro("todos")}
                  className={`text-[11px] font-black tracking-widest uppercase px-5 py-2.5 rounded-xl transition-all duration-200 ${
                    filtro === "todos"
                      ? "bg-amber-600 text-white shadow-sm shadow-amber-600/10"
                      : "text-amber-800 hover:bg-amber-100/50"
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setFiltro("doce")}
                  className={`text-[11px] font-black tracking-widest uppercase px-5 py-2.5 rounded-xl transition-all duration-200 ${
                    filtro === "doce"
                      ? "bg-amber-600 text-white shadow-sm shadow-amber-600/10"
                      : "text-amber-800 hover:bg-amber-100/50"
                  }`}
                >
                  Doces
                </button>
                <button
                  onClick={() => setFiltro("salgado")}
                  className={`text-[11px] font-black tracking-widest uppercase px-5 py-2.5 rounded-xl transition-all duration-200 ${
                    filtro === "salgado"
                      ? "bg-amber-600 text-white shadow-sm shadow-amber-600/10"
                      : "text-amber-800 hover:bg-amber-100/50"
                  }`}
                >
                  Salgados
                </button>
              </div>
            </div>

            {/* Grid de Cards */}
            {carregando ? (
              <div className="flex justify-center items-center py-24">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
                <span className="ml-3 text-amber-800 font-bold tracking-widest uppercase text-xs">Carregando cardápio...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {(mostrarTodos ? produtosFiltrados : produtosFiltrados.slice(0, 6)).map((produto) => {
                const qtd = obterQuantidadeNoCarrinho(produto.id);

                return (
                  <div 
                    key={produto.id} 
                    className="bg-white border border-amber-100 flex flex-col justify-between hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-200 relative group rounded-2xl overflow-hidden animate-fade-in"
                  >
                    {/* CONTAINER DA IMAGEM */}
                    <div className="relative w-full h-48 bg-amber-50 overflow-hidden">
                      <img 
                        src={produto.image} 
                        alt={produto.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        // Fallback em caso da imagem falhar ou não existir na pasta public/images/
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80";
                        }}
                      />
                      {/* Tag de Tipo (Doce/Salgado) sobreposta na imagem */}
                      <span className="absolute top-4 right-4 text-[9px] font-black tracking-widest uppercase bg-white/90 backdrop-blur-sm text-amber-800 px-2.5 py-1 rounded-md shadow-sm border border-amber-100">
                        {produto.type}
                      </span>
                    </div>

                    {/* CONTEÚDO DO CARD */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <h3 className="font-bold uppercase tracking-wide text-sm text-gray-900 group-hover:text-amber-700 transition-colors">
                          {produto.name}
                        </h3>
                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                          {produto.description}
                        </p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] uppercase tracking-widest text-gray-400 block">Preço</span>
                          <span className="font-black text-sm text-amber-800">{produto.price.toFixed(2)} CVE</span>
                        </div>

                        {qtd === 0 ? (
                          <button
                            onClick={() => addToCart({ id: produto.id, name: produto.name, price: produto.price, type: produto.type })}
                            className="bg-amber-600 text-white text-[11px] font-black tracking-widest uppercase px-5 py-2.5 rounded-xl hover:bg-amber-700 shadow-sm shadow-amber-600/10 active:scale-95 transition-all"
                          >
                            Adicionar
                          </button>
                        ) : (
                          <div className="flex items-center border border-amber-200 bg-amber-50/50 rounded-xl overflow-hidden shadow-sm">
                            <button
                              onClick={() => decreaseQuantity(produto.id)}
                              className="px-3 py-1.5 font-bold text-sm hover:bg-amber-100 text-amber-800 transition-colors"
                            >
                              −
                            </button>
                            <span className="px-2 font-black text-xs text-center min-w-[24px] text-amber-950">
                              {qtd}
                            </span>
                            <button
                              onClick={() => addToCart({ id: produto.id, name: produto.name, price: produto.price, type: produto.type })}
                              className="px-3 py-1.5 font-bold text-sm hover:bg-amber-100 text-amber-800 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              </div>
            )}

            {/* Botão de Mostrar Todos / Menos */}
            {!carregando && produtosFiltrados.length > 6 && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={() => setMostrarTodos(!mostrarTodos)}
                  className="text-[11px] font-black tracking-widest uppercase bg-white border-2 border-amber-100 text-amber-700 px-8 py-3.5 rounded-xl hover:bg-amber-50 hover:border-amber-200 transition-all shadow-sm active:scale-95"
                >
                  {mostrarTodos ? "Mostrar Menos" : "Mostrar Todos"}
                </button>
              </div>
            )}


            {/* Caso o filtro não encontre nenhum produto */}
            {produtosFiltrados.length === 0 && (
              <div className="text-center py-12 text-sm text-gray-400 uppercase tracking-widest">
                Nenhum produto encontrado nesta categoria.
              </div>
            )}
          </main>
        </div>

        {/* SIDEBAR DO CARRINHO */}
        {cart.length > 0 && (
          <aside className="fixed top-0 right-0 h-screen w-full sm:w-80 lg:w-80 xl:w-96 bg-white border-l border-amber-100 z-50 shadow-2xl flex flex-col justify-between p-6 animate-slide-in">
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <span className="font-black text-xs uppercase tracking-widest text-amber-700">O Teu Pedido</span>
                <span className="bg-amber-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm shadow-amber-500/20">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)} itens
                </span>
              </div>

              <div className="mt-4 space-y-4 overflow-y-auto max-h-[65vh] pr-1 divide-y divide-gray-50">
                {cart.map((item) => (
                  <div key={item.id} className="pt-3 flex flex-col gap-1 text-xs">
                    <div className="flex justify-between items-start gap-2">
                      <span className="uppercase font-bold text-gray-900 tracking-wide leading-tight">
                        {item.name}
                      </span>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500 font-bold text-sm transition-colors"
                        title="Remover tudo"
                      >
                        ✕
                      </button>
                    </div>
                    
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-gray-500 font-medium">{item.quantity}x de {item.price.toFixed(2)} CVE</span>
                      
                      <div className="flex items-center border border-amber-200 bg-amber-50/30 rounded-lg overflow-hidden">
                        <button onClick={() => decreaseQuantity(item.id)} className="px-2 py-0.5 font-bold text-amber-700 hover:bg-amber-100">−</button>
                        <span className="px-2 text-[11px] font-bold text-amber-950">{item.quantity}</span>
                        <button onClick={() => addToCart({ id: item.id, name: item.name, price: item.price, type: item.type })} className="px-2 py-0.5 font-bold text-amber-700 hover:bg-amber-100">+</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 space-y-4 bg-white">
              <div className="flex justify-between items-baseline">
                <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Total Geral</span>
                <span className="text-xl font-black text-amber-800">{cartTotal.toFixed(2)} CVE</span>
              </div>
              <button
                onClick={abrirCheckout}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white text-xs font-black tracking-widest uppercase py-4 rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all shadow-md shadow-amber-600/10 block text-center"
              >
                Continuar Pedido
              </button>
            </div>
          </aside>
        )}
      </div>

      {/* FOOTER PREMIUM */}
      <footer className={`w-full bg-gradient-to-b from-amber-950 to-neutral-950 text-white border-t border-amber-950 mt-24 transition-all duration-300 ${cart.length > 0 ? "lg:mr-80 xl:mr-96 lg:w-[calc(100%-20rem)] xl:w-[calc(100%-24rem)]" : ""}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12 border-b border-amber-900/30">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 bg-amber-500 rounded-full" />
                <span className="font-black tracking-widest text-sm uppercase text-amber-400">DELÍCIAS DA ISABEL</span>
              </div>
              <p className="text-xs text-amber-100/70 max-w-xs leading-relaxed uppercase tracking-wider">
                Alta confeitaria e salgados artesanais. Elevando o sabor ao nível da arte.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-black tracking-widest uppercase text-amber-400">Funcionamento</h4>
              <ul className="text-xs space-y-2 uppercase tracking-wide text-amber-100/80">
                <li>Terça a Sábado: 09h — 20h</li>
                <li>Domingo: 10h — 16h</li>
                <li className="text-amber-700/80">Segunda-feira: Encerrado</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-black tracking-widest uppercase text-amber-400">Encomendas</h4>
              <p className="text-xs text-amber-100/80 uppercase tracking-wide leading-relaxed">
                Aceitamos pedidos programados para eventos e catering através do nosso canal digital.
              </p>
              <div className="pt-2">
                <a 
                  href="https://wa.me/2389814798"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block text-[11px] font-black tracking-widest uppercase bg-amber-500 text-white px-5 py-2.5 rounded-xl hover:bg-amber-600 transition-colors duration-200 shadow-md shadow-amber-500/10"
                >
                  WhatsApp Geral
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center pt-8 text-[10px] tracking-widest uppercase text-amber-700 space-y-4 sm:space-y-0">
            <p>© {new Date().getFullYear()} Delícias da Isabel. Todos os direitos reservados.</p>
            <div className="flex gap-6">
              <span className="hover:text-amber-400 transition-colors duration-200 cursor-pointer">Termos</span>
              <span className="hover:text-amber-400 transition-colors duration-200 cursor-pointer">Privacidade</span>
            </div>
          </div>
        </div>
      </footer>

      {/* MODAL DE CHECKOUT */}
      {modalAberto && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-sm font-black tracking-widest uppercase text-amber-900">Detalhes do Pedido</h2>
              <button onClick={() => setModalAberto(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto p-6 space-y-6">
              
              {/* Formulário */}
              <form id="checkout-form" onSubmit={enviarPedidoWhatsApp} className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-1">Nome Completo</label>
                  <input required type="text" value={dadosCheckout.nome} onChange={(e) => setDadosCheckout({...dadosCheckout, nome: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-amber-500 outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-1">Número de Telefone</label>
                  <input required type="tel" value={dadosCheckout.telefone} onChange={(e) => setDadosCheckout({...dadosCheckout, telefone: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-amber-500 outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-1">Local de Entrega</label>
                  <input required type="text" value={dadosCheckout.local_de_entrega} onChange={(e) => setDadosCheckout({...dadosCheckout, local_de_entrega: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-amber-500 outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-1">Dia da Entrega</label>
                  <input required type="text" placeholder="Ex: Sexta-feira às 14h" value={dadosCheckout.dia_da_entrega} onChange={(e) => setDadosCheckout({...dadosCheckout, dia_da_entrega: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-amber-500 outline-none" />
                </div>
              </form>

              {/* Aviso da Política */}
              <div className="bg-amber-50 border border-amber-200/70 rounded-2xl p-4 flex gap-3 items-start shadow-sm shadow-amber-500/5">
                <div className="text-amber-600 mt-0.5 shrink-0">
                  <Info size={16} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-amber-900">Política de Produção</h4>
                  <p className="text-[10px] text-amber-800/90 leading-relaxed uppercase tracking-wide font-medium">
                    Nota importante: A produção e entrega do teu pedido só serão iniciadas após a confirmação do pagamento de <strong className="font-black text-amber-950">50% do valor total</strong>.
                  </p>
                </div>
              </div>

              {/* Banco */}
              <div className="bg-neutral-900 text-white p-5 rounded-2xl space-y-3 font-mono shadow-inner relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-amber-500/10 rounded-full blur-xl" />
                <div className="flex items-center gap-2 text-amber-500 mb-2">
                  <CreditCard size={14} /> <span className="text-[10px] uppercase font-sans tracking-widest font-bold">Transferência BCA</span>
                </div>
                <div>
                  <span className="text-[9px] text-neutral-400 block font-sans uppercase mb-0.5">Titular da Conta</span>
                  <span className="text-white font-bold text-xs">Isabel Pina Teixeira</span>
                </div>
                <div className="pt-1">
                  <span className="text-[9px] text-neutral-400 block font-sans uppercase mb-0.5">Número de Conta</span>
                  <span className="text-sm text-white font-black tracking-widest block bg-neutral-800 px-3 py-2 rounded-xl">
                    0001 2345 6789 10
                  </span>
                </div>
              </div>
              
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 mt-auto">
              <button 
                type="submit"
                form="checkout-form"
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-black tracking-widest uppercase py-4 rounded-xl transition-all shadow-md shadow-amber-500/20 text-xs"
              >
                Confirmar e Enviar WhatsApp
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}