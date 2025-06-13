import Link from "next/link"
import { Store, Twitter, Github, Facebook } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()
  return (
    <footer
      className="border-t"
      style={{
        backgroundColor: "hsl(var(--brand-secondary))",
        color: "hsl(var(--brand-secondary-foreground))",
        borderColor: "hsl(var(--brand-secondary))", // Match border to bg
      }}
    >
      <div className="container py-8 md:py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="flex flex-col gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Store className="h-6 w-6 text-primary" /> {/* Orange Store Icon */}
              <span className="font-bold text-brand-secondary-foreground">E-Store</span>
            </Link>
            <p className="text-sm text-brand-secondary-foreground/80">
              Your one-stop shop for the best products online.
            </p>
          </div>
          <div className="grid gap-1">
            <h3 className="font-semibold text-brand-secondary-foreground">Shop</h3>
            <Link href="/" className="text-sm text-brand-secondary-foreground/80 hover:text-primary transition-colors">
              All Products
            </Link>
            <Link
              href="/categories"
              className="text-sm text-brand-secondary-foreground/80 hover:text-primary transition-colors"
            >
              Categories
            </Link>
          </div>
          <div className="grid gap-1">
            <h3 className="font-semibold text-brand-secondary-foreground">Company</h3>
            <Link href="#" className="text-sm text-brand-secondary-foreground/80 hover:text-primary transition-colors">
              About Us
            </Link>
            <Link href="#" className="text-sm text-brand-secondary-foreground/80 hover:text-primary transition-colors">
              Contact
            </Link>
          </div>
          <div className="grid gap-1">
            <h3 className="font-semibold text-brand-secondary-foreground">Support</h3>
            <Link href="#" className="text-sm text-brand-secondary-foreground/80 hover:text-primary transition-colors">
              FAQ
            </Link>
            <Link href="#" className="text-sm text-brand-secondary-foreground/80 hover:text-primary transition-colors">
              Shipping & Returns
            </Link>
          </div>
        </div>
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t pt-6 border-brand-secondary-foreground/20">
          <p className="text-sm text-brand-secondary-foreground/80">
            &copy; {currentYear} E-Store Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="#"
              aria-label="Twitter"
              className="text-brand-secondary-foreground/80 hover:text-primary transition-colors"
            >
              <Twitter className="h-5 w-5" />
            </Link>
            <Link
              href="#"
              aria-label="GitHub"
              className="text-brand-secondary-foreground/80 hover:text-primary transition-colors"
            >
              <Github className="h-5 w-5" />
            </Link>
            <Link
              href="#"
              aria-label="Facebook"
              className="text-brand-secondary-foreground/80 hover:text-primary transition-colors"
            >
              <Facebook className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
