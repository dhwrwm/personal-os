"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";

import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

type AuthMode = "login" | "signup";

type AuthFormProps = {
  mode: AuthMode;
};

const FORM_COPY: Record<
  AuthMode,
  {
    title: string;
    description: string;
    submitLabel: string;
    alternateLabel: string;
    alternateHref: string;
  }
> = {
  login: {
    title: "Welcome back",
    description: "Sign in to access your workspace and items.",
    submitLabel: "Log In",
    alternateLabel: "Need an account? Sign up",
    alternateHref: "/signup",
  },
  signup: {
    title: "Create your account",
    description: "Start tracking your items with a personal workspace.",
    submitLabel: "Sign Up",
    alternateLabel: "Already have an account? Log in",
    alternateHref: "/login",
  },
};

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const copy = FORM_COPY[mode];

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const response =
      mode === "signup"
        ? await authClient.signUp.email({
            name,
            email,
            password,
            callbackURL: "/",
          })
        : await authClient.signIn.email({
            email,
            password,
            callbackURL: "/",
          });

    if (response.error) {
      setError(response.error.message ?? "Authentication failed");
      setIsSubmitting(false);
      return;
    }

    startTransition(() => {
      router.replace("/");
      router.refresh();
    });
  };

  return (
    <Card className="w-full max-w-md border-border/60 p-8 shadow-sm">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">{copy.title}</h1>
        <p className="text-sm text-muted-foreground">{copy.description}</p>
      </div>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        {mode === "signup" ? (
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="name">
              Name
            </label>
            <Input
              id="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ada Lovelace"
              required
            />
          </div>
        ) : null}

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="email">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 8 characters"
              minLength={8}
              required
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {error ? (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}

        <Button className="w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Please wait..." : copy.submitLabel}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link className="font-medium text-foreground underline-offset-4 hover:underline" href={copy.alternateHref}>
          {copy.alternateLabel}
        </Link>
      </p>
    </Card>
  );
}
