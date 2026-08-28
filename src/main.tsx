import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { CartProvider } from "./context/CartContext";
import { OrderProvider } from "./context/OrderContext";
import { WishlistProvider } from "./context/WishlistContext";
import { RecentlyViewedProvider } from "./context/RecentlyViewedContext";
import { AuthProvider } from "./context/AuthContext";

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <OrderProvider>
          <WishlistProvider>
            <RecentlyViewedProvider>
              <App />
            </RecentlyViewedProvider>
          </WishlistProvider>
        </OrderProvider>
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);
