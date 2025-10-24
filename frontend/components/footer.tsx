// components/footer.tsx
// Footer that appears at the bottom of every page

import Link from 'next/link';
import { Github, Linkedin, Twitter, Facebook } from 'lucide-react';

export default function Footer() {
  // Current year for copyright
  const currentYear = new Date().getFullYear();

  // Page links organized in sections - Changed Projects to Experience
  const pageLinks = [
    { href: '/', label: 'Home' },
    { href: '/projects', label: 'Experience' }, // Changed from "Projects"
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  // Resource links - Update these with your actual links
  const resourceLinks = [
    { href: 'https://github.com/yourusername', label: 'GitHub Boilerplates' },
    { href: 'https://codepen.io/yourusername', label: 'CodePen Examples' },
    { href: 'https://developer.mozilla.org', label: 'MDN Web Docs' },
  ];

  // Social media links - Update with your actual profiles
  const socialLinks = [
    { 
      href: 'https://www.linkedin.com/in/emciiowhy/', 
      label: 'LinkedIn',
      icon: Linkedin 
    },
    { 
      href: 'https://github.com/emciiowhy/', 
      label: 'GitHub',
      icon: Github 
    },
    { 
      href: 'https://x.com/emciiowhy07', 
      label: 'Twitter',
      icon: Twitter 
    },
    { 
      href: 'https://www.facebook.com/mckiieeyy1107', 
      label: 'Facebook',
      icon: Facebook 
    },
  ];

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Mc Zaldy Yap
            </h3>
            <p className="text-sm text-gray-600 mb-4">Software Developer</p>
            <p className="text-sm text-gray-500 flex items-center">
              <span className="mr-2">📍</span>
              Cebu, Philippines
            </p>
          </div>

          {/* Pages Section */}
          <div className="col-span-1">
            <h4 className="text-sm font-semibold text-gray-900 uppercase mb-4">
              Pages
            </h4>
            <ul className="space-y-2">
              {pageLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Section */}
          <div className="col-span-1">
            <h4 className="text-sm font-semibold text-gray-900 uppercase mb-4">
              Resources
            </h4>
            <ul className="space-y-2">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Section */}
          <div className="col-span-1">
            <h4 className="text-sm font-semibold text-gray-900 uppercase mb-4">
              Connect
            </h4>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-sm text-gray-500">
            © {currentYear} Mc Zaldy Yap. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}