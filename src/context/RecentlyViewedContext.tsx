import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

interface RecentlyViewedContextType {
  recentIds: number[];
  addRecentlyViewed: (id: number) => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

const MAX_RECENT = 8;

export const RecentlyViewedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recentIds, setRecentIds] = useState<number[]>(() => {
    try {
      const raw = localStorage.getItem("recentlyViewed");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("recentlyViewed", JSON.stringify(recentIds));
    } catch {
      // no-op if storage is unavailable
    }
  }, [recentIds]);

  const value = useMemo<RecentlyViewedContextType>(
    () => ({
      recentIds,
      addRecentlyViewed: (id: number) => {
        setRecentIds((prev) => [id, ...prev.filter((existingId) => existingId !== id)].slice(0, MAX_RECENT));
      },
    }),
    [recentIds],
  );

  return <RecentlyViewedContext.Provider value={value}>{children}</RecentlyViewedContext.Provider>;
};

export const useRecentlyViewed = () => {
  const context = useContext(RecentlyViewedContext);
  if (!context) {
    throw new Error("useRecentlyViewed must be used within RecentlyViewedProvider");
  }
  return context;
};
