"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Maximize2 } from "lucide-react";
import { ImageModal } from "@/components/image-modal";
import { getAssetUrl } from "@/lib/assets";
import { supabase } from "@/lib/supabase";

type GalleryItem = {
  id: string;
  image_url: string;
  alt_text: string;
};

export function GallerySection() {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGallery() {
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .order("order", { ascending: true });

      if (error) {
        console.error("Error fetching gallery:", error.message);
      } else if (data) {
        setImages(data);
      }
      setLoading(false);
    }
    fetchGallery();
  }, []);

  return (
    <section id="gallery" className="bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-widest">
            Atmosphere
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            Gallery
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            A glimpse into the nights, flavors, and energy of our lounge.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img, index) => {
            const imageSrc = getAssetUrl(img.image_url);
            return (
            <Card
              key={img.id}
              className="group relative overflow-hidden bg-card border-border/40 "
              onClick={() => setSelectedImage(imageSrc)}
            >
              <div className="relative aspect-square">
                <Image
                  src={imageSrc}
                  alt={img.alt_text || `Lounge gallery ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Overlay with Icon */}
                <div className="absolute inset-0 bg-background/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-primary/80 text-primary-foreground flex items-center justify-center translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <Maximize2 className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </Card>
            );
          })}
        </div>
      </div>

      <ImageModal
        isOpen={!!selectedImage}
        onOpenChange={(open) => !open && setSelectedImage(null)}
        src={selectedImage || ""}
        alt="Gallery Preview"
      />
    </section>
  );
}
