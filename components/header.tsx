"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { ReserveModal } from "@/components/reserve-modal";

const RESERVE_URL = "https://www.sevenrooms.com/reservations/gdlounge";

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#food", label: "Food" },
  { href: "#cocktails", label: "Cocktails" },
  // { href: "#gallery", label: "Gallery" },
  { href: "/news", label: "News" },
];

import { PrivatePartyModal } from "@/components/private-party-modal";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVipModalOpen, setIsVipModalOpen] = useState(false);
  const [isPrivatePartyModalOpen, setIsPrivatePartyModalOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <Image
              src="/gold-logo.svg"
              alt="GD Lounge"
              width={194}
              height={178}
              className="h-12 w-auto lg:h-16 transition-opacity group-hover:opacity-90"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200 relative group/nav"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover/nav:w-full" />
              </Link>
            ))}
            {/* Private Party Link */}
            <button
              onClick={() => setIsPrivatePartyModalOpen(true)}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200 relative group/nav"
            >
              Private Party
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover/nav:w-full" />
            </button>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              asChild
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6"
            >
              <a href={RESERVE_URL} target="_blank" rel="noopener noreferrer">
                Reserve
              </a>
            </Button>
            <Button
              variant="outline"
              className="border-primary/50 text-primary hover:bg-primary/20 hover:border-primary hover:text-primary rounded-full px-5"
              onClick={() => setIsVipModalOpen(true)}
            >
              Become a VIP
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="lg:hidden p-2 text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-background/95 backdrop-blur-xl border-t border-border/50">
          <nav className="flex flex-col px-4 py-6 gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full mt-4">
              <a
                href={RESERVE_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMenuOpen(false)}
              >
                Reserve
              </a>
            </Button>
            <Button
              variant="outline"
              className="border-primary/50 text-primary hover:bg-primary/20 hover:border-primary rounded-full"
              onClick={() => {
                setIsMenuOpen(false);
                setIsVipModalOpen(true);
              }}
            >
              Become a VIP
            </Button>
          </nav>
        </div>
      )}

      <ReserveModal
        isOpen={isVipModalOpen}
        onOpenChange={setIsVipModalOpen}
      />

      <PrivatePartyModal
        isOpen={isPrivatePartyModalOpen}
        onOpenChange={setIsPrivatePartyModalOpen}
      />
    </header>
  );
}
