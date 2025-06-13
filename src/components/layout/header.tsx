"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Store, LayoutGrid, Shapes, HistoryIcon } from "lucide-react"
import { CartSheet } from "@/components/cart/cart-sheet"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/", label: "Products", icon: LayoutGrid },
  { href: "/categories", label: "Categories", icon: Shapes },
  { href: "/orders", label: "Orders", icon: HistoryIcon },
]

export function Header() {
  const pathname = usePathname()

  return (
    <header
      className="sticky top-0 z-50 w-full border-b"
      style={{
        backgroundColor: "hsl(var(--brand-secondary))",
        color: "hsl(var(--brand-secondary-foreground))",
        borderColor: "hsl(var(--brand-secondary))", // Match border to bg
      }}
    >
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* === Left Group: Logo & Desktop Navigation === */}
        <div className="hidden items-center gap-6 md:flex">
          <Link href="/" className="flex items-center gap-2">
            <Store className="h-6 w-6 text-primary" /> {/* Orange Store Icon */}
            <span className="font-bold text-brand-secondary-foreground">E-Store</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-2 py-1 transition-colors hover:bg-white/10", // Lighter hover for dark bg
                    isActive
                      ? "font-semibold text-primary bg-white/20" // Active link with orange text and slightly more prominent bg
                      : "text-brand-secondary-foreground/80 hover:text-brand-secondary-foreground", // Muted text for inactive
                  )}
                >
                  <link.icon
                    className={cn("h-4 w-4", isActive ? "text-primary" : "text-brand-secondary-foreground/80")}
                  />
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* === Mobile Menu Trigger (replaces the left group on mobile) === */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-brand-secondary-foreground hover:bg-white/10">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open main menu</span>
              </Button>
            </SheetTrigger>
            {/* Mobile sheet content will use default --background and --foreground, which is fine */}
            <SheetContent side="left" className="w-[300px] p-0">
              <div className="flex h-full flex-col">
                <div className="border-b p-4" style={{ backgroundColor: "hsl(var(--brand-secondary))" }}>
                  <Link href="/" className="flex items-center gap-2">
                    <Store className="h-6 w-6 text-primary" />
                    <span className="text-lg font-bold text-brand-secondary-foreground">E-Store</span>
                  </Link>
                </div>
                <nav className="flex flex-1 flex-col gap-1 p-4 bg-background text-foreground">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href
                    return (
                      <SheetClose asChild key={link.href}>
                        <Link
                          href={link.href}
                          className={cn(
                            "flex items-center gap-3 rounded-md px-3 py-2.5 text-base transition-colors hover:text-foreground hover:bg-muted",
                            isActive ? "font-semibold text-primary bg-muted" : "text-muted-foreground",
                          )}
                        >
                          <link.icon className={cn("h-5 w-5", isActive ? "text-primary" : "")} />
                          {link.label}
                        </Link>
                      </SheetClose>
                    )
                  })}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* === Right Group: Cart Icon === */}
        <div className="flex items-center">
          {/* CartSheet trigger button needs to be styled for dark background */}
          <CartSheet />
        </div>
      </div>
    </header>
  )
}
