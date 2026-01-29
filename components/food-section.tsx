"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { getAssetUrl } from "@/lib/assets";
import { supabase } from "@/lib/supabase";

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
          if (nameLower.includes("roll") || nameLower.includes("dragon")) {
            return { ...item, image: "/food/roll.webp" };
          }
          return item;
        });
        setFoodItems(updatedData);
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

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
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
      </div>
    </section>
  );
}