"use client";

import Header from "@/app/components/Header/Header";
import Cart from "../components/Cart/Cart";
import { usePathname } from "next/navigation";

export default function PosLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isPedidos = pathname.includes('/pos/pedidos');

  if (isPedidos) {
    return <>{children}</>
  }
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <Header />

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Cart sidebar */}
        <Cart />

        {/* Children area */}
        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
}

