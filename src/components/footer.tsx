"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();

  const navigationLinks = [
    { name: "Home", href: "/" },
    { name: "Profile", href: "/profile" },
    { name: "About Us", href: "/about" },
    { name: "Help", href: "/help" },
    { name: "Terms of Service", href: "/terms" },
  ];

  return (
    <footer
      className={`w-full ${
        pathname !== "/" && "border-t"
      } py-5 border-gray-200`}
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center space-y-6">
          {/* Logo/Name */}
          <div className="text-xl font-semibold text-gray-800">Name</div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            {navigationLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Copyright */}
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} name. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
