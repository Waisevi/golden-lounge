"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Maximize2, Utensils } from "lucide-react";
import { ImageModal } from "@/components/image-modal";
import { MenuModal } from "@/components/menu-modal";
import { Button } from "@/components/ui/button";
import { getAssetUrl } from "@/lib/assets";
import { supabase } from "@/lib/supabase";

type MenuItem = {
  id: string;
  name: string;
  image: string;
};

export function FoodSection() {
  const [foodItems, setFoodItems] = useState<MenuItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<{ src: string, alt: string } | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFood() {
      const { data, error } = await supabase
        .from("menu_items")
        .select(`
          id,
          name,
          image,
          menu_categories!inner(menu_type)
        `)
        .eq("menu_categories.menu_type", "food")
        .order("order", { ascending: true });

      if (error) {
        console.error("Error fetching food:", error.message);
      } else if (data) {
        setFoodItems(data as any);
      }
      setLoading(false);
    }
    fetchFood();
  }, []);

  return (
    <section id="food" className="py-24 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="text-left">
            <span className="text-sm font-semibold text-primary uppercase tracking-widest">
              Kitchen
            </span>
            <h2 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground font-serif tracking-tight">
              Signature Dishes
            </h2>
          </div>
          <Button
            onClick={() => setIsMenuOpen(true)}
            size="lg"
            className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground px-8 font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 group"
          >
            <Utensils className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            View Full Menu
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {foodItems.map((item) => (
            <Card
              key={item.id}
              className="group bg-card border-border/40 overflow-hidden hover:border-primary/40 transition-all cursor-zoom-in"
              onClick={() => setSelectedImage({ src: item.image, alt: item.name })}
            >
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={getAssetUrl(item.image)}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Overlay with Icon */}
                <div className="absolute inset-0 bg-background/20 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-primary/80 text-primary-foreground flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-300">
                    <Maximize2 className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <div className="p-3 text-center transition-colors group-hover:bg-primary/5">
                <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {item.name}
                </h3>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <ImageModal
        isOpen={!!selectedImage}
        onOpenChange={(open) => !open && setSelectedImage(null)}
        src={selectedImage?.src || ""}
        alt={selectedImage?.alt || "Food Preview"}
      />

      <MenuModal
        isOpen={isMenuOpen}
        onOpenChange={setIsMenuOpen}
      />
    </section>
  );
}