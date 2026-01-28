import Image from "next/image";
import { getAssetUrl } from "@/lib/assets";

export function KaraokeSection() {
  return (
    <section id="karaoke" className="py-24 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-20 items-center">
          {/* Content Column */}
          <div>
            <h2 className="mb-6 text-4xl lg:text-5xl font-bold text-foreground leading-tight font-serif text-center lg:text-left">
              Private Karaoke Rooms
            </h2>

            <div className="text-lg text-muted-foreground leading-relaxed max-w-2xl text-balance text-center lg:text-left">
              <p>
                GD Lounge takes karaoke to another level. Our private rooms give
                you space to sing, laugh, and let loose without a crowd staring
                you down. Professional sound, sharp lighting, and crafted
                cocktails set the tone while your group takes over the night.
              </p>
            </div>
          </div>

          {/* Image Column */}
          <div className="relative aspect-[4/3] lg:aspect-[16/10] overflow-hidden rounded-[2rem] border border-border/40 shadow-2xl">
            <Image
              src={getAssetUrl("/images/gallery/karaoke.webp")}
              alt="Karaoke at GD Lounge"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
            {/* Subtle Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
