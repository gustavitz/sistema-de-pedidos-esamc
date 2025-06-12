import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  menuItems: defineTable({
    name: v.string(),
    price: v.number(),
    category: v.string(),
    imageUrl: v.string(),
    description: v.string(),
  }),
  
  orders: defineTable({
    customerName: v.string(),
    items: v.array(v.object({
      menuItemId: v.id("menuItems"),
      quantity: v.number(),
      name: v.string(),
      price: v.number(),
    })),
    total: v.number(),
    status: v.union(v.literal("pendente"), v.literal("preparando"), v.literal("pronto"), v.literal("entregue")),
    orderNumber: v.number(),
  }).index("by_status", ["status"])
    .index("by_order_number", ["orderNumber"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
