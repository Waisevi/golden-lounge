import { Header } from "@/components/header";
import { HeroVideoSection } from "@/components/hero-video-section";
import { GallerySection } from "@/components/gallery-section";
import { AboutSection } from "@/components/about-section";
import { FoodSection } from "@/components/food-section";
import { CocktailsSection } from "@/components/cocktails-section";
import { EventsSection } from "@/components/events-section";
import { VipRoomSection } from "@/components/vip-room-section";
import { KaraokeSection } from "@/components/karaoke-section";
import { VipSection } from "@/components/vip-section";
import { LocationSection } from "@/components/location-section";
import { FaqSection } from "@/components/faq-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroVideoSection />

      <VipRoomSection />
      <KaraokeSection />
      <GallerySection />
      <AboutSection />

      <FoodSection />
      <CocktailsSection />
      <EventsSection />

      <FaqSection />
      <LocationSection />

      <Footer />
    </main>
  );
}
