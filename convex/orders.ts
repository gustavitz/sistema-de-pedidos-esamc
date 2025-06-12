import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getMenuItems = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("menuItems").collect();
  },
});

export const createOrder = mutation({
  args: {
    customerName: v.string(),
    items: v.array(v.object({
      menuItemId: v.id("menuItems"),
      quantity: v.number(),
      name: v.string(),
      price: v.number(),
    })),
    total: v.number(),
  },
  handler: async (ctx, args) => {
    // Get the next order number
    const lastOrder = await ctx.db.query("orders").order("desc").first();
    const orderNumber = (lastOrder?.orderNumber || 0) + 1;
    
    await ctx.db.insert("orders", {
      ...args,
      status: "pendente",
      orderNumber,
    });
    
    return orderNumber;
  },
});

export const getOrdersByStatus = query({
  args: {},
  handler: async (ctx) => {
    const orders = await ctx.db.query("orders").collect();
    return {
      preparando: orders.filter(order => order.status === "preparando"),
      pronto: orders.filter(order => order.status === "pronto"),
      pendente: orders.filter(order => order.status === "pendente"),
      entregue: orders.filter(order => order.status === "entregue"),
    };
  },
});

export const updateOrderStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.union(v.literal("pendente"), v.literal("preparando"), v.literal("pronto"), v.literal("entregue")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.orderId, { status: args.status });
  },
});

export const deleteOrder = mutation({
  args: {
    orderId: v.id("orders"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.orderId);
  },
});

export const clearAndReseedMenuItems = mutation({
  args: {},
  handler: async (ctx) => {
    // Clear existing items
    const existingItems = await ctx.db.query("menuItems").collect();
    for (const item of existingItems) {
      await ctx.db.delete(item._id);
    }

    // Add all the new menu items
    const menuItems = [
      // Hambúrgueres
      {
        name: "Hambúrguer Clássico",
        price: 25.90,
        category: "Hambúrgueres",
        imageUrl: "🍔",
        description: "Hambúrguer suculento com queijo, alface e tomate",
      },
      {
        name: "Hambúrguer Bacon",
        price: 29.90,
        category: "Hambúrgueres",
        imageUrl: "🍔",
        description: "Hambúrguer com bacon crocante e queijo cheddar",
      },
      {
        name: "Hambúrguer Duplo",
        price: 35.90,
        category: "Hambúrgueres",
        imageUrl: "🍔",
        description: "Dois hambúrgueres com queijo, alface e molho especial",
      },
      {
        name: "Hambúrguer Vegetariano",
        price: 27.90,
        category: "Hambúrgueres",
        imageUrl: "🥬",
        description: "Hambúrguer de grão-de-bico com vegetais frescos",
      },
      {
        name: "Hambúrguer BBQ",
        price: 32.90,
        category: "Hambúrgueres",
        imageUrl: "🍔",
        description: "Hambúrguer com molho barbecue, cebola caramelizada e queijo",
      },
      {
        name: "Hambúrguer Picante",
        price: 28.90,
        category: "Hambúrgueres",
        imageUrl: "🌶️",
        description: "Hambúrguer com pimenta jalapeño, queijo pepper jack e molho picante",
      },
      
      // Pizzas
      {
        name: "Pizza Margherita",
        price: 35.90,
        category: "Pizzas",
        imageUrl: "🍕",
        description: "Pizza tradicional com molho de tomate, mussarela e manjericão",
      },
      {
        name: "Pizza Pepperoni",
        price: 39.90,
        category: "Pizzas",
        imageUrl: "🍕",
        description: "Pizza com pepperoni e queijo mussarela",
      },
      {
        name: "Pizza Quatro Queijos",
        price: 42.90,
        category: "Pizzas",
        imageUrl: "🍕",
        description: "Pizza com mussarela, gorgonzola, parmesão e provolone",
      },
      {
        name: "Pizza Portuguesa",
        price: 44.90,
        category: "Pizzas",
        imageUrl: "🍕",
        description: "Pizza com presunto, ovos, cebola, azeitona e ervilha",
      },
      {
        name: "Pizza Calabresa",
        price: 38.90,
        category: "Pizzas",
        imageUrl: "🍕",
        description: "Pizza com calabresa, cebola e azeitona",
      },
      {
        name: "Pizza Frango com Catupiry",
        price: 41.90,
        category: "Pizzas",
        imageUrl: "🍕",
        description: "Pizza com frango desfiado e catupiry cremoso",
      },
      
      // Pratos Principais
      {
        name: "Filé à Parmegiana",
        price: 48.90,
        category: "Pratos Principais",
        imageUrl: "🥩",
        description: "Filé empanado com molho de tomate e queijo derretido",
      },
      {
        name: "Frango Grelhado",
        price: 32.90,
        category: "Pratos Principais",
        imageUrl: "🍗",
        description: "Peito de frango grelhado com temperos especiais",
      },
      {
        name: "Salmão Grelhado",
        price: 55.90,
        category: "Pratos Principais",
        imageUrl: "🐟",
        description: "Salmão fresco grelhado com ervas finas",
      },
      {
        name: "Lasanha Bolonhesa",
        price: 42.90,
        category: "Pratos Principais",
        imageUrl: "🍝",
        description: "Lasanha tradicional com molho bolonhesa e queijo gratinado",
      },
      {
        name: "Risotto de Camarão",
        price: 52.90,
        category: "Pratos Principais",
        imageUrl: "🍤",
        description: "Risotto cremoso com camarões frescos e ervas",
      },
      {
        name: "Picanha Grelhada",
        price: 58.90,
        category: "Pratos Principais",
        imageUrl: "🥩",
        description: "Picanha suculenta grelhada no ponto, acompanha farofa",
      },
      
      // Acompanhamentos
      {
        name: "Batata Frita",
        price: 12.90,
        category: "Acompanhamentos",
        imageUrl: "🍟",
        description: "Batatas fritas crocantes e douradas",
      },
      {
        name: "Onion Rings",
        price: 15.90,
        category: "Acompanhamentos",
        imageUrl: "🧅",
        description: "Anéis de cebola empanados e fritos",
      },
      {
        name: "Salada Caesar",
        price: 18.90,
        category: "Acompanhamentos",
        imageUrl: "🥗",
        description: "Alface romana, croutons, parmesão e molho caesar",
      },
      {
        name: "Arroz e Feijão",
        price: 8.90,
        category: "Acompanhamentos",
        imageUrl: "🍚",
        description: "Arroz branco e feijão carioca temperado",
      },
      {
        name: "Mandioca Frita",
        price: 14.90,
        category: "Acompanhamentos",
        imageUrl: "🥔",
        description: "Mandioca dourada e crocante",
      },
      {
        name: "Polenta Frita",
        price: 13.90,
        category: "Acompanhamentos",
        imageUrl: "🌽",
        description: "Polenta cremosa por dentro e crocante por fora",
      },
      
      // Bebidas
      {
        name: "Refrigerante",
        price: 6.90,
        category: "Bebidas",
        imageUrl: "🥤",
        description: "Refrigerante gelado 350ml",
      },
      {
        name: "Suco Natural",
        price: 8.90,
        category: "Bebidas",
        imageUrl: "🧃",
        description: "Suco natural de frutas 400ml",
      },
      {
        name: "Água Mineral",
        price: 4.90,
        category: "Bebidas",
        imageUrl: "💧",
        description: "Água mineral sem gás 500ml",
      },
      {
        name: "Cerveja",
        price: 12.90,
        category: "Bebidas",
        imageUrl: "🍺",
        description: "Cerveja gelada long neck 355ml",
      },
      {
        name: "Café Expresso",
        price: 5.90,
        category: "Bebidas",
        imageUrl: "☕",
        description: "Café expresso tradicional",
      },
      {
        name: "Cappuccino",
        price: 8.90,
        category: "Bebidas",
        imageUrl: "☕",
        description: "Cappuccino cremoso com canela",
      },
      {
        name: "Milkshake",
        price: 15.90,
        category: "Bebidas",
        imageUrl: "🥤",
        description: "Milkshake cremoso - sabores: chocolate, morango ou baunilha",
      },
      
      // Sobremesas
      {
        name: "Pudim de Leite",
        price: 14.90,
        category: "Sobremesas",
        imageUrl: "🍮",
        description: "Pudim cremoso com calda de caramelo",
      },
      {
        name: "Brigadeiro Gourmet",
        price: 8.90,
        category: "Sobremesas",
        imageUrl: "🍫",
        description: "Brigadeiro artesanal com granulado belga",
      },
      {
        name: "Sorvete",
        price: 12.90,
        category: "Sobremesas",
        imageUrl: "🍨",
        description: "Sorvete artesanal - sabores variados",
      },
      {
        name: "Torta de Chocolate",
        price: 16.90,
        category: "Sobremesas",
        imageUrl: "🍰",
        description: "Fatia de torta de chocolate com cobertura",
      },
      {
        name: "Cheesecake",
        price: 18.90,
        category: "Sobremesas",
        imageUrl: "🍰",
        description: "Cheesecake cremoso com calda de frutas vermelhas",
      },
      {
        name: "Açaí na Tigela",
        price: 22.90,
        category: "Sobremesas",
        imageUrl: "🍇",
        description: "Açaí cremoso com granola, banana e mel",
      },
      {
        name: "Petit Gateau",
        price: 19.90,
        category: "Sobremesas",
        imageUrl: "🍫",
        description: "Bolinho de chocolate quente com sorvete de baunilha",
      },
      
      // Entradas
      {
        name: "Bruschetta",
        price: 16.90,
        category: "Entradas",
        imageUrl: "🍞",
        description: "Pão italiano com tomate, manjericão e azeite",
      },
      {
        name: "Bolinho de Bacalhau",
        price: 24.90,
        category: "Entradas",
        imageUrl: "🐟",
        description: "Bolinhos crocantes de bacalhau com molho tártaro",
      },
      {
        name: "Coxinha de Frango",
        price: 8.90,
        category: "Entradas",
        imageUrl: "🍗",
        description: "Coxinha tradicional de frango desfiado",
      },
      {
        name: "Pastéis Variados",
        price: 12.90,
        category: "Entradas",
        imageUrl: "🥟",
        description: "Pastéis fritos - queijo, carne ou palmito",
      },
      {
        name: "Pão de Alho",
        price: 9.90,
        category: "Entradas",
        imageUrl: "🧄",
        description: "Pão francês com alho e ervas, gratinado",
      },
    ];

    for (const item of menuItems) {
      await ctx.db.insert("menuItems", item);
    }
  },
});

export const seedMenuItems = mutation({
  args: {},
  handler: async (ctx) => {
    const existingItems = await ctx.db.query("menuItems").collect();
    if (existingItems.length > 0) return;

    const menuItems = [
      // Hambúrgueres
      {
        name: "Hambúrguer Clássico",
        price: 25.90,
        category: "Hambúrgueres",
        imageUrl: "🍔",
        description: "Hambúrguer suculento com queijo, alface e tomate",
      },
      {
        name: "Hambúrguer Bacon",
        price: 29.90,
        category: "Hambúrgueres",
        imageUrl: "🍔",
        description: "Hambúrguer com bacon crocante e queijo cheddar",
      },
      {
        name: "Hambúrguer Duplo",
        price: 35.90,
        category: "Hambúrgueres",
        imageUrl: "🍔",
        description: "Dois hambúrgueres com queijo, alface e molho especial",
      },
      {
        name: "Hambúrguer Vegetariano",
        price: 27.90,
        category: "Hambúrgueres",
        imageUrl: "🥬",
        description: "Hambúrguer de grão-de-bico com vegetais frescos",
      },
      {
        name: "Hambúrguer BBQ",
        price: 32.90,
        category: "Hambúrgueres",
        imageUrl: "🍔",
        description: "Hambúrguer com molho barbecue, cebola caramelizada e queijo",
      },
      {
        name: "Hambúrguer Picante",
        price: 28.90,
        category: "Hambúrgueres",
        imageUrl: "🌶️",
        description: "Hambúrguer com pimenta jalapeño, queijo pepper jack e molho picante",
      },
      
      // Pizzas
      {
        name: "Pizza Margherita",
        price: 35.90,
        category: "Pizzas",
        imageUrl: "🍕",
        description: "Pizza tradicional com molho de tomate, mussarela e manjericão",
      },
      {
        name: "Pizza Pepperoni",
        price: 39.90,
        category: "Pizzas",
        imageUrl: "🍕",
        description: "Pizza com pepperoni e queijo mussarela",
      },
      {
        name: "Pizza Quatro Queijos",
        price: 42.90,
        category: "Pizzas",
        imageUrl: "🍕",
        description: "Pizza com mussarela, gorgonzola, parmesão e provolone",
      },
      {
        name: "Pizza Portuguesa",
        price: 44.90,
        category: "Pizzas",
        imageUrl: "🍕",
        description: "Pizza com presunto, ovos, cebola, azeitona e ervilha",
      },
      {
        name: "Pizza Calabresa",
        price: 38.90,
        category: "Pizzas",
        imageUrl: "🍕",
        description: "Pizza com calabresa, cebola e azeitona",
      },
      {
        name: "Pizza Frango com Catupiry",
        price: 41.90,
        category: "Pizzas",
        imageUrl: "🍕",
        description: "Pizza com frango desfiado e catupiry cremoso",
      },
      
      // Pratos Principais
      {
        name: "Filé à Parmegiana",
        price: 48.90,
        category: "Pratos Principais",
        imageUrl: "🥩",
        description: "Filé empanado com molho de tomate e queijo derretido",
      },
      {
        name: "Frango Grelhado",
        price: 32.90,
        category: "Pratos Principais",
        imageUrl: "🍗",
        description: "Peito de frango grelhado com temperos especiais",
      },
      {
        name: "Salmão Grelhado",
        price: 55.90,
        category: "Pratos Principais",
        imageUrl: "🐟",
        description: "Salmão fresco grelhado com ervas finas",
      },
      {
        name: "Lasanha Bolonhesa",
        price: 42.90,
        category: "Pratos Principais",
        imageUrl: "🍝",
        description: "Lasanha tradicional com molho bolonhesa e queijo gratinado",
      },
      {
        name: "Risotto de Camarão",
        price: 52.90,
        category: "Pratos Principais",
        imageUrl: "🍤",
        description: "Risotto cremoso com camarões frescos e ervas",
      },
      {
        name: "Picanha Grelhada",
        price: 58.90,
        category: "Pratos Principais",
        imageUrl: "🥩",
        description: "Picanha suculenta grelhada no ponto, acompanha farofa",
      },
      
      // Acompanhamentos
      {
        name: "Batata Frita",
        price: 12.90,
        category: "Acompanhamentos",
        imageUrl: "🍟",
        description: "Batatas fritas crocantes e douradas",
      },
      {
        name: "Onion Rings",
        price: 15.90,
        category: "Acompanhamentos",
        imageUrl: "🧅",
        description: "Anéis de cebola empanados e fritos",
      },
      {
        name: "Salada Caesar",
        price: 18.90,
        category: "Acompanhamentos",
        imageUrl: "🥗",
        description: "Alface romana, croutons, parmesão e molho caesar",
      },
      {
        name: "Arroz e Feijão",
        price: 8.90,
        category: "Acompanhamentos",
        imageUrl: "🍚",
        description: "Arroz branco e feijão carioca temperado",
      },
      {
        name: "Mandioca Frita",
        price: 14.90,
        category: "Acompanhamentos",
        imageUrl: "🥔",
        description: "Mandioca dourada e crocante",
      },
      {
        name: "Polenta Frita",
        price: 13.90,
        category: "Acompanhamentos",
        imageUrl: "🌽",
        description: "Polenta cremosa por dentro e crocante por fora",
      },
      
      // Bebidas
      {
        name: "Refrigerante",
        price: 6.90,
        category: "Bebidas",
        imageUrl: "🥤",
        description: "Refrigerante gelado 350ml",
      },
      {
        name: "Suco Natural",
        price: 8.90,
        category: "Bebidas",
        imageUrl: "🧃",
        description: "Suco natural de frutas 400ml",
      },
      {
        name: "Água Mineral",
        price: 4.90,
        category: "Bebidas",
        imageUrl: "💧",
        description: "Água mineral sem gás 500ml",
      },
      {
        name: "Cerveja",
        price: 12.90,
        category: "Bebidas",
        imageUrl: "🍺",
        description: "Cerveja gelada long neck 355ml",
      },
      {
        name: "Café Expresso",
        price: 5.90,
        category: "Bebidas",
        imageUrl: "☕",
        description: "Café expresso tradicional",
      },
      {
        name: "Cappuccino",
        price: 8.90,
        category: "Bebidas",
        imageUrl: "☕",
        description: "Cappuccino cremoso com canela",
      },
      {
        name: "Milkshake",
        price: 15.90,
        category: "Bebidas",
        imageUrl: "🥤",
        description: "Milkshake cremoso - sabores: chocolate, morango ou baunilha",
      },
      
      // Sobremesas
      {
        name: "Pudim de Leite",
        price: 14.90,
        category: "Sobremesas",
        imageUrl: "🍮",
        description: "Pudim cremoso com calda de caramelo",
      },
      {
        name: "Brigadeiro Gourmet",
        price: 8.90,
        category: "Sobremesas",
        imageUrl: "🍫",
        description: "Brigadeiro artesanal com granulado belga",
      },
      {
        name: "Sorvete",
        price: 12.90,
        category: "Sobremesas",
        imageUrl: "🍨",
        description: "Sorvete artesanal - sabores variados",
      },
      {
        name: "Torta de Chocolate",
        price: 16.90,
        category: "Sobremesas",
        imageUrl: "🍰",
        description: "Fatia de torta de chocolate com cobertura",
      },
      {
        name: "Cheesecake",
        price: 18.90,
        category: "Sobremesas",
        imageUrl: "🍰",
        description: "Cheesecake cremoso com calda de frutas vermelhas",
      },
      {
        name: "Açaí na Tigela",
        price: 22.90,
        category: "Sobremesas",
        imageUrl: "🍇",
        description: "Açaí cremoso com granola, banana e mel",
      },
      {
        name: "Petit Gateau",
        price: 19.90,
        category: "Sobremesas",
        imageUrl: "🍫",
        description: "Bolinho de chocolate quente com sorvete de baunilha",
      },
      
      // Entradas
      {
        name: "Bruschetta",
        price: 16.90,
        category: "Entradas",
        imageUrl: "🍞",
        description: "Pão italiano com tomate, manjericão e azeite",
      },
      {
        name: "Bolinho de Bacalhau",
        price: 24.90,
        category: "Entradas",
        imageUrl: "🐟",
        description: "Bolinhos crocantes de bacalhau com molho tártaro",
      },
      {
        name: "Coxinha de Frango",
        price: 8.90,
        category: "Entradas",
        imageUrl: "🍗",
        description: "Coxinha tradicional de frango desfiado",
      },
      {
        name: "Pastéis Variados",
        price: 12.90,
        category: "Entradas",
        imageUrl: "🥟",
        description: "Pastéis fritos - queijo, carne ou palmito",
      },
      {
        name: "Pão de Alho",
        price: 9.90,
        category: "Entradas",
        imageUrl: "🧄",
        description: "Pão francês com alho e ervas, gratinado",
      },
    ];

    for (const item of menuItems) {
      await ctx.db.insert("menuItems", item);
    }
  },
});
