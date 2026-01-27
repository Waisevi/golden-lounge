import Image from "next/image";

export function VipRoomSection() {
  return (
    <section id="vip-room" className="bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-12 lg:gap-20 items-center">
          {/* Image Column */}
          <div className="relative w-fit rounded-[2rem] border border-border/40 shadow-2xl overflow-hidden">
            <Image
              src="/images/gallery/vip.webp"
              alt="VIP Rooms at GD Lounge"
              width={1200}
              height={800}
              className="block"
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
          </div>

          {/* Content Column */}
          <div className="text-center lg:text-left">
            <div className="mb-8">
              <span className="text-sm font-bold text-accent uppercase tracking-[0.2em] block">
                Exclusive Experience
              </span>
              <h2 className="mt-4 text-4xl lg:text-5xl font-bold text-foreground leading-tight font-serif">
                VIP Rooms
              </h2>
            </div>

            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0 text-balance">
              <p>
                A GD Lounge VIP room is where the city disappears and the night
                becomes yours. Step inside and you&apos;re met with
                floor-to-ceiling luxury, rich textures, and lighting that makes
                everything feel intentionally dramatic.
              </p>
              <p>
                It&apos;s the kind of room where you decide the pace, the
                people, and the energy. No crowds, no interruptions, just a
                private world sitting a few steps away from Miami&apos;s pulse.
                Close enough to feel it, far enough to own it.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
