import Image from "next/image";

export function VipRoomSection() {
  return (
    <section id="vip-room" className="py-24 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-12 lg:gap-20 items-center">
          {/* Image Column */}
          <div className="relative aspect-[4/3] lg:aspect-[16/10] overflow-hidden rounded-[2rem] border border-border/40 shadow-2xl">
            <Image
              src="/images/gallery/vip.webp"
              alt="VIP Room at GD Lounge"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
            {/* Subtle Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
          </div>

          {/* Content Column */}
          <div className="text-center lg:text-left">
            <div className="mb-8">
              <span className="text-sm font-bold text-accent uppercase tracking-[0.2em] block">
                Exclusive Experience
              </span>
              <h2 className="mt-4 text-4xl lg:text-5xl font-bold text-foreground leading-tight font-serif">
                VIP Room
              </h2>
            </div>

            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0 text-balance">
              <p>
                A GD Lounge VIP room is where the city disappears and the night becomes yours. Step inside and you&apos;re met with floor-to-ceiling luxury, rich textures, and lighting that makes everything feel intentionally dramatic.
              </p>
              <p>
                It&apos;s the kind of room where you decide the pace, the people, and the energy. No crowds, no interruptions, just a private world sitting a few steps away from Miami&apos;s pulse. Close enough to feel it, far enough to own it.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
