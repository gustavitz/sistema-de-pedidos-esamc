import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export default function DisplayScreen() {
  const orders = useQuery(api.orders.getOrdersByStatus);

  return (
    <div className="h-full p-6">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Painel de Pedidos</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
        {/* Preparando - Lado Esquerdo */}
        <div className="bg-white rounded-lg p-8 border-l-8 border-yellow-400">
          <h2 className="text-3xl font-bold mb-6 text-yellow-600 text-center flex items-center justify-center gap-3">
            ⏳ Preparando
          </h2>
          
          <div className="space-y-4">
            {/* Pedidos Pendentes */}
            {orders?.pendente.map((order) => (
              <div key={order._id} className="bg-gray-50 rounded-lg p-6 shadow-lg text-center border-l-4 border-orange-400">
                <h3 className="text-2xl font-bold text-gray-800">#{order.orderNumber}</h3>
                <p className="text-xl text-gray-600 mt-2">{order.customerName}</p>
              </div>
            ))}
            
            {/* Pedidos em Preparo */}
            {orders?.preparando.map((order) => (
              <div key={order._id} className="bg-gray-50 rounded-lg p-6 shadow-lg text-center border-l-4 border-yellow-400">
                <h3 className="text-2xl font-bold text-gray-800">#{order.orderNumber}</h3>
                <p className="text-xl text-gray-600 mt-2">{order.customerName}</p>
              </div>
            ))}
            
            {(orders?.pendente.length === 0 && orders?.preparando.length === 0) && (
              <div className="text-center text-yellow-600 text-xl font-medium py-12">
                Nenhum pedido em preparo
              </div>
            )}
          </div>
        </div>

        {/* Pronto - Lado Direito */}
        <div className="bg-white rounded-lg p-8 border-l-8 border-green-400">
          <h2 className="text-3xl font-bold mb-6 text-green-600 text-center flex items-center justify-center gap-3">
            ✅ Pronto
          </h2>
          
          <div className="space-y-4">
            {orders?.pronto.map((order) => (
              <div key={order._id} className="bg-gray-50 rounded-lg p-6 shadow-lg text-center border-l-4 border-green-400">
                <h3 className="text-2xl font-bold text-gray-800">#{order.orderNumber}</h3>
                <p className="text-xl text-gray-600 mt-2">{order.customerName}</p>
                <div className="mt-3 text-green-600 text-lg font-medium">
                  🎉 Retire seu pedido!
                </div>
              </div>
            ))}
            
            {orders?.pronto.length === 0 && (
              <div className="text-center text-green-600 text-xl font-medium py-12">
                Nenhum pedido pronto
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
