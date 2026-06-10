"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { startTransition, useState } from "react";
import { LogOutIcon, MenuIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/jobs", label: "Jobs" },
  { href: "/job-alerts", label: "Job Alerts" },
  { href: "/notes", label: "Notes" },
  { href: "/todos", label: "Todos" },
];

function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const showNavigation = Boolean(session);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await authClient.signOut();
    startTransition(() => {
      router.replace("/login");
      router.refresh();
    });
    setIsSigningOut(false);
  };

  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg font-semibold text-foreground">
            Personal OS
          </Link>
          <nav className={cn("hidden items-center gap-2 md:flex", !showNavigation && "hidden")}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                  pathname === item.href && "bg-muted font-medium text-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {session ? (
            <>
              <div className="hidden text-right md:block">
                <p className="text-sm font-medium text-foreground">
                  {session.user.name || session.user.email}
                </p>
                <p className="text-xs text-muted-foreground">
                  {session.user.email}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="hidden md:inline-flex"
              >
                <LogOutIcon className="size-4" />
                {isSigningOut ? "Signing out..." : "Sign Out"}
              </Button>
            </>
          ) : isPending ? (
            <div className="text-sm text-muted-foreground">Loading...</div>
          ) : (
            <>
              <Button asChild variant="ghost" className="hidden md:inline-flex">
                <Link href="/login">Log In</Link>
              </Button>
              <Button asChild className="hidden md:inline-flex">
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}

          {showNavigation ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label="Open navigation menu"
                >
                  <MenuIcon />
                </Button>
              </DialogTrigger>
              <DialogContent className="top-0 left-auto right-0 h-dvh max-w-[280px] translate-x-0 translate-y-0 rounded-none border-l sm:max-w-[320px]">
                <DialogHeader>
                  <DialogTitle>Navigation</DialogTitle>
                </DialogHeader>
                <div className="pt-2">
                  <p className="text-sm font-medium text-foreground">
                    {session?.user.name || session?.user.email}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {session?.user.email}
                  </p>
                </div>
                <nav className="flex flex-col gap-2 pt-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                        pathname === item.href &&
                          "bg-muted font-medium text-foreground",
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
                <Button
                  variant="outline"
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="mt-4"
                >
                  <LogOutIcon className="size-4" />
                  {isSigningOut ? "Signing out..." : "Sign Out"}
                </Button>
              </DialogContent>
            </Dialog>
          ) : null}
        </div>
      </div>
    </header>
  );
}

export default Header;
