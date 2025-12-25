import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Service POS</h1>
        <p className="text-gray-600 mb-8">Sistema de punto de venta</p>
        <Link 
          href="/pos" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Ir al POS
        </Link>
      </div>
    </div>
  );
}
