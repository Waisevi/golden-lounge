"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
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
        <div className="mb-16 max-w-2xl">
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

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cocktails.map((cocktail, index) => {
            const shiftDown = [3, 4, 5, 7].includes(index); // photos 4, 5, 6, 8
            return (
              <Card
                key={cocktail.id}
                className="group overflow-hidden border-border/50 bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
              >
                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={getAssetUrl(cocktail.image)}
                    alt={cocktail.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
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
            );
          })}
        </div>
      </div>
    </section>
  );
}
