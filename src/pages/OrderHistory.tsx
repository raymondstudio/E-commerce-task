import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useOrders } from "@/context/OrderContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function OrderHistory() {
  const { orders, loading } = useOrders();

  return (
    <div className="min-h-screen">
      <Header />

      <div className="container mx-auto px-4 py-10 md:py-16">
        <h1 className="text-3xl font-bold mb-8 text-center animate-fade-in">Order History</h1>

        <div className="space-y-8 max-w-4xl mx-auto">
          {loading && <p className="text-center text-muted-foreground">Loading orders...</p>}
          {orders.length === 0 && <p className="text-center text-muted-foreground">You have no orders yet.</p>}

          {orders.map((order, index) => (
            <div key={order.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.08}s` }}>
              <Card className="border-border/70 shadow-sm hover:shadow-md transition-all">
                <CardContent className="p-6 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold">Order ID: {order.id}</h2>
                      <p className="text-sm text-muted-foreground">{order.date}</p>
                    </div>
                    <span
                      className={`mt-2 md:mt-0 inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === "Delivered" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    {order.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex justify-between text-muted-foreground">
                        <span>
                          {item.name} x {item.qty}
                        </span>
                        <span>${(item.price * item.qty).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Payment: {order.paymentMethod}</p>

                  <div className="flex justify-end">
                    <Button variant="outline" className="mt-4 rounded-full">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
