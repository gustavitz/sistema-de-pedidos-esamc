import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { toast } from "sonner";

interface CartItem {
  menuItemId: Id<"menuItems">;
  name: string;
  price: number;
  quantity: number;
}

export default function CustomerScreen() {
  const menuItems = useQuery(api.orders.getMenuItems);
  const createOrder = useMutation(api.orders.createOrder);
  const seedMenuItems = useMutation(api.orders.seedMenuItems);
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [showThankYou, setShowThankYou] = useState(false);
  const [lastOrderNumber, setLastOrderNumber] = useState<number | null>(null);

  useEffect(() => {
    if (menuItems && menuItems.length === 0) {
      seedMenuItems();
    }
  }, [menuItems, seedMenuItems]);

  const addToCart = (item: any) => {
    setCart(prev => {
      const existing = prev.find(cartItem => cartItem.menuItemId === item._id);
      if (existing) {
        return prev.map(cartItem =>
          cartItem.menuItemId === item._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, {
        menuItemId: item._id,
        name: item.name,
        price: item.price,
        quantity: 1,
      }];
    });
    toast.success(`${item.name} adicionado ao carrinho!`);
  };

  const removeFromCart = (menuItemId: string) => {
    setCart(prev => prev.filter(item => item.menuItemId !== menuItemId));
  };

  const updateQuantity = (menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(menuItemId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.menuItemId === menuItemId ? { ...item, quantity } : item
      )
    );
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleSubmitOrder = async () => {
    if (!customerName.trim()) {
      toast.error("Por favor, informe seu nome");
      return;
    }
    if (cart.length === 0) {
      toast.error("Adicione itens ao carrinho");
      return;
    }

    try {
      const result = await createOrder({
        customerName: customerName.trim(),
        items: cart,
        total: getTotal(),
      });
      
      // Show thank you message
      setShowThankYou(true);
      setLastOrderNumber(result);
      setCart([]);
      setCustomerName("");
      
      // Hide thank you message after 5 seconds
      setTimeout(() => {
        setShowThankYou(false);
        setLastOrderNumber(null);
      }, 5000);
      
    } catch (error) {
      toast.error("Erro ao realizar pedido");
    }
  };

  const groupedItems = menuItems?.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof menuItems>) || {};

  if (showThankYou) {
    return (
      <div className="max-w-4xl mx-auto p-6 flex items-center justify-center min-h-[60vh]">
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-12 text-center max-w-md">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-green-800 mb-4">Obrigado!</h2>
          <p className="text-lg text-green-700 mb-2">
            Seu pedido foi recebido com sucesso!
          </p>
          <p className="text-xl font-semibold text-green-800 mb-4">
            Número do pedido: #{lastOrderNumber}
          </p>
          <p className="text-green-600">
            Acompanhe o status do seu pedido no painel.
          </p>
          <div className="mt-6 text-sm text-green-600">
            Retornando ao cardápio em alguns segundos...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Menu */}
        <div className="lg:col-span-2">
          <h1 className="text-2xl font-light text-gray-900 mb-8 tracking-wide">Cardápio</h1>
          
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category} className="mb-12">
              <h2 className="text-lg font-medium text-gray-800 mb-6 pb-2 border-b border-gray-100">{category}</h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item._id} className="bg-white border border-gray-100 rounded-lg p-6 hover:border-gray-200 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{item.imageUrl}</span>
                          <h3 className="font-medium text-gray-900">{item.name}</h3>
                        </div>
                        <p className="text-gray-600 text-sm mb-3 leading-relaxed">{item.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold text-gray-900">
                            R$ {item.price.toFixed(2)}
                          </span>
                          <button
                            onClick={() => addToCart(item)}
                            className="bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors text-sm font-medium"
                          >
                            Adicionar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Cart */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-100 rounded-lg p-6 sticky top-24">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Seu Pedido</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:border-gray-400 transition-colors"
                placeholder="Seu nome"
              />
            </div>

            {cart.length === 0 ? (
              <p className="text-gray-400 text-center py-12 text-sm">Nenhum item selecionado</p>
            ) : (
              <>
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.menuItemId} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm text-gray-900">{item.name}</h4>
                        <p className="text-gray-500 text-xs">R$ {item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                          className="w-7 h-7 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-gray-200 transition-colors"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                          className="w-7 h-7 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-gray-200 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-gray-100 pt-6">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-base font-medium text-gray-700">Total</span>
                    <span className="text-xl font-semibold text-gray-900">
                      R$ {getTotal().toFixed(2)}
                    </span>
                  </div>
                  
                  <button
                    onClick={handleSubmitOrder}
                    className="w-full bg-gray-900 text-white py-3 rounded-md font-medium hover:bg-gray-800 transition-colors"
                  >
                    Finalizar Pedido
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
