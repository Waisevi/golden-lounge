"use client";

import { Header } from "@/components/header";
import { HeroVideoSection } from "@/components/hero-video-section";
import { LoungeSection } from "@/components/lounge-section";
import { VipSection } from "@/components/vip-section";
import { KaraokeExperienceSection } from "@/components/karaoke-experience-section";
import { PrivateEventsSection } from "@/components/private-events-section";
import { GallerySection } from "@/components/gallery-section";
import { FoodSection } from "@/components/food-section";
import { CocktailsSection } from "@/components/cocktails-section";
import { FaqSection } from "@/components/faq-section";
import { LocationSection } from "@/components/location-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroVideoSection />

      {/* 4 Main Content Blocks requested by client */}
      <LoungeSection />
      <VipSection />
      <KaraokeExperienceSection />
      <PrivateEventsSection />

      {/* Supporting Sections */}
      {/* <GallerySection /> */}

      {/* Keeping these for additional context/SEO, can be removed if client counts them as clutter, but usually good to keep */}
      <FoodSection />
      <CocktailsSection />

      <FaqSection />
      <LocationSection />

      <Footer />

      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "NightClub",
                "@id": "https://golden-lounge-psi.vercel.app/#organization",
                "name": "GD Lounge",
                "alternateName": "GD Lounge Miami",
                "description": "Experience elevated nightlife in the heart of Downtown Miami. Lounge, VIP, Karaoke, and Private Events.",
                "url": "https://golden-lounge-psi.vercel.app",
                "telephone": "+13052491222",
                "email": "reservations@gdmiami.com",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": "300 S Biscayne Blvd Suite C-202B",
                  "addressLocality": "Miami",
                  "addressRegion": "FL",
                  "postalCode": "33131",
                  "addressCountry": "US"
                },
                "image": "https://golden-lounge-psi.vercel.app/gold-logo.svg",
                "priceRange": "$$$",
                "openingHoursSpecification": [
                  {
                    "@type": "OpeningHoursSpecification",
                    "dayOfWeek": ["Friday", "Saturday"],
                    "opens": "21:00",
                    "closes": "03:00"
                  }
                ],
                "geo": {
                  "@type": "GeoCoordinates",
                  "latitude": 25.7725,
                  "longitude": -80.1895
                },
                "sameAs": [
                  "https://www.instagram.com/gdmiami",
                  "https://www.facebook.com/gdmiami"
                ]
              },
              {
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "Where is GD Lounge located?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "We are located at 300 S Biscayne Blvd Suite C-202B, Miami, FL 33131. Access is available via the main building entrance."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "How can I make a reservation?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Reservations are highly recommended! You can book directly through our website, email us at reservations@gdmiami.com, or call/text us at +1 (305) 249-1222."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Is there a dress code?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes, our dress code is upscale / smart casual. We strictly prohibit beachwear, flip flops, tank tops (for men), and athletic wear. We reserve the right to deny entry."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Is there an age requirement?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes, GD Lounge is strictly 21+ after 9:00 PM. A valid government-issued ID is required for entry."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Do you offer private events or VIP areas?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Absolutely. We offer exclusive VIP rooms and full-venue buyouts for private parties. You can book using the 'Become a VIP' or 'Private Party' buttons in our menu, or contact us directly."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Is there parking available?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Valet parking is available at Novikov, located directly in front of the venue. There is also limited street parking nearby."
                    }
                  }
                ]
              }
            ]
          })
        }}
      />
    </main>
  );
}
