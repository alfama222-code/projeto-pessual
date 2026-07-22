"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LogOut,
  TrendingUp,
  Package,
  Calendar,
  Clock,
  ChevronLeft
} from "lucide-react";

type ItemPedido = {
  id: string;
  nome: string;
  quantidade: number;
  preco: number;
};

type Pedido = {
  id: string;
  clienteNome: string;
  clienteEndereco: string;
  formaPagamento: string;
  total: number;
  status: string;
  criadoEm: string;
  itens: ItemPedido[];
};

type Metrics = {
  hoje: { pedidos: number; lucro: number };
  semana: { pedidos: number; lucro: number };
  mes: { pedidos: number; lucro: number };
  ano: { pedidos: number; lucro: number };
  total: { pedidos: number; lucro: number };
};

export default function AdminDashboard() {
  const router = useRouter();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    // Autenticação básica
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/login");
      return;
    }

    if (sessionStorage.getItem("admin_unlocked") === "true") {
      setIsUnlocked(true);
    }

    // Buscar dados
    const fetchDados = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/pedidos");
        if (res.ok) {
          const data = await res.json();
          setPedidos(data.pedidos);
          setMetrics(data.metrics);
        }
      } catch (error) {
        console.error("Erro ao buscar dados do admin:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDados();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
    sessionStorage.removeItem("admin_unlocked");
    router.push("/login");
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === "isabel2026") {
      sessionStorage.setItem("admin_unlocked", "true");
      setIsUnlocked(true);
      setPasswordError("");
    } else {
      setPasswordError("Senha incorreta!");
    }
  };

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm border border-amber-100">
          <div className="text-center mb-6">
            <h1 className="text-xl font-black text-amber-900 uppercase tracking-widest">Acesso Restrito</h1>
            <p className="text-xs text-gray-500 mt-2">Insira a senha de administrador para acessar o painel.</p>
          </div>
          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Senha de Admin"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 outline-none text-sm"
              />
              {passwordError && <p className="text-[10px] text-red-500 font-bold mt-2 ml-1">{passwordError}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-black tracking-widest uppercase text-xs py-3.5 rounded-xl transition-all shadow-md shadow-amber-500/20"
            >
              Desbloquear Painel
            </button>
          </form>
          <div className="mt-6 text-center">
            <Link href="/shop" className="text-xs text-gray-400 hover:text-amber-600 font-bold uppercase tracking-wider">
              &larr; Voltar à Loja
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50/40 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
          <span className="text-amber-800 font-bold tracking-widest uppercase text-xs">
            A carregar dashboard...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-12">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/shop" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ChevronLeft size={24} className="text-gray-500" />
            </Link>
            <div>
              <h1 className="text-xl font-black text-gray-900 uppercase tracking-wide">
                Painel do Chef
              </h1>
              <p className="text-xs text-gray-500 font-medium">Gestão de Vendas & Encomendas</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-xl transition-colors font-bold text-xs uppercase tracking-wide"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
        
        {/* CARDS DE MÉTRICAS */}
        <div>
          <h2 className="text-lg font-black uppercase tracking-wider text-amber-900 mb-4">
            Visão Geral de Lucros
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* HOJE */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Clock size={48} className="text-amber-500" />
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                Hoje
              </p>
              <h3 className="text-2xl font-black text-gray-900">
                {metrics?.hoje.lucro.toFixed(2)} CVE
              </h3>
              <p className="text-xs text-amber-600 font-bold mt-2">
                {metrics?.hoje.pedidos} pedido(s)
              </p>
            </div>

            {/* SEMANA */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Calendar size={48} className="text-amber-500" />
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                Esta Semana
              </p>
              <h3 className="text-2xl font-black text-gray-900">
                {metrics?.semana.lucro.toFixed(2)} CVE
              </h3>
              <p className="text-xs text-amber-600 font-bold mt-2">
                {metrics?.semana.pedidos} pedido(s)
              </p>
            </div>

            {/* MÊS */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <TrendingUp size={48} className="text-amber-500" />
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                Este Mês
              </p>
              <h3 className="text-2xl font-black text-gray-900">
                {metrics?.mes.lucro.toFixed(2)} CVE
              </h3>
              <p className="text-xs text-amber-600 font-bold mt-2">
                {metrics?.mes.pedidos} pedido(s)
              </p>
            </div>

            {/* TOTAL / ANO */}
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-6 rounded-2xl shadow-md text-white hover:shadow-lg transition-shadow relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-20">
                <Package size={48} className="text-white" />
              </div>
              <p className="text-[10px] font-black text-amber-100 uppercase tracking-widest mb-1">
                Total Acumulado
              </p>
              <h3 className="text-2xl font-black">
                {metrics?.total.lucro.toFixed(2)} CVE
              </h3>
              <p className="text-xs text-amber-50 font-bold mt-2">
                {metrics?.total.pedidos} pedido(s) na plataforma
              </p>
            </div>
          </div>
        </div>

        {/* LISTAGEM DE PEDIDOS */}
        <div>
          <h2 className="text-lg font-black uppercase tracking-wider text-gray-900 mb-4">
            Histórico de Encomendas
          </h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50/80 border-b border-gray-100 text-gray-500 text-[10px] uppercase font-black tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Data</th>
                    <th className="px-6 py-4">Cliente</th>
                    <th className="px-6 py-4">Itens</th>
                    <th className="px-6 py-4 text-right">Total (CVE)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {pedidos.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-gray-400 text-xs">
                        Nenhum pedido registrado ainda.
                      </td>
                    </tr>
                  ) : (
                    pedidos.map((pedido) => (
                      <tr key={pedido.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 text-gray-500 font-medium">
                          {new Date(pedido.criadoEm).toLocaleDateString("pt-PT", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-gray-900">{pedido.clienteNome}</p>
                          <p className="text-xs text-gray-500 max-w-[200px] sm:max-w-xs truncate" title={pedido.clienteEndereco}>
                            {pedido.clienteEndereco}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            {pedido.itens.map((item) => (
                              <span key={item.id} className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md inline-flex w-max">
                                {item.quantidade}x {item.nome}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="font-black text-amber-700 bg-amber-50 px-3 py-1 rounded-lg">
                            {pedido.total.toFixed(2)}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
