import { Facebook, Instagram, Twitter, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

export default function About() {
  const { toast } = useToast();

  return (
    <div className="min-h-screen">
      <Header />

      <div className="container mx-auto px-4 py-14 md:py-16">
        <section className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About <span className="text-primary">Sendo Atelier</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We are building a fashion experience centered on craftsmanship, quality, and intentional curation.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <Card className="p-6 h-full border-border/70 shadow-sm hover:shadow-md transition-shadow">
            <CardContent>
              <h2 className="text-2xl font-semibold mb-3">Our Mission</h2>
              <p className="text-muted-foreground">
                To make premium design accessible through products that balance style, utility, and long-term value.
              </p>
            </CardContent>
          </Card>
          <Card className="p-6 h-full border-border/70 shadow-sm hover:shadow-md transition-shadow">
            <CardContent>
              <h2 className="text-2xl font-semibold mb-3">What We Do</h2>
              <p className="text-muted-foreground">
                We curate cross-category essentials from trusted makers and present them with a clean, frictionless shopping flow.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-4">Get in Touch</h2>
          <p className="text-muted-foreground mb-8">Have a question or collaboration request? Send us a message.</p>

          <Card className="p-6">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                toast({ title: "Message sent", description: "Thanks for reaching out. We will reply soon." });
              }}
              className="space-y-5"
            >
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Jane Doe" required />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="you@example.com" required />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Type your message..." required />
              </div>
              <Button type="submit" className="w-full py-3 text-base rounded-full">
                Send Message
              </Button>
            </form>
          </Card>

          <div className="flex justify-center gap-6 mt-10 text-muted-foreground">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
              <Facebook className="w-6 h-6" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
              <Instagram className="w-6 h-6" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
              <Twitter className="w-6 h-6" />
            </a>
            <a href="mailto:hello@sendoatelier.com" className="hover:text-primary transition-colors">
              <Mail className="w-6 h-6" />
            </a>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
