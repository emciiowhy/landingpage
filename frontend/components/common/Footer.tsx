import Link from "next/link";
import { Github, Linkedin, Facebook, Mail, Phone } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight">Mc Zaldy Yap</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Professional Programmer & Video Editor based in Cebu City, Philippines. 
              Available for remote collaboration worldwide.
            </p>
            <div className="flex space-x-4 pt-2">
              <Link href="https://github.com/emciiowhy" target="_blank" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github className="h-5 w-5" />
              </Link>
              <Link href="https://linkedin.com/in/emciiowhy" target="_blank" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="https://facebook.com/mckiieeyy1107" target="_blank" className="text-muted-foreground hover:text-foreground transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Navigation</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-foreground transition-colors">Home</Link></li>
              <li><Link href="/projects" className="hover:text-foreground transition-colors">Experience</Link></li>
              <li><Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
              <li><Link href="/faq" className="hover:text-foreground transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Blog/Resources */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Insights</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/blog" className="hover:text-foreground transition-colors">Next.js Development</Link></li>
              <li><Link href="/blog" className="hover:text-foreground transition-colors">React Best Practices</Link></li>
              <li><Link href="/blog" className="hover:text-foreground transition-colors">UI Design Principles</Link></li>
              <li><Link href="/blog" className="hover:text-foreground transition-colors">Motion Graphics Tips</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Get in Touch</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <a href="tel:+639155152314" className="hover:text-foreground transition-colors">+63 915 515 2314</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:mcmcyap07@gmail.com" className="hover:text-foreground transition-colors">mcmcyap07@gmail.com</a>
              </li>
              <li className="flex items-center gap-2 text-emerald-600 font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Cebu City, PH
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {currentYear} Mc Zaldy Yap. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with <span className="text-foreground font-medium">Next.js</span>, <span className="text-foreground font-medium">Tailwind</span> & <span className="text-foreground font-medium">Framer Motion</span>.
          </p>
        </div>
      </div>
    </footer>
  );
}