import Link from "next/link";
import Image from "next/image";
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from "lucide-react";

const socialLinks = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
];

const quickLinks = [
  { href: "#about", label: "About" },
  { href: "#food", label: "Food" },
  { href: "#cocktails", label: "Cocktails" },
  // { href: "#gallery", label: "Gallery" },
  { href: "/news", label: "News" },
  { href: "#vip", label: "VIP" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="bg-card border-t border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8 sm:gap-10">
          {/* Brand & Socials combined */}
          <div className="flex flex-col gap-4 sm:gap-5 w-full lg:max-w-sm">
            <Link href="/" className="flex items-center group">
              <Image
                src="/gold-logo.svg"
                alt="GD Lounge"
                width={194}
                height={178}
                className="h-10 w-auto sm:h-12 lg:h-16 transition-opacity group-hover:opacity-90"
                priority
              />
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Downtown Miami&apos;s premier destination for craft cocktails and unforgettable nights.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-9 h-9 rounded-full bg-background border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links & Contact Side-by-Side */}
          <div className="grid grid-cols-2 gap-8 sm:gap-12 sm:gap-16 lg:gap-24 w-full lg:w-auto">
            {/* Quick Links */}
            <div>
              <h3 className="text-xs font-bold text-foreground uppercase tracking-[0.2em] mb-4">
                Explore
              </h3>
              <ul className="grid grid-cols-1 gap-2.5">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-xs font-bold text-foreground uppercase tracking-[0.2em] mb-4">
                Connect
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="mailto:reservations@gdmiami.com"
                    className="flex items-center gap-2 sm:gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Mail className="w-4 h-4 text-primary/60 shrink-0" />
                    <span className="break-all">reservations@gdmiami.com</span>
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+13052491222"
                    className="flex items-center gap-2 sm:gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Phone className="w-4 h-4 text-primary/60 shrink-0" />
                    <span>+1 305 249 1222</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://maps.app.goo.gl/odceBHiT9caqxArM7?g_st=ic"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 sm:gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <MapPin className="w-4 h-4 text-primary/60 shrink-0" />
                    <span>Downtown Miami</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Ultra Compact */}
        <div className="mt-8 sm:mt-10 pt-4 sm:pt-6 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground/60">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 md:gap-8 text-center md:text-left w-full md:w-auto">
            <p>© 2026 Premium Lounge & Bar. All rights reserved.</p>
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
          <p className="text-center md:text-right w-full md:w-auto">
            Powered by{" "}
            <a
              href="https://sharconai.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary/70 hover:text-primary transition-colors"
            >
              Sharcon
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
