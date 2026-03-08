import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, Lock, User, ArrowRight, Sparkles } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(isLogin ? "Welcome back!" : "Account created!");
  };

  return (
    <div className="flex min-h-screen font-sans">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center bg-gradient-to-br from-[hsl(var(--auth-gradient-start))] to-[hsl(var(--auth-gradient-end))]">
        {/* Decorative shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-[hsl(0,0%,100%,0.08)]" />
          <div className="absolute bottom-10 right-10 h-60 w-60 rounded-full bg-[hsl(0,0%,100%,0.06)]" />
          <div className="absolute top-1/3 right-1/4 h-40 w-40 rounded-2xl rotate-45 bg-[hsl(0,0%,100%,0.05)]" />
        </div>

        <div className="relative z-10 max-w-md px-12 text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-[hsl(0,0%,100%,0.15)] px-5 py-2.5 text-sm font-medium text-[hsl(0,0%,100%)]">
            <Sparkles className="h-4 w-4" />
            Start building today
          </div>
          <h2 className="font-display text-4xl font-bold leading-tight text-[hsl(0,0%,100%)]">
            Your next big idea starts here.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-[hsl(0,0%,100%,0.8)]">
            Join thousands of creators who are turning their vision into reality.
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex w-full items-center justify-center px-6 lg:w-1/2">
        <div className="w-full max-w-[420px] animate-fade-up">
          <div className="mb-10">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
              {isLogin ? "Welcome back" : "Create account"}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {isLogin
                ? "Enter your credentials to continue"
                : "Fill in your details to get started"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Full name
                </Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 rounded-xl border-border bg-card pl-11 text-foreground shadow-sm transition-shadow placeholder:text-muted-foreground focus-visible:ring-primary/30 focus-visible:shadow-md"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-xl border-border bg-card pl-11 text-foreground shadow-sm transition-shadow placeholder:text-muted-foreground focus-visible:ring-primary/30 focus-visible:shadow-md"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                {isLogin && (
                  <button
                    type="button"
                    className="text-xs font-medium text-primary hover:underline underline-offset-4"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-xl border-border bg-card pl-11 text-foreground shadow-sm transition-shadow placeholder:text-muted-foreground focus-visible:ring-primary/30 focus-visible:shadow-md"
                  minLength={6}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="mt-2 h-12 w-full rounded-xl bg-primary font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 hover:brightness-110"
            >
              {isLogin ? "Sign in" : "Create account"}
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="font-semibold text-primary underline-offset-4 hover:underline"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>

          <p className="mt-8 text-center text-xs leading-relaxed text-muted-foreground">
            By continuing, you agree to our{" "}
            <span className="underline underline-offset-2 cursor-pointer">Terms of Service</span>{" "}
            and{" "}
            <span className="underline underline-offset-2 cursor-pointer">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
