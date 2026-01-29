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
      <GallerySection />

      {/* Keeping these for additional context/SEO, can be removed if client counts them as clutter, but usually good to keep */}
      <FoodSection />
      <CocktailsSection />

      <FaqSection />
      <LocationSection />

      <Footer />
    </main>
  );
}
