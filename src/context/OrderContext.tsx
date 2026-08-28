import React, { useCallback, createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

export interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

export interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  paymentMethod: string;
  items: OrderItem[];
}

interface CreateOrderInput {
  total: number;
  status: string;
  paymentMethod: string;
  items: OrderItem[];
}

interface OrderContextType {
  orders: Order[];
  loading: boolean;
  addOrder: (order: CreateOrderInput) => Promise<{ ok: boolean; error: string | null }>;
  refreshOrders: () => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const mapRowsToOrders = (
  rows: Array<{
    id: string;
    total: number;
    status: string;
    payment_method: string;
    created_at: string;
    order_items: Array<{ product_name: string; qty: number; price: number }>;
  }>,
): Order[] =>
  rows.map((row) => ({
    id: row.id,
    date: new Date(row.created_at).toLocaleString(),
    total: Number(row.total),
    status: row.status,
    paymentMethod: row.payment_method,
    items: (row.order_items ?? []).map((item) => ({
      name: item.product_name,
      qty: item.qty,
      price: Number(item.price),
    })),
  }));

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshOrders = useCallback(async () => {
    if (!user || !supabase) {
      setOrders([]);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("id,total,status,payment_method,created_at,order_items(product_name,qty,price)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setOrders(mapRowsToOrders(data));
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    refreshOrders();
  }, [refreshOrders]);

  const value = useMemo<OrderContextType>(
    () => ({
      orders,
      loading,
      refreshOrders,
      addOrder: async (order) => {
        if (!user) return { ok: false, error: "Please sign in to place an order." };
        if (!supabase) return { ok: false, error: "Supabase is not configured." };

        const { data: createdOrder, error: orderError } = await supabase
          .from("orders")
          .insert({
            user_id: user.id,
            total: order.total,
            status: order.status,
            payment_method: order.paymentMethod,
          })
          .select("id")
          .single();

        if (orderError || !createdOrder) return { ok: false, error: orderError?.message ?? "Could not create order." };

        const orderItemsPayload = order.items.map((item) => ({
          order_id: createdOrder.id,
          product_name: item.name,
          qty: item.qty,
          price: item.price,
        }));

        const { error: itemsError } = await supabase.from("order_items").insert(orderItemsPayload);
        if (itemsError) return { ok: false, error: itemsError.message };

        await refreshOrders();
        return { ok: true, error: null };
      },
    }),
    [loading, orders, refreshOrders, user],
  );

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error("useOrders must be used within OrderProvider");
  return context;
};
