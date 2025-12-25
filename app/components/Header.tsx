"use client";

import Link from "next/link";
import { HiOutlineSearch, HiMenu } from "react-icons/hi";
import { FaUserCircle } from "react-icons/fa";
import { useState } from "react";
import { MenuPopover } from "./MenuPopover/MenuPopover";

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="h-14 flex items-center justify-between px-4 border-b border-gray-200">
      {/* Contenedor Izquierdo - Navegación */}
      <nav className="flex items-center gap-6">
        <Link 
          href="/pos/mesas" 
          className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
        >
          Mesas
        </Link>
        <Link 
          href="/pos" 
          className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
        >
          Inscribir
        </Link>
        <Link 
          href="/pos/pedidos" 
          className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
        >
          Pedidos
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
