"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Maximize2, GlassWater } from "lucide-react";
import { ImageModal } from "@/components/image-modal";
import { MenuModal } from "@/components/menu-modal";
import { Button } from "@/components/ui/button";
import { getAssetUrl } from "@/lib/assets";
import { supabase } from "@/lib/supabase";

type Cocktail = {
  id: string;
  name: string;
  description: string;
  image: string;
};

export function CocktailsSection() {
  const [cocktails, setCocktails] = useState<Cocktail[]>([]);
  const [selectedImage, setSelectedImage] = useState<{ src: string, alt: string } | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCocktails() {
      const { data, error } = await supabase
        .from("menu_items")
        .select(`
          id,
          name,
          description,
          image,
          menu_categories!inner(menu_type)
        `)
        .eq("menu_categories.menu_type", "bar")
        .order("order", { ascending: true });

      if (error) {
        console.error("Error fetching cocktails:", error.message);
      } else if (data) {
        setCocktails(data as any);
      }
      setLoading(false);
    }
    fetchCocktails();
  }, []);

  return (
    <section
      id="cocktails"
      className="py-24 lg:py-32 bg-background"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="text-left max-w-2xl">
            <span className="text-sm font-semibold text-primary uppercase tracking-widest">
              Mixology
            </span>
            <h2 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground font-serif tracking-tight">
              Signature Cocktails
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Handcrafted cocktails made with premium spirits and fresh ingredients,
              designed to match the rhythm of Miami nights.
            </p>
          </div>
          <Button
            onClick={() => setIsMenuOpen(true)}
            size="lg"
            className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground px-8 font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 group"
          >
            <GlassWater className="w-5 h-5 group-hover:-rotate-12 transition-transform" />
            View Full Menu
          </Button>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cocktails.map((cocktail) => (
            <Card
              key={cocktail.id}
              className="group overflow-hidden border-border/50 bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 cursor-zoom-in"
              onClick={() => setSelectedImage({ src: cocktail.image, alt: cocktail.name })}
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={getAssetUrl(cocktail.image)}
                  alt={cocktail.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                {/* Overlay with Icon */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-primary/80 text-primary-foreground flex items-center justify-center scale-90 group-hover:scale-100 transition-transform duration-300">
                    <Maximize2 className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <CardContent className="p-5 transition-colors group-hover:bg-primary/5">
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {cocktail.name}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {cocktail.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <ImageModal
        isOpen={!!selectedImage}
        onOpenChange={(open) => !open && setSelectedImage(null)}
        src={selectedImage?.src || ""}
        alt={selectedImage?.alt || "Cocktail Preview"}
      />

      <MenuModal
        isOpen={isMenuOpen}
        onOpenChange={setIsMenuOpen}
      />
    </section>
  );
}
