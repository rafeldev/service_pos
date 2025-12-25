import Header from "../components/Header";
import Cart from "../components/Cart";

export default function PosLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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

