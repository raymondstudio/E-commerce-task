import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { categories, products } from "@/data/products";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("popular");
  const { wishlistIds } = useWishlist();
  const { user } = useAuth();

  const query = searchParams.get("q")?.trim().toLowerCase() ?? "";
  const onlyWishlist = searchParams.get("wishlist") === "true";

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedCategories([categoryParam]);
    }
  }, [searchParams]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (selectedCategories.length === 1) {
      params.set("category", selectedCategories[0]);
    } else {
      params.delete("category");
    }
    setSearchParams(params, { replace: true });
  }, [selectedCategories, searchParams, setSearchParams]);

  const filteredProducts = useMemo(
    () =>
      products
        .filter((product) => {
          const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
          const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
          const matchesQuery =
            query.length === 0 ||
            product.name.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query);
          const matchesWishlist = !onlyWishlist || (user ? wishlistIds.includes(product.id) : false);
          return matchesPrice && matchesCategory && matchesQuery && matchesWishlist;
        })
        .sort((a, b) => {
          if (sortBy === "price-low") return a.price - b.price;
          if (sortBy === "price-high") return b.price - a.price;
          if (sortBy === "new") return b.id - a.id;
          return b.reviews - a.reviews;
        }),
    [onlyWishlist, priceRange, query, selectedCategories, sortBy, user, wishlistIds],
  );

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    );
  };

  return (
    <div className="min-h-screen">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 rounded-2xl border border-border/70 bg-card/70 p-6">
          <h1 className="text-3xl md:text-4xl font-semibold mb-2">Curated Collection</h1>
          <p className="text-muted-foreground">
            Showing {filteredProducts.length} of {products.length} products
            {query ? ` for "${query}"` : ""}
            {onlyWishlist ? " in your wishlist" : ""}
          </p>
        </div>

        <div className="flex items-center justify-between mb-8">
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
          </Button>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="new">Newest</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-8">
          <aside className={`${showFilters ? "block" : "hidden"} lg:block w-full lg:w-72 flex-shrink-0`}>
            <div className="sticky top-28 space-y-6 rounded-2xl border border-border/70 bg-card/80 p-6">
              <div>
                <h3 className="font-semibold mb-4">Price Range</h3>
                <Slider min={0} max={500} step={10} value={priceRange} onValueChange={setPriceRange} className="mb-4" />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Categories</h3>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={category.id}
                        checked={selectedCategories.includes(category.id)}
                        onCheckedChange={() => toggleCategory(category.id)}
                      />
                      <label htmlFor={category.id} className="text-sm font-medium leading-none cursor-pointer">
                        {category.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setPriceRange([0, 500]);
                  setSelectedCategories([]);
                  setShowFilters(false);
                }}
              >
                Reset Filters
              </Button>
            </div>
          </aside>

          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product, index) => (
                <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.04}s` }}>
                  <ProductCard {...product} />
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <p className="text-xl text-muted-foreground">
                  {onlyWishlist && !user ? "Sign in to view your wishlist." : "No products found matching your filters."}
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setPriceRange([0, 500]);
                    setSelectedCategories([]);
                    const params = new URLSearchParams(searchParams);
                    params.delete("q");
                    params.delete("wishlist");
                    setSearchParams(params, { replace: true });
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Shop;
