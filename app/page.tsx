"use client";

import dynamic from "next/dynamic";
import { Header } from "@/components/header";
import { HeroVideoSection } from "@/components/hero-video-section";
import { Footer } from "@/components/footer";

// Dynamic Imports for performance (Lazy loading below-the-fold content)
import LazyLoadSection from "@/components/lazy-load-section";

const LoungeSection = dynamic(() => import("@/components/lounge-section").then(mod => mod.LoungeSection));
// const EventsSection = dynamic(() => import("@/components/events-section").then(mod => mod.EventsSection)); // Temporarily removed as per user request
// ... (rest are same)
const VipSection = dynamic(() => import("@/components/vip-section").then(mod => mod.VipSection));
const KaraokeExperienceSection = dynamic(() => import("@/components/karaoke-experience-section").then(mod => mod.KaraokeExperienceSection));
const PrivateEventsSection = dynamic(() => import("@/components/private-events-section").then(mod => mod.PrivateEventsSection));
// const GallerySection = dynamic(() => import("@/components/gallery-section").then(mod => mod.GallerySection)); // Comments preserved
const FoodSection = dynamic(() => import("@/components/food-section").then(mod => mod.FoodSection));
const CocktailsSection = dynamic(() => import("@/components/cocktails-section").then(mod => mod.CocktailsSection));
const FaqSection = dynamic(() => import("@/components/faq-section").then(mod => mod.FaqSection));
const LocationSection = dynamic(() => import("@/components/location-section").then(mod => mod.LocationSection));

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroVideoSection />

      {/* 4 Main Content Blocks requested by client - Wrapped in Aggressive Lazy Loader */}
      <LazyLoadSection className="min-h-[500px] lg:min-h-[800px]">
        <LoungeSection />
      </LazyLoadSection>

      {/* <LazyLoadSection className="min-h-[500px] lg:min-h-[600px]">
        <EventsSection />
      </LazyLoadSection> */}

      <LazyLoadSection className="min-h-[500px] lg:min-h-[800px]">
        <VipSection />
      </LazyLoadSection>

      <LazyLoadSection className="min-h-[500px] lg:min-h-[800px]">
        <KaraokeExperienceSection />
      </LazyLoadSection>

      <LazyLoadSection className="min-h-[500px] lg:min-h-[800px]">
        <PrivateEventsSection />
      </LazyLoadSection>


      {/* Supporting Sections */}
      {/* <GallerySection /> */}

      {/* Keeping these for additional context/SEO, can be removed if client counts them as clutter, but usually good to keep */}
      <LazyLoadSection className="min-h-[400px]">
        <FoodSection />
      </LazyLoadSection>

      <LazyLoadSection className="min-h-[400px]">
        <CocktailsSection />
      </LazyLoadSection>

      <LazyLoadSection className="min-h-[300px]">
        <FaqSection />
      </LazyLoadSection>

      <LazyLoadSection className="min-h-[300px]">
        <LocationSection />
      </LazyLoadSection>

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
                "description": "Experience elevated nightlife in the heart of Downtown Miami. Lounge, VIP, Karaoke. Open Fri-Sat 9PM-3AM. Private Events available 24/7.",
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
