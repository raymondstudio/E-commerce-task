import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Search, Menu, Sun, Moon, Heart, UserRound, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { useTheme } from "@/hooks/useTheme";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Header = () => {
  const { cartItems } = useCart();
  const { wishlistIds } = useWishlist();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const { theme, toggleTheme } = useTheme();

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = query.trim();
    navigate(trimmed ? `/shop?q=${encodeURIComponent(trimmed)}` : "/shop");
    setIsMobileMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    toast({ title: "Signed out", description: "You have been signed out." });
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/90 backdrop-blur-xl">
      <div className="border-b border-border/60 bg-[linear-gradient(120deg,hsl(var(--primary))/0.92,hsl(var(--accent))/0.75)] text-primary-foreground">
        <p className="container mx-auto px-4 py-2 text-center text-xs sm:text-sm">
          New season drop: free shipping for orders over $100
        </p>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsMobileMenuOpen((v) => !v)}>
              <Menu className="h-5 w-5" />
            </Button>
            <Link to="/" className="text-2xl font-semibold tracking-tight">
              Sendo Atelier
            </Link>
            <nav className="hidden lg:flex gap-6">
              <Link to="/" className="text-sm font-medium transition-colors hover:text-accent">
                Home
              </Link>
              <Link to="/shop" className="text-sm font-medium transition-colors hover:text-accent">
                Shop
              </Link>
              <Link to="/orders" className="text-sm font-medium transition-colors hover:text-accent">
                Orders
              </Link>
              <Link to="/about" className="text-sm font-medium transition-colors hover:text-accent">
                About
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <form onSubmit={handleSearch} className="hidden md:flex items-center relative">
              <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-9 w-64"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </form>

            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>

            <Link to="/shop?wishlist=true">
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="h-5 w-5" />
                {wishlistIds.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 min-w-5 rounded-full bg-primary px-1 text-xs text-primary-foreground flex items-center justify-center font-medium">
                    {wishlistIds.length}
                  </span>
                )}
              </Button>
            </Link>

            {user ? (
              <Button variant="ghost" size="icon" onClick={handleSignOut} title="Sign out">
                <LogOut className="h-5 w-5" />
              </Button>
            ) : (
              <Link to="/auth">
                <Button variant="ghost" size="icon" title="Sign in">
                  <UserRound className="h-5 w-5" />
                </Button>
              </Link>
            )}

            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 min-w-5 rounded-full bg-accent px-1 text-xs text-accent-foreground flex items-center justify-center font-medium">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border/60 py-4 space-y-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-9"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </form>

            <nav className="grid grid-cols-2 gap-2">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="rounded-md border p-2 text-sm font-medium">
                Home
              </Link>
              <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="rounded-md border p-2 text-sm font-medium">
                Shop
              </Link>
              <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)} className="rounded-md border p-2 text-sm font-medium">
                Orders
              </Link>
              <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="rounded-md border p-2 text-sm font-medium">
                About
              </Link>
              <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)} className="rounded-md border p-2 text-sm font-medium">
                {user ? "Account" : "Sign In"}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
