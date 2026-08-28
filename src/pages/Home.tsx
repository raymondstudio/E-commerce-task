import { FormEvent, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Truck, ShieldCheck, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProductCarousel from "@/components/ProductCarousel";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import heroBanner from "@/assets/hero-banner.jpg";
import { categories, featuredProducts, products } from "@/data/products";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";
import { useToast } from "@/hooks/use-toast";
import { subscribeToNewsletter } from "@/lib/backend";
import { useAuth } from "@/context/AuthContext";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Fashion Enthusiast",
    content: "The product quality is consistently premium and the styling direction feels intentional every season.",
  },
  {
    name: "Michael Chen",
    role: "Designer",
    content: "A clean shopping experience with strong curation. Fast delivery and no friction at checkout.",
  },
  {
    name: "Emma Williams",
    role: "Lifestyle Blogger",
    content: "Sendo Atelier has become my go-to for statement essentials that still work every day.",
  },
];

const Home = () => {
  const [email, setEmail] = useState("");
  const { recentIds } = useRecentlyViewed();
  const { toast } = useToast();
  const { user } = useAuth();

  const recentlyViewedProducts = useMemo(
    () =>
      recentIds
        .map((id) => products.find((product) => product.id === id))
        .filter((product): product is (typeof products)[number] => Boolean(product)),
    [recentIds],
  );

  const handleSubscribe = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      toast({ title: "Invalid email", description: "Enter a valid email address to subscribe." });
      return;
    }

    const result = await subscribeToNewsletter(normalized, user?.id);
    if (!result.ok) {
      toast({ title: "Subscription failed", description: result.error ?? "Could not subscribe right now." });
      return;
    }

    setEmail("");
    toast({ title: "Subscribed", description: "You are now subscribed to product drops and studio updates." });
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_500px_at_80%_-10%,hsl(var(--accent))/0.18,transparent_55%),radial-gradient(900px_300px_at_0%_10%,hsl(var(--primary))/0.2,transparent_45%)]">
      <Header />

      <section className="container mx-auto px-4 py-10 md:py-16">
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/75 backdrop-blur-sm p-8 md:p-14">
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
          <img src={heroBanner} alt="Editorial collection" className="absolute inset-0 h-full w-full object-cover" />
          <div className="relative max-w-2xl">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs font-medium">
              <Sparkles className="h-3.5 w-3.5" />
              Editorial Spring Collection
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight mb-6">Objects of style, built to last.</h1>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl">
              Discover a curated mix of fashion essentials and elevated accessories designed around longevity and detail.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link to="/shop">
                  Explore Collection
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/about">Our Story</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-border/70 bg-card/75 p-5">
            <Truck className="h-5 w-5 mb-3 text-primary" />
            <p className="font-medium">Fast Shipping</p>
            <p className="text-sm text-muted-foreground">Dispatch within 24 hours for in-stock items.</p>
          </div>
          <div className="rounded-2xl border border-border/70 bg-card/75 p-5">
            <RefreshCcw className="h-5 w-5 mb-3 text-primary" />
            <p className="font-medium">30-Day Returns</p>
            <p className="text-sm text-muted-foreground">Easy returns on all eligible purchases.</p>
          </div>
          <div className="rounded-2xl border border-border/70 bg-card/75 p-5">
            <ShieldCheck className="h-5 w-5 mb-3 text-primary" />
            <p className="font-medium">Verified Quality</p>
            <p className="text-sm text-muted-foreground">Curated vendors and premium material standards.</p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-semibold mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => {
            const categoryImage = products.find((product) => product.category === category.id)?.image;
            return (
              <Link
                key={category.id}
                to={`/shop?category=${category.id}`}
                className="group relative overflow-hidden rounded-2xl border border-border/60 aspect-[4/5]"
              >
                {categoryImage && (
                  <img
                    src={categoryImage}
                    alt={category.label}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-5">
                  <h3 className="text-white text-xl font-semibold">{category.label}</h3>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <ProductCarousel products={featuredProducts} title="Featured Picks" />
      </section>

      {recentlyViewedProducts.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <ProductCarousel products={recentlyViewedProducts} title="Recently Viewed" />
        </section>
      )}

      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-semibold mb-8">Customer Notes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.name} className="rounded-2xl border border-border/70 bg-card/75 p-6">
              <p className="text-muted-foreground leading-relaxed mb-5">"{testimonial.content}"</p>
              <div>
                <p className="font-medium">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="rounded-3xl border border-border/70 bg-[linear-gradient(130deg,hsl(var(--primary))/0.92,hsl(var(--accent))/0.72)] p-8 md:p-12 text-primary-foreground">
          <h2 className="text-3xl font-semibold mb-3">Studio Newsletter</h2>
          <p className="text-primary-foreground/90 mb-6 max-w-xl">
            Receive curated style edits, exclusive offers, and first access to new drops.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-lg">
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-background text-foreground"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <Button type="submit" variant="secondary">
              Subscribe
            </Button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
