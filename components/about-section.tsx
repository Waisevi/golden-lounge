"use client";

import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const highlights = [
  {
    title: "Premium Cocktails",
    description: "Handcrafted drinks made with the finest spirits.",
  },
  {
    title: "Curated Sound",
    description: "World-class DJs and carefully selected playlists.",
  },
  {
    title: "Exclusive Atmosphere",
    description: "An intimate setting designed for the finer things.",
  },
];

export function AboutSection() {
  const [videoUrl, setVideoUrl] = useState<string>("");

  useEffect(() => {
    async function getVideoUrl() {
      try {
        const { data } = supabase.storage
          .from("assets")
          .getPublicUrl("video/gd.mp4");

        if (data?.publicUrl) {
          setVideoUrl(data.publicUrl);
        }
      } catch (error) {
        console.error("Error getting video URL from storage:", error);
      }
    }

    getVideoUrl();
  }, []);

  return (
    <section id="about" className="py-24 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-20 items-center">
          {/* Video Column */}
          <div className="relative aspect-[9/16] lg:aspect-[4/5] overflow-hidden rounded-[2rem] border border-border/40 shadow-2xl">
            {videoUrl && (
              <video
                autoPlay
                muted
                loop
                playsInline
                className="h-full w-full object-cover"
              >
                <source src={videoUrl} type="video/mp4" />
              </video>
            )}
            {/* Subtle Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
          </div>

          {/* Content Column */}
          <div>
            <div className="mb-8">
              <span className="text-sm font-bold text-accent uppercase tracking-[0.2em]">
                Our Story
              </span>
              <h2 className="mt-4 text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                Where Miami Comes to Unwind
              </h2>
            </div>

            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed max-w-2xl text-balance">
              <p>
                Nestled in the heart of Downtown Miami, our lounge & bar is more
                than just a venue—it&apos;s an experience. Since opening our
                doors, we&apos;ve become the go-to destination for those seeking
                the perfect blend of sophistication and energy.
              </p>
            </div>

            {/* Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 mt-12 border-t border-border/50">
              {highlights.map((highlight) => (
                <div key={highlight.title} className="space-y-3">
                  <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider mb-1">
                      {highlight.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {highlight.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
