import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Sendo Atelier</h3>
            <p className="text-sm text-muted-foreground">
              Curated fashion and lifestyle products for modern daily wear.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/shop" className="text-muted-foreground hover:text-accent transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-muted-foreground hover:text-accent transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-muted-foreground hover:text-accent transition-colors">
                  Sale
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="#" className="text-muted-foreground hover:text-accent transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-accent transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-accent transition-colors">
                  Returns
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="#" className="text-muted-foreground hover:text-accent transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-accent transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-accent transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {year} Sendo Atelier. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
