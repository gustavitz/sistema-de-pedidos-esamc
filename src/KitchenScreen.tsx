import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { toast } from "sonner";

export default function KitchenScreen() {
  const orders = useQuery(api.orders.getOrdersByStatus);
  const updateOrderStatus = useMutation(api.orders.updateOrderStatus);
  const deleteOrder = useMutation(api.orders.deleteOrder);

  const handleStatusChange = async (orderId: Id<"orders">, newStatus: "pendente" | "preparando" | "pronto" | "entregue") => {
    try {
      await updateOrderStatus({ orderId, status: newStatus });
      toast.success("Status do pedido atualizado!");
    } catch (error) {
      toast.error("Erro ao atualizar status");
    }
  };

  const handlePickupOrder = async (orderId: Id<"orders">) => {
    try {
      await deleteOrder({ orderId });
      toast.success("Pedido retirado e removido do sistema!");
    } catch (error) {
      toast.error("Erro ao processar retirada");
    }
  };

  const formatOrderItems = (items: any[]) => {
    return items.map(item => `${item.quantity}x ${item.name}`).join(", ");
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="h-full p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">👨‍🍳 Cozinha</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* Fila de Pedidos - Lado Esquerdo */}
        <div className="bg-white rounded-lg p-6 border-l-4 border-orange-400">
          <h2 className="text-2xl font-semibold mb-4 text-orange-600 flex items-center gap-2">
            📋 Fila ({(orders?.pendente.length || 0) + (orders?.preparando.length || 0)})
          </h2>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {/* Pedidos Pendentes */}
            {orders?.pendente.map((order) => (
              <div key={order._id} className="bg-gray-50 rounded-lg p-4 shadow-md border-l-4 border-orange-400">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg">Pedido #{order.orderNumber}</h3>
                    <p className="text-gray-600">{order.customerName}</p>
                    <p className="text-xs text-gray-500">{formatTime(order._creationTime)}</p>
                  </div>
                  <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm font-medium">
                    Pendente
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-3">{formatOrderItems(order.items)}</p>
                <p className="font-semibold text-green-600 mb-3">Total: R$ {order.total.toFixed(2)}</p>
                <button
                  onClick={() => handleStatusChange(order._id, "preparando")}
                  className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600 transition-colors font-medium"
                >
                  Iniciar Preparo
                </button>
              </div>
            ))}
            
            {/* Pedidos em Preparo */}
            {orders?.preparando.map((order) => (
              <div key={order._id} className="bg-gray-50 rounded-lg p-4 shadow-md border-l-4 border-yellow-400">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg">Pedido #{order.orderNumber}</h3>
                    <p className="text-gray-600">{order.customerName}</p>
                    <p className="text-xs text-gray-500">{formatTime(order._creationTime)}</p>
                  </div>
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-medium">
                    Preparando
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-3">{formatOrderItems(order.items)}</p>
                <p className="font-semibold text-green-600 mb-3">Total: R$ {order.total.toFixed(2)}</p>
                <button
                  onClick={() => handleStatusChange(order._id, "pronto")}
                  className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition-colors font-medium"
                >
                  Marcar como Pronto
                </button>
              </div>
            ))}

            {(orders?.pendente.length === 0 && orders?.preparando.length === 0) && (
              <div className="text-center text-gray-500 py-8">
                Nenhum pedido na fila
              </div>
            )}
          </div>
        </div>

        {/* Pedidos Prontos - Centro */}
        <div className="bg-white rounded-lg p-6 border-l-4 border-green-400">
          <h2 className="text-2xl font-semibold mb-4 text-green-600 flex items-center gap-2">
            ✅ Prontos ({orders?.pronto.length || 0})
          </h2>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {orders?.pronto.map((order) => (
              <div key={order._id} className="bg-gray-50 rounded-lg p-4 shadow-md border-l-4 border-green-400">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg">Pedido #{order.orderNumber}</h3>
                    <p className="text-gray-600">{order.customerName}</p>
                    <p className="text-xs text-gray-500">{formatTime(order._creationTime)}</p>
                  </div>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                    Pronto
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-3">{formatOrderItems(order.items)}</p>
                <p className="font-semibold text-green-600 mb-3">Total: R$ {order.total.toFixed(2)}</p>
                <button
                  onClick={() => handlePickupOrder(order._id)}
                  className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors font-medium"
                >
                  🚚 Pedido Retirado
                </button>
              </div>
            ))}

            {orders?.pronto.length === 0 && (
              <div className="text-center text-green-600 py-8">
                Nenhum pedido pronto
              </div>
            )}
          </div>
        </div>

        {/* Estatísticas e Controles - Lado Direito */}
        <div className="bg-white rounded-lg p-6 border-l-4 border-blue-400">
          <h2 className="text-2xl font-semibold mb-4 text-blue-600 flex items-center gap-2">
            📊 Estatísticas
          </h2>
          
          <div className="space-y-4">
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-semibold text-orange-800">Pedidos Pendentes</h3>
              <p className="text-2xl font-bold text-orange-600">{orders?.pendente.length || 0}</p>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-800">Em Preparo</h3>
              <p className="text-2xl font-bold text-yellow-600">{orders?.preparando.length || 0}</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800">Prontos</h3>
              <p className="text-2xl font-bold text-green-600">{orders?.pronto.length || 0}</p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800">Total na Fila</h3>
              <p className="text-2xl font-bold text-blue-600">
                {(orders?.pendente.length || 0) + (orders?.preparando.length || 0) + (orders?.pronto.length || 0)}
              </p>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Tempo Médio</h3>
              <p className="text-sm text-gray-600">
                Acompanhe o tempo de preparo dos pedidos para otimizar o atendimento.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
