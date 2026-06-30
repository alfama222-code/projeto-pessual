"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/login");
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  if (!isAuthorized) {
    // Pode retornar um loading spinner ou null enquanto verifica a autenticação
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-400">A carregar...</div>;
  }

  return <>{children}</>;
}
