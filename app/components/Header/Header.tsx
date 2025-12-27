"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiOutlineSearch } from "react-icons/hi";
import { FaUserCircle } from "react-icons/fa";
import { useState } from "react";
import { MenuPopover } from "@/app/components/MenuPopover/MenuPopover";
import useOrderStore from "@/store/useOrderStore";

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { orders } = useOrderStore();
  const ordersCount = orders.length;

  const isActive = (path: string) => {
    if (path === "/pos") {
      return pathname === "/pos";
    }
    return pathname.startsWith(path);
  };

  return (
    <header className="h-14 flex items-center justify-between px-4 border-b border-gray-200">
      {/* Contenedor Izquierdo - Navegación */}
      <nav className="flex items-center gap-6">
        <Link 
          href="/pos/mesas" 
          className={`font-medium transition-colors ${
            isActive("/pos/mesas")
              ? "text-cyan-600 border-b-2 border-cyan-600 pb-1"
              : "text-gray-700 hover:text-gray-900"
          }`}
        >
          Mesas
        </Link>
        <Link 
          href="/pos" 
          className={`font-medium transition-colors ${
            isActive("/pos")
              ? "text-cyan-600 border-b-2 border-cyan-600 pb-1"
              : "text-gray-700 hover:text-gray-900"
          }`}
        >
          Inscribir
        </Link>
        <Link 
          href="/pos/pedidos" 
          className={`font-medium transition-colors relative ${
            isActive("/pos/pedidos")
              ? "text-cyan-600 border-b-2 border-cyan-600 pb-1"
              : "text-gray-700 hover:text-gray-900"
          }`}
        >
          Pedidos
          {ordersCount > 0 && (
            <span className="absolute -top-2 -right-6 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {ordersCount > 99 ? '99+' : ordersCount}
            </span>
          )}
        </Link>
      </nav>

      {/* Contenedor Centro - Logo */}
      <div className="flex items-center">
        <Link href="/pos" className="text-xl font-bold text-gray-800">
          SERVICE POS
        </Link>
      </div>

      {/* Contenedor Derecho - Buscador, Avatar, Menú */}
      <div className="flex items-center gap-4">
        {/* Buscador */}
        <div className="relative">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar..."
            className="pl-10 pr-4 py-1.5 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent w-48"
          />
        </div>

        {/* Avatar */}
        <button className="text-gray-700 hover:text-gray-900 transition-colors">
          <FaUserCircle className="w-8 h-8" />
        </button>

        {/* Menú Hamburguesa */}
        <button className="text-gray-700 hover:text-gray-900 transition-colors cursor-pointer" onClick={() => setOpen(true)}>
          <MenuPopover />
        </button>
      </div>
    </header>
  );
}
