"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MediaCarousel, MediaItem } from "@/components/media-carousel";
import { PrivatePartyModal } from "@/components/private-party-modal";

const EVENTS_MEDIA: MediaItem[] = [
    { type: "image", src: "/Private/1.webp", alt: "Private Event 1", isLocal: true },
    { type: "image", src: "/Private/2.webp", alt: "Private Event 2", isLocal: true },
    { type: "image", src: "/Private/3.webp", alt: "Private Event 3", isLocal: true },
    { type: "image", src: "/Private/4.webp", alt: "Private Event 4", isLocal: true },
    { type: "image", src: "/Private/5.webp", alt: "Private Event 5", isLocal: true },
];

const FEATURES = [
    "Birthday Bashes",
    "Corporate Events",
    "Holiday Celebrations",
    "Bachelor/Bachelorette",
    "Full Venue Buyouts",
];

export function PrivateEventsSection() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <section id="private-events" className="py-24 lg:py-32 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* Content Column - Bottom on Mobile (order-2), Left on Desktop (default/order-1) */}
                    <div className="order-2 lg:order-1 flex flex-col items-center lg:items-start">
                        <div className="mb-6 text-center lg:text-left">
                            <span className="text-sm font-bold text-primary uppercase tracking-[0.2em]">Celebrate</span>
                            <h2 className="mt-2 text-4xl lg:text-5xl font-bold text-foreground font-serif leading-tight">
                                Private Events
                            </h2>
                        </div>

                        <p className="text-lg text-muted-foreground leading-relaxed mb-8 text-center lg:text-left">
                            Make your milestone moment legendary. From intimate birthday gatherings to
                            grand corporate celebrations, our team curates every detail—from the menu
                            to the music—ensuring your event is flawless.
                        </p>

                        {/* Feature Tags */}
                        <div className="flex flex-wrap gap-3 mb-10 justify-center lg:justify-start">
                            {FEATURES.map((feature) => (
                                <span key={feature} className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm font-medium text-foreground/80 hover:border-primary/50 hover:bg-primary/10 transition-colors cursor-default">
                                    {feature}
                                </span>
                            ))}
                        </div>

                        <Button
                            onClick={() => setIsModalOpen(true)}
                            size="lg"
                            className="rounded-full px-8 py-6 text-lg font-semibold bg-primary text-black hover:bg-primary/90 shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-all hover:scale-105"
                        >
                            Plan Your Event
                        </Button>
                    </div>

                    {/* Media Column - Top on Mobile (order-1), Right on Desktop (default/order-2) */}
                    <div className="order-1 lg:order-2 h-[500px] lg:h-auto w-full max-w-[300px] lg:max-w-none mx-auto lg:mx-0">
                        <MediaCarousel
                            media={EVENTS_MEDIA}
                            aspectRatio="h-full lg:aspect-[4/5]"
                            className="shadow-[0_0_50px_rgba(245,158,11,0.15)] h-full"
                            loop={false}
                        />
                    </div>
                </div>
            </div>

            <PrivatePartyModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
        </section>
    );
}
