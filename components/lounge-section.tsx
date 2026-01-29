"use client";

import { Button } from "@/components/ui/button";
import { MediaCarousel, MediaItem } from "@/components/media-carousel";

const LOUNGE_MEDIA: MediaItem[] = [
    {
        type: "video",
        src: "/lounge-video-main.mp4",
        // poster: "/lounge1.png", // Removed poster as user requested "video immediately"
        alt: "Lounge Content",
        isLocal: true,
    },
    { type: "image", src: "/lounge1.png", alt: "Lounge Atmosphere", isLocal: true },
    { type: "image", src: "/l2.png", alt: "Lounge Vibes 2", isLocal: true },
    { type: "image", src: "/l3.png", alt: "Lounge Vibes 3", isLocal: true },
];

const FEATURES = [
    "World-Class DJs",
    "Signature Cocktails",
    "Premium Hookah",
    "Live Entertainment",
    "Immersive Light Show",
    "Late Night Dinner",
];

export function LoungeSection() {
    return (
        <section id="lounge" className="py-24 lg:py-32 bg-background border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Media Column - Media Top on Mobile (order-1), Left on Desktop (order-1) */}
                    <div className="order-1 lg:order-1">
                        <MediaCarousel
                            media={LOUNGE_MEDIA}
                            aspectRatio="aspect-video lg:aspect-[4/5]"
                            className="shadow-[0_0_50px_rgba(245,158,11,0.15)]"
                        />
                    </div>

                    {/* Content Column - Content Bottom on Mobile (order-2), Right on Desktop (order-2) */}
                    <div className="order-2 lg:order-2">
                        <div className="mb-6">
                            <span className="text-sm font-bold text-primary uppercase tracking-[0.2em]">The Experience</span>
                            <h2 className="mt-2 text-4xl lg:text-5xl font-bold text-foreground font-serif leading-tight">
                                GD Lounge
                            </h2>
                        </div>

                        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                            An electric fusion of high-energy nightlife and sophisticated relaxation.
                            Whether you're here for the beats, the bottles, or the ambiance,
                            GD Lounge delivers an unforgettable sensory experience in the heart of Miami.
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
                            asChild
                            size="lg"
                            className="rounded-full px-8 py-6 text-lg font-semibold bg-primary text-black hover:bg-primary/90 shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-all hover:scale-105"
                        >
                            <a href="https://www.sevenrooms.com/reservations/gdlounge" target="_blank" rel="noopener noreferrer">
                                Reserve a Table
                            </a>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
