"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/jobs", label: "Jobs" },
];

function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg font-semibold text-foreground">
            Personal OS
          </Link>
          <nav className="hidden items-center gap-2 md:flex">
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
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
}

export default Header;
