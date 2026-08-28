import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = +(subtotal * 0.07).toFixed(2);
  const total = +(subtotal + tax).toFixed(2);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-6">
          <h2 className="text-2xl md:text-3xl font-semibold animate-fade-in">Your cart is empty</h2>
          <Link to="/shop">
            <Button className="rounded-full px-6 py-3 text-base">Continue Shopping</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />

      <div className="container mx-auto px-4 py-10 md:py-16 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-3xl font-bold tracking-tight">Shopping Cart</h1>
          <Separator className="my-4" />

          {cartItems.map((item, index) => (
            <div key={item.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.06}s` }}>
              <Card className="flex flex-col md:flex-row items-center justify-between p-4 md:p-6">
                <div className="flex items-center gap-4">
                  <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-xl border" />
                  <div>
                    <h2 className="font-semibold text-lg">{item.name}</h2>
                    <p className="text-muted-foreground">${item.price.toFixed(2)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-4 md:mt-0">
                  <div className="flex items-center border rounded-full overflow-hidden">
                    <Button variant="ghost" size="sm" onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                      -
                    </Button>
                    <span className="px-3">{item.quantity}</span>
                    <Button variant="ghost" size="sm" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                      +
                    </Button>
                  </div>

                  <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                  <Button variant="destructive" size="sm" onClick={() => removeFromCart(item.id)}>
                    Remove
                  </Button>
                </div>
              </Card>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24 p-6">
            <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3 text-muted-foreground">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (7%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg text-foreground">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <Link to="/checkout">
              <Button className="w-full mt-6 rounded-full py-3 text-base font-medium">Proceed to Checkout</Button>
            </Link>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
