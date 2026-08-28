import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

interface WishlistContextType {
  wishlistIds: number[];
  loading: boolean;
  isWishlisted: (id: number) => boolean;
  toggleWishlist: (id: number) => Promise<{ ok: boolean; error: string | null }>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadWishlist = async () => {
      if (!user || !supabase) {
        setWishlistIds([]);
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from("wishlist")
        .select("product_id")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setWishlistIds(data.map((item) => item.product_id));
      }
      setLoading(false);
    };

    loadWishlist();
  }, [user]);

  const value = useMemo<WishlistContextType>(
    () => ({
      wishlistIds,
      loading,
      isWishlisted: (id: number) => wishlistIds.includes(id),
      toggleWishlist: async (id: number) => {
        if (!user) {
          return { ok: false, error: "Please sign in to use wishlist." };
        }
        if (!supabase) {
          return { ok: false, error: "Supabase is not configured." };
        }

        const currentlyWishlisted = wishlistIds.includes(id);

        if (currentlyWishlisted) {
          const { error } = await supabase.from("wishlist").delete().eq("user_id", user.id).eq("product_id", id);
          if (error) return { ok: false, error: error.message };
          setWishlistIds((prev) => prev.filter((itemId) => itemId !== id));
          return { ok: true, error: null };
        }

        const { error } = await supabase.from("wishlist").insert({ user_id: user.id, product_id: id });
        if (error) return { ok: false, error: error.message };
        setWishlistIds((prev) => [...prev, id]);
        return { ok: true, error: null };
      },
    }),
    [loading, user, wishlistIds],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
};
