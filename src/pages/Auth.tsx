import { FormEvent, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { Github } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { isSupabaseConfigured } from "@/lib/supabase";

const Auth = () => {
  const { user, loading, signInWithOAuth, signInWithPassword, signUpWithPassword } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [submitting, setSubmitting] = useState(false);

  const next = new URLSearchParams(location.search).get("next") || "/";

  if (!loading && user) {
    return <Navigate to={next} replace />;
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);

    const action = mode === "signin" ? signInWithPassword : signUpWithPassword;
    const { error } = await action(email, password);

    if (error) {
      toast({ title: "Auth error", description: error });
      setSubmitting(false);
      return;
    }

    toast({
      title: mode === "signin" ? "Welcome back" : "Check your email",
      description: mode === "signin" ? "Signed in successfully." : "Confirm your email to complete sign up.",
    });
    setSubmitting(false);
  };

  const handleOAuth = async (provider: "google" | "github") => {
    const { error } = await signInWithOAuth(provider);
    if (error) {
      toast({ title: "OAuth error", description: error });
    }
  };

  return (
    <div className="min-h-screen">
      <Header />

      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-semibold">{mode === "signin" ? "Sign In" : "Create Account"}</h1>
            <p className="text-muted-foreground mt-2">
              {mode === "signin" ? "Sign in to manage orders and wishlist." : "Create an account to save your progress."}
            </p>
            {!isSupabaseConfigured && (
              <p className="mt-2 text-sm text-destructive">Supabase env vars are missing. Add them in your `.env` file.</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={() => handleOAuth("google")}>
              Google
            </Button>
            <Button variant="outline" onClick={() => handleOAuth("github")}>
              <Github className="h-4 w-4 mr-2" />
              GitHub
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Please wait..." : mode === "signin" ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <p className="text-sm text-center text-muted-foreground">
            {mode === "signin" ? "Need an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              className="text-primary underline"
              onClick={() => setMode((prev) => (prev === "signin" ? "signup" : "signin"))}
            >
              {mode === "signin" ? "Sign up" : "Sign in"}
            </button>
          </p>

          <p className="text-xs text-center text-muted-foreground">
            By continuing, you agree to our <Link to="/about" className="underline">terms</Link>.
          </p>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default Auth;
