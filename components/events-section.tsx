"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { getAssetUrl } from "@/lib/assets";
import { supabase } from "@/lib/supabase";
import "swiper/css";
import "swiper/css/navigation";

type Event = {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  image: string;
  category: string;
};

export function EventsSection() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching events:", error.message);
      } else if (data) {
        setEvents(data);
      }
      setLoading(false);
    }

    fetchEvents();
  }, []);

  const scrollPrev = () => {
    swiperRef.current?.slidePrev();
  };

  const scrollNext = () => {
    swiperRef.current?.slideNext();
  };

  return (
    <section id="events" className="py-24 lg:py-32 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16">
          <div className="max-w-2xl">
            <span className="text-sm font-semibold text-primary uppercase tracking-widest">
              Exclusive Nights
            </span>
            <h2 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground font-serif tracking-tight">
              Upcoming Events
            </h2>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative overflow-visible">
          {/* Navigation Buttons — only if 4+ items */}
          {events.length >= 4 && (
            <>
              <button
                onClick={scrollPrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-8 z-10 w-12 h-12 lg:w-14 lg:h-14 rounded-full border border-primary/40 bg-background/80 backdrop-blur-sm flex items-center justify-center text-white hover:bg-primary/10 hover:border-primary transition-all duration-300 shadow-lg"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-6 h-6 lg:w-7 lg:h-7" />
              </button>
              <button
                onClick={scrollNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-8 z-10 w-12 h-12 lg:w-14 lg:h-14 rounded-full border border-primary/40 bg-background/80 backdrop-blur-sm flex items-center justify-center text-white hover:bg-primary/10 hover:border-primary transition-all duration-300 shadow-lg"
                aria-label="Next slide"
              >
                <ChevronRight className="w-6 h-6 lg:w-7 lg:h-7" />
              </button>
            </>
          )}

          <div className="overflow-hidden">
            <Swiper
            modules={[Navigation]}
            spaceBetween={24}
            slidesPerView={1}
            navigation={false}
            watchOverflow={true}
            loop={false}
            rewind={true}
            breakpoints={{
              768: {
                slidesPerView: 2,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 32,
              },
            }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            className="[&_.swiper-button-next]:hidden [&_.swiper-button-prev]:hidden"
            >
              {events.map((event, index) => (
                <SwiperSlide key={`${event.title}-${index}`}>
                  <div className="relative aspect-[3/4.5] rounded-[2rem] overflow-hidden group shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-20">
                  {/* Background Image */}
                  <Image
                    src={getAssetUrl(event.image)}
                    alt={event.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 48vw, 33vw"
                  />

                  {/* Dark Overlays with Sophisticated Gradients */}
                  <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black via-black/70 to-transparent z-10 opacity-90" />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors duration-700 z-10" />

                  {/* Content */}
                  <div className="absolute inset-0 p-8 sm:p-10 flex flex-col justify-end z-20">
                    <div className="transform transition-all duration-700 ease-out group-hover:translate-y-[-0.5rem]">
                      <div className="flex items-center gap-2 text-primary mb-4">
                        <div className="h-px w-8 bg-primary/50 group-hover:w-12 transition-all duration-500" />
                        <span className="text-xs font-bold uppercase tracking-[0.25em]">{event.date}</span>
                      </div>

                      <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-serif leading-[1.05] tracking-tight">
                        {event.title}
                      </h3>

                      <div className="overflow-hidden max-h-32 md:max-h-0 md:group-hover:max-h-32 transition-all duration-1000 ease-in-out opacity-100 md:opacity-0 md:group-hover:opacity-100">
                        <p className="text-gray-300 text-sm sm:text-base mb-6 leading-relaxed font-light">
                          {event.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 pt-1">
                        <div className="flex items-center gap-2.5 text-white/60 text-xs font-semibold uppercase tracking-widest bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 group-hover:border-primary/40 group-hover:text-primary transition-all duration-500">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{event.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Glass Accent Border */}
                  <div className="absolute inset-0 border-[1.5px] border-white/10 rounded-[2rem] pointer-events-none group-hover:border-primary/40 transition-all duration-700 z-30" />
                </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        {/* Floating Indicator (Optional flair) */}
        <div className="mt-12 flex justify-center">
          <div className="h-1 w-24 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-primary/40 w-1/3 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}
