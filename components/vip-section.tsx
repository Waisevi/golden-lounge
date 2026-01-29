"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MediaCarousel, MediaItem } from "@/components/media-carousel";
import { PrivatePartyModal } from "@/components/private-party-modal"; // Or specific VIP modal if differentiation needed

const VIP_MEDIA: MediaItem[] = [
  {
    type: "video",
    src: "/videos/vip-room.mp4",
    poster: "/images/gallery/vip.webp",
    alt: "VIP Room Experience"
  },
  { type: "image", src: "/images/gallery/vip-2.webp", alt: "Private Seating" },
  { type: "image", src: "/images/gallery/karaoke.webp", alt: "In-Room Karaoke" },
];

const FEATURES = [
  "Private Karaoke System",
  "Exclusive Event Space",
  "Private Dining",
  "Dedicated Server",
  "Custom Playlist Control",
];

export function VipSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section id="vip" className="py-24 lg:py-32 bg-background/50 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Content Column */}
          <div>
            <div className="mb-6">
              <span className="text-sm font-bold text-accent uppercase tracking-[0.2em]">Exclusivity</span>
              <h2 className="mt-2 text-4xl lg:text-5xl font-bold text-foreground font-serif leading-tight">
                VIP Rooms & Karaoke
              </h2>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Escape the crowd without leaving the party. Our VIP rooms offer an intimate setting
              with state-of-the-art karaoke systems, premium bottle service, and privacy for
              you and your guests. Perfect for when you want to own the night.
            </p>

            {/* Feature Tags */}
            <div className="flex flex-wrap gap-3 mb-10">
              {FEATURES.map((feature) => (
                <span key={feature} className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm font-medium text-foreground/80 hover:border-accent/50 hover:bg-accent/10 transition-colors cursor-default">
                  {feature}
                </span>
              ))}
            </div>

            <Button
              onClick={() => setIsModalOpen(true)}
              size="lg"
              className="rounded-full px-8 py-6 text-lg font-semibold bg-accent text-accent-foreground hover:bg-accent/90 shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-all hover:scale-105"
            >
              Book VIP Room
            </Button>
          </div>

          {/* Media Column */}
          <div>
            <MediaCarousel media={VIP_MEDIA} className="shadow-[0_0_50px_rgba(245,158,11,0.15)]" />
          </div>
        </div>
      </div>

      {/* Reusing Private Party Modal or we can create a specific VIP one if needed, but fields are similar */}
      <PrivatePartyModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
    </section>
  );
}
