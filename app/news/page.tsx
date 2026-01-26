"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Calendar, User, ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getAssetUrl } from "@/lib/assets";

type Article = {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    image: string;
    category: string;
    author: string;
    date: string;
};

export default function NewsPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchNews() {
            const { data, error } = await supabase
                .from("news")
                .select("*")
                .eq("published", true)
                .order("updated_at", { ascending: false });

            if (error) {
                console.error("Error fetching news:", error.message);
            } else if (data) {
                // Преобразуем данные из формата БД в формат компонента
                const formattedArticles = data.map((article: any) => ({
                    id: article.id,
                    title: article.title_en || article.title || "",
                    slug: article.slug,
                    excerpt: article.excerpt_en || article.excerpt || "",
                    image: article.image || "",
                    category: article.category || article.tags?.[0] || "News",
                    author: article.author || "GD Lounge",
                    date: article.updated_at 
                        ? new Date(article.updated_at).toLocaleDateString("en-US", { 
                            year: "numeric", 
                            month: "long", 
                            day: "numeric" 
                        })
                        : new Date().toLocaleDateString("en-US", { 
                            year: "numeric", 
                            month: "long", 
                            day: "numeric" 
                        }),
                }));
                setArticles(formattedArticles);
            }
            setLoading(false);
        }
        fetchNews();
    }, []);

    return (
        <main className="min-h-screen bg-background">
            <Header />

            <div className="pt-32 pb-24 lg:pt-40 lg:pb-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Page Header */}
                    <div className="max-w-3xl mb-16 lg:mb-24">
                        <span className="text-sm font-semibold text-primary uppercase tracking-[0.2em] mb-4 block">
                            Lounge Insights
                        </span>
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground font-serif tracking-tight mb-8">
                            News & Stories
                        </h1>
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            Stay updated with the latest events, cocktail trends, and exclusive stories from the heart of Downtown Miami nightlife.
                        </p>
                    </div>

                    {/* News Grid */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="w-10 h-10 text-primary animate-spin" />
                            <p className="text-muted-foreground uppercase tracking-widest text-xs font-bold">Loading Stories...</p>
                        </div>
                    ) : articles.length === 0 ? (
                        <div className="py-20 text-center">
                            <p className="text-muted-foreground italic">No stories published yet.</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                            {articles.map((article) => (
                                <Link
                                    key={article.id}
                                    href={`/news/${article.slug}`}
                                    className="group flex flex-col"
                                >
                                    <div className="relative aspect-[16/10] rounded-3xl overflow-hidden mb-6 shadow-xl lg:shadow-2xl">
                                        <Image
                                            src={getAssetUrl(article.image)}
                                            alt={article.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-background/80 backdrop-blur-md text-foreground text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border border-border/50">
                                                {article.category}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col flex-1">
                                        <div className="flex items-center gap-4 text-muted-foreground text-xs mb-4">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5 text-primary/60" />
                                                <span>{article.date}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <User className="w-3.5 h-3.5 text-primary/60" />
                                                <span>{article.author}</span>
                                            </div>
                                        </div>

                                        <h2 className="text-2xl font-bold text-foreground font-serif mb-4 group-hover:text-primary transition-colors leading-tight">
                                            {article.title}
                                        </h2>

                                        <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-3">
                                            {article.excerpt}
                                        </p>

                                        <div className="mt-auto flex items-center gap-2 text-primary text-sm font-bold uppercase tracking-wider group-hover:gap-3 transition-all">
                                            <span>Read More</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </main>
    );
}
