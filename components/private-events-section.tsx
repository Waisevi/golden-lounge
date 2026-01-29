"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MediaCarousel, MediaItem } from "@/components/media-carousel";
import { PrivatePartyModal } from "@/components/private-party-modal";

const EVENTS_MEDIA: MediaItem[] = [
    {
        type: "video",
        src: "/videos/events.mp4",
        poster: "/images/gallery/events.webp",
        alt: "Private Events"
    },
    { type: "image", src: "/images/gallery/birthday.webp", alt: "Birthday Celebrations" },
    { type: "image", src: "/images/gallery/corporate.webp", alt: "Corporate Events" },
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

                    {/* Content Column */}
                    <div>
                        <div className="mb-6">
                            <span className="text-sm font-bold text-primary uppercase tracking-[0.2em]">Celebrate</span>
                            <h2 className="mt-2 text-4xl lg:text-5xl font-bold text-foreground font-serif leading-tight">
                                Private Events
                            </h2>
                        </div>

                        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                            Make your milestone moment legendary. From intimate birthday gatherings to
                            grand corporate celebrations, our team curates every detail—from the menu
                            to the music—ensuring your event is flawless.
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
                            className="rounded-full px-8 py-6 text-lg font-semibold bg-primary text-white hover:bg-primary/90 shadow-[0_0_20px_rgba(124,58,237,0.2)] transition-all hover:scale-105"
                        >
                            Plan Your Event
                        </Button>
                    </div>

                    {/* Media Column */}
                    <div>
                        <MediaCarousel media={EVENTS_MEDIA} className="shadow-[0_0_50px_rgba(124,58,237,0.15)]" />
                    </div>
                </div>
            </div>

            <PrivatePartyModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
        </section>
    );
}
