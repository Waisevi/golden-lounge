"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { getAssetUrl } from "@/lib/assets";
import { supabase } from "@/lib/supabase";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

type MenuItem = {
  id: string;
  name: string;
  image: string;
};

export function FoodSection() {
  const [foodItems, setFoodItems] = useState<MenuItem[]>([]);
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
        // Temporary override for Creme Brulee -> Ice Cream & Roll Image
        const updatedData = data.map((item: any) => {
          const nameLower = item.name.toLowerCase();
          if (nameLower.includes("brul") || nameLower.includes("crem")) {
            return { ...item, name: "Ice Cream", image: "/ice-cream.webp" };
          }
          if (nameLower.includes("roll") || nameLower.includes("dragon") || nameLower.includes("crab") || nameLower.includes("alaskan")) {
            return { ...item, image: "/food/roll.webp" };
          }
          return item;
        });

        // Filter and sort to match specific user list
        const targetItems = [
          "Sashimi Platter",
          "Nigiri Selection",
          "Alaskan King Crab California",
          "Black Cod Gyoza",
          "Whole Peking Duck",
          "Ice Cream"
        ];

        const finalData = targetItems.map(target => {
          return updatedData.find((item: any) =>
            item.name.toLowerCase().includes(target.toLowerCase())
          );
        }).filter(Boolean); // Remove any undefined matches

        setFoodItems(finalData);
      }
      setLoading(false);
    }
    fetchFood();
  }, []);

  return (
    <section id="food" className="py-24 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-widest">
            Kitchen
          </span>
          <h2 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground font-serif tracking-tight">
            Signature Dishes
          </h2>
        </div>

        {/* Desktop Grid (Hidden on Mobile) */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
          {foodItems.map((item) => (
            <Card
              key={item.id}
              className="group bg-card border-border/40 overflow-hidden hover:border-primary/40 transition-all"
            >
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={item.image.startsWith("/") ? item.image : getAssetUrl(item.image)}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              <div className="p-3 text-center transition-colors group-hover:bg-primary/5">
                <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {item.name}
                </h3>
              </div>
            </Card>
          ))}
        </div>

        {/* Mobile Infinite Swiper (Hidden on Desktop) */}
        <div className="sm:hidden -mx-4">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={16}
            slidesPerView={1.2}
            centeredSlides={true}
            loop={true}
            className="px-4 pb-8"
          >
            {foodItems.map((item) => (
              <SwiperSlide key={item.id} className="h-auto">
                <Card
                  className="h-full bg-card border-border/40 overflow-hidden"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={item.image.startsWith("/") ? item.image : getAssetUrl(item.image)}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="p-3 text-center">
                    <h3 className="text-sm font-medium text-foreground">
                      {item.name}
                    </h3>
                  </div>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}