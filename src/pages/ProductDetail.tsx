import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Star, ShoppingCart, Heart, Minus, Plus, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductCarousel from "@/components/ProductCarousel";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { featuredProducts, products } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";
import { useToast } from "@/hooks/use-toast";
import NotFound from "./NotFound";

const reviews = [
  {
    id: 1,
    author: "John Doe",
    rating: 5,
    date: "2 weeks ago",
    content: "Excellent quality and fast shipping. Highly recommend!",
  },
  {
    id: 2,
    author: "Jane Smith",
    rating: 5,
    date: "1 month ago",
    content: "Exactly as described and worth every penny.",
  },
  {
    id: 3,
    author: "Mike Johnson",
    rating: 4,
    date: "1 month ago",
    content: "Great product, though shipping took slightly longer than expected.",
  },
];

const ProductDetail = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addRecentlyViewed } = useRecentlyViewed();
  const { toast } = useToast();

  const product = useMemo(() => products.find((item) => item.id === Number(id)), [id]);

  useEffect(() => {
    if (product) {
      addRecentlyViewed(product.id);
    }
  }, [addRecentlyViewed, product]);

  if (!product) {
    return <NotFound />;
  }

  const productImages = [product.image, product.image, product.image, product.image];
  const relatedProducts = featuredProducts.filter((item) => item.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div>
            <div
              className="relative aspect-square mb-4 bg-muted rounded-2xl overflow-hidden cursor-zoom-in group border border-border/70"
              onClick={() => setIsZoomed(!isZoomed)}
            >
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className={`w-full h-full object-cover transition-transform duration-500 ${isZoomed ? "scale-150" : "scale-100"}`}
              />
              <div className="absolute top-4 right-4 bg-black/55 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="h-5 w-5" />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index ? "border-accent" : "border-transparent hover:border-muted-foreground/20"
                  }`}
                >
                  <img src={image} alt={`${product.name} preview ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm uppercase tracking-wide text-muted-foreground mb-2">{product.category}</p>
            <h1 className="text-4xl font-semibold mb-4">{product.name}</h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, index) => (
                  <Star key={index} className={`h-5 w-5 ${index < product.rating ? "fill-accent text-accent" : "text-muted-foreground"}`} />
                ))}
              </div>
              <span className="text-muted-foreground">({product.reviews} reviews)</span>
            </div>

            <div className="text-4xl font-bold mb-8">${product.price.toFixed(2)}</div>
            <p className="text-muted-foreground mb-8 leading-relaxed">{product.description}</p>

            <div className="space-y-6 mb-8">
              <div className="flex items-center gap-4">
                <span className="font-semibold">Quantity:</span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <Button variant="outline" size="icon" onClick={() => setQuantity((value) => value + 1)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  size="lg"
                  className="flex-1"
                  onClick={() => {
                    for (let index = 0; index < quantity; index += 1) {
                      addToCart({ id: product.id, name: product.name, price: product.price, image: product.image });
                    }
                    toast({ title: "Added to cart", description: `${quantity} x ${product.name} added to cart.` });
                  }}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={async () => {
                    const wasWishlisted = isWishlisted(product.id);
                    const result = await toggleWishlist(product.id);
                    if (!result.ok) {
                      toast({ title: "Wishlist error", description: result.error ?? "Could not update wishlist." });
                      return;
                    }
                    toast({
                      title: wasWishlisted ? "Removed from wishlist" : "Added to wishlist",
                      description: product.name,
                    });
                  }}
                >
                  <Heart className={`h-5 w-5 ${isWishlisted(product.id) ? "fill-current" : ""}`} />
                </Button>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4">Key Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-muted-foreground">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mb-20">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
              <TabsTrigger
                value="description"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-6 py-3"
              >
                Description
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-6 py-3"
              >
                Reviews ({product.reviews})
              </TabsTrigger>
              <TabsTrigger
                value="additional"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-6 py-3"
              >
                Additional Info
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="py-8">
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </TabsContent>

            <TabsContent value="reviews" className="py-8">
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b pb-6 last:border-0">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{review.author}</h4>
                        <p className="text-sm text-muted-foreground">{review.date}</p>
                      </div>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, index) => (
                          <Star key={index} className={`h-4 w-4 ${index < review.rating ? "fill-accent text-accent" : "text-muted-foreground"}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-muted-foreground">{review.content}</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="additional" className="py-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Shipping</h4>
                  <p className="text-muted-foreground">Free shipping on orders over $100</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Returns</h4>
                  <p className="text-muted-foreground">30-day return policy</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Warranty</h4>
                  <p className="text-muted-foreground">2-year manufacturer warranty</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Care Instructions</h4>
                  <p className="text-muted-foreground">Wipe clean with soft cloth</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <section>
          <ProductCarousel products={relatedProducts} title="Related Products" />
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
