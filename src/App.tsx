import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Toaster } from "sonner";
import { useState } from "react";
import CustomerScreen from "./CustomerScreen";
import KitchenScreen from "./KitchenScreen";
import DisplayScreen from "./DisplayScreen";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<"customer" | "kitchen" | "display">("customer");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm h-16 flex justify-between items-center border-b shadow-sm px-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-800">🍽️ Sistema de Pedidos</h2>
          <nav className="flex gap-2">
            <button
              onClick={() => setCurrentScreen("customer")}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                currentScreen === "customer" 
                  ? "bg-blue-500 text-white" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Cliente
            </button>
            <button
              onClick={() => setCurrentScreen("kitchen")}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                currentScreen === "kitchen" 
                  ? "bg-blue-500 text-white" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Cozinha
            </button>
            <button
              onClick={() => setCurrentScreen("display")}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                currentScreen === "display" 
                  ? "bg-blue-500 text-white" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Painel
            </button>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        {currentScreen === "customer" && <CustomerScreen />}
        {currentScreen === "kitchen" && <KitchenScreen />}
        {currentScreen === "display" && <DisplayScreen />}
      </main>
      <Toaster />
    </div>
  );
}
