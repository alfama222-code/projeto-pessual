// src/app/(shop)/layout.tsx
import { CartProvider } from "@/src/context/CartContext";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <CartProvider>
        {children}
      </CartProvider>
    </>
  );
}