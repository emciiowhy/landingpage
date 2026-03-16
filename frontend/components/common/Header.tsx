import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/common/ThemeToggle";

export function Header() {
  return (
    <header className="border-b border-gray-800 py-5">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div>
            <h1 className="font-bold">Mc Zaldy Yap</h1>
          </div>
          {/* Navigations */}
          <nav>
            <ul className="flex items-center gap-6">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/projects">Projects</Link></li>
              <li><Link href="/pricing">Pricing</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
              <li><Link href="/blog">Blogs</Link></li>
            </ul>
          </nav>
          {/* Buttons */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/contact">
              <Button>Contact</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
