"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ReserveModal } from "@/components/reserve-modal";

export function HeroVideoSection() {
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);

  return (
    <section className="relative h-[100svh] w-full overflow-hidden">
      {/* BACKGROUND IMAGE */}
      <div className="absolute inset-0">
        <Image
          src="/hero-bg-VFSG5pOF.webp"
          alt="GD Lounge atmosphere"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />

        {/* overlays - slightly darker to hide photo defects */}
        <div className="pointer-events-none absolute inset-0 bg-black/60" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/85" />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 pt-[72px] text-center">
        <div className="max-w-4xl space-y-10">
          {/* Location badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            <span className="text-xs font-semibold tracking-[0.3em] uppercase text-white">
              Downtown Miami
            </span>
          </div>

          {/* Headline */}
          <div className="space-y-4">
            <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-medium tracking-tight text-white drop-shadow-2xl">
              GD Lounge
            </h1>
            {/* Subheadline */}
            <p className="mx-auto max-w-2xl text-base sm:text-lg md:text-xl font-medium text-white/90 drop-shadow-lg">
              Experience elevated nightlife in the heart of Downtown Miami
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6 animate-in fade-in slide-in-from-bottom-5 duration-1000">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto rounded-xl bg-primary px-10 py-7 text-lg font-bold shadow-[0_0_30px_rgba(124,58,237,0.5)] hover:bg-primary/90 hover:scale-105 transition-all"
            >
              <a href="https://www.sevenrooms.com/reservations/gdlounge" target="_blank" rel="noopener noreferrer">
                Reserve a Table
              </a>
            </Button>

            <Button
              onClick={() => setIsReserveModalOpen(true)}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto rounded-xl border-white/30 bg-transparent px-10 py-7 text-lg font-bold text-white backdrop-blur-md hover:bg-transparent hover:border-primary hover:text-primary hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] hover:scale-105 transition-all"
            >
              Become a VIP
            </Button>
          </div>
        </div>
      </div>

      <ReserveModal
        isOpen={isReserveModalOpen}
        onOpenChange={setIsReserveModalOpen}
      />
    </section>
  );
}
