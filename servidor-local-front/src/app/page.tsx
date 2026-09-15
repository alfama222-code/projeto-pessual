"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Força a ida para o login mal o site abre
    router.replace("/login");
  }, [router]);

  return null;
}