"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { getAssetUrl } from "@/lib/assets";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export type MediaItem = {
    type: "video" | "image";
    src: string;
    alt?: string;
    poster?: string; // For videos
    isLocal?: boolean; // New flag to bypass getAssetUrl
};

// ... (props interface unchanged)

// Inside MediaCarousel component...
// Helper to resolve URL based on isLocal flag
const resolveUrl = (src: string, isLocal?: boolean) => {
    return isLocal ? src : getAssetUrl(src);
};

// ... inside render loop ...
{
    item.type === "video" ? (
        <>
            <video
                ref={videoRef}
                src={resolveUrl(item.src, item.isLocal)}
                poster={item.poster ? resolveUrl(item.poster, item.isLocal) : undefined}
                className="absolute inset-0 w-full h-full object-cover"
                loop
                muted={isMuted}
                autoPlay
                playsInline
            />
            {/* ... controls ... */}
        </>
    ) : (
    <Image
        src={resolveUrl(item.src, item.isLocal)}
        alt={item.alt || ""}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
        priority={index === 0}
    />
)
}

{/* Gradient Overlay for better text visibility if needed, or visual style */ }
<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                        </div >
                    </SwiperSlide >
                ))}

{/* Helper Instructions - Optional */ }
{
    media.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
            <div className="w-12 h-1 rounded-full bg-white/20 overflow-hidden">
                <div className="h-full bg-white/80 w-1/2 animate-pulse" />
            </div>
        </div>
    )
}
            </Swiper >

    {/* Navigation Arrows */ }
{
    media.length > 1 && (
        <>
            <div className="custom-swiper-button-prev absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white cursor-pointer hover:bg-black/40 transition-all opacity-0 group-hover:opacity-100">
                <ChevronLeft className="w-5 h-5" />
            </div>
            <div className="custom-swiper-button-next absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white cursor-pointer hover:bg-black/40 transition-all opacity-0 group-hover:opacity-100">
                <ChevronRight className="w-5 h-5" />
            </div>
        </>
    )
}
        </div >
    );
}
