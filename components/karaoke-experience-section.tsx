"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MediaCarousel, MediaItem } from "@/components/media-carousel";
import { PrivatePartyModal } from "@/components/private-party-modal";

const KARAOKE_MEDIA: MediaItem[] = [
    {
        type: "video",
        src: "/videos/karaoke-fun.mp4",
        poster: "/images/gallery/karaoke-2.webp", // Ensure this image exists or use fallback
        alt: "Karaoke Fun"
    },
    { type: "image", src: "/images/gallery/cocktail-2.webp", alt: "Drinks & Singing" },
    { type: "image", src: "/images/gallery/party-crowd.webp", alt: "Party Vibe" },
];

const FEATURES = [
    "Amazing Sound System",
    "Bottle Service",
    "Craft Cocktails",
    "Premium Hookah",
    "Dance Floor Atmosphere",
];

export function KaraokeExperienceSection() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <section id="karaoke-experience" className="py-24 lg:py-32 bg-background border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Media Column - Media Top on Mobile (order-1), Left on Desktop (order-1) */}
                    <div className="order-1 lg:order-1 h-[500px] lg:h-auto w-full max-w-[300px] lg:max-w-none mx-auto lg:mx-0">
                        <MediaCarousel
                            media={KARAOKE_MEDIA}
                            aspectRatio="h-full"
                            className="shadow-[0_0_50px_rgba(245,158,11,0.15)] h-full"
                        />
                    </div>

                    {/* Content Column */}
                    <div className="order-2 lg:order-2">
                        <div className="mb-6">
                            <span className="text-sm font-bold text-primary uppercase tracking-[0.2em]">Unleash</span>
                            <h2 className="mt-2 text-4xl lg:text-5xl font-bold text-foreground font-serif leading-tight">
                                Karaoke Experience
                            </h2>
                        </div>

                        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                            Not just a room, but a full sensory experience.
                            Sing your heart out with crystal clear audio, fueled by premium bottle service
                            and the best hookahs in Miami. It's your concert, your crowd, your night.
                        </p>

                        {/* Feature Tags */}
                        <div className="flex flex-wrap gap-3 mb-10">
                            {FEATURES.map((feature) => (
                                <span key={feature} className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm font-medium text-foreground/80 hover:border-primary/50 hover:bg-primary/10 transition-colors cursor-default">
                                    {feature}
                                </span>
                            ))}
                        </div>

                        <Button
                            onClick={() => setIsModalOpen(true)}
                            size="lg"
                            className="rounded-full px-8 py-6 text-lg font-semibold bg-primary text-black hover:bg-primary/90 shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all hover:scale-105"
                        >
                            Book Karaoke
                        </Button>
                    </div>
                </div>
            </div>

            <PrivatePartyModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
        </section>
    );
}
