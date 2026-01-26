import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { LeadForm } from "@/components/lead-form";
import { Calendar, User, ArrowLeft, Share2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getAssetUrl } from "@/lib/assets";

import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;

    const { data: article, error } = await supabase
        .from("news")
        .select("*")
        .eq("slug", slug)
        .single();

    if (!article || error) return { title: "Article Not Found" };

    const title = article.title_en || article.title || "";
    const excerpt = article.excerpt_en || article.excerpt || "";
    const author = article.author || "GD Lounge";
    const date = article.updated_at || article.created_at || new Date().toISOString();

    return {
        title: `${title} | GD Lounge & Bar Miami`,
        description: excerpt,
        openGraph: {
            title: title,
            description: excerpt,
            images: [getAssetUrl(article.image)],
            type: "article",
            publishedTime: date,
            authors: [author],
        },
    };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const { data: article, error } = await supabase
        .from("news")
        .select("*")
        .eq("slug", slug)
        .single();

    if (!article || error) {
        notFound();
    }

    // Преобразуем данные из формата БД
    const title = article.title_en || article.title || "";
    const content = article.content_en || article.content || "";
    const author = article.author || "GD Lounge";
    const category = article.category || article.tags?.[0] || "News";
    const date = article.updated_at || article.created_at 
        ? new Date(article.updated_at || article.created_at).toLocaleDateString("en-US", { 
            year: "numeric", 
            month: "long", 
            day: "numeric" 
        })
        : new Date().toLocaleDateString("en-US", { 
            year: "numeric", 
            month: "long", 
            day: "numeric" 
        });

    return (
        <main className="min-h-screen bg-background">
            <Header />

            <article className="pt-32 pb-16 lg:pt-40 lg:pb-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Back Button */}
                    <Link
                        href="/news"
                        className="inline-flex items-center gap-2 text-sm text-primary font-bold uppercase tracking-wider mb-8 hover:gap-3 transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to News</span>
                    </Link>

                    {/* Article Header */}
                    <div className="mb-12">
                        <div className="flex items-center gap-4 text-primary text-xs font-bold uppercase tracking-[0.2em] mb-6">
                            <span>{category}</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                            <span className="text-muted-foreground">{date}</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground font-serif tracking-tight leading-[1.1] mb-8">
                            {title}
                        </h1>

                        <div className="flex items-center justify-between border-y border-border/40 py-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                    {author.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-foreground">{author}</p>
                                    <p className="text-xs text-muted-foreground">Lounge Contributor</p>
                                </div>
                            </div>

                            <button className="w-10 h-10 rounded-full border border-border/50 flex items-center justify-center text-muted-foreground hover:bg-primary hover:border-primary hover:text-white transition-all">
                                <Share2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Post Image */}
                    <div className="relative aspect-[16/9] rounded-[2rem] overflow-hidden mb-12 shadow-2xl">
                        <Image
                            src={getAssetUrl(article.image)}
                            alt={title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

                    {/* Content */}
                    <div className="mb-24">
                        <div
                            className="text-muted-foreground leading-relaxed space-y-6 [&>h2]:text-3xl [&>h2]:font-serif [&>h2]:text-foreground [&>h2]:font-bold [&>h2]:tracking-tight [&>h2]:mt-10 [&>h2]:mb-4 [&>h3]:text-xl [&>h3]:font-serif [&>h3]:text-foreground [&>h3]:font-semibold [&>h3]:mt-8 [&>h3]:mb-3 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-2 [&>li]:text-muted-foreground [&>p]:text-lg sm:[&>p]:text-xl [&>p+h2]:mt-12 [&>p+h3]:mt-10"
                            dangerouslySetInnerHTML={{ __html: content }}
                        />
                    </div>

                    {/* Reservation CTA Area */}
                    <hr className="border-border/40 mb-20" />

                    <div className="max-w-3xl mx-auto">
                        <div className="text-center mb-12">
                            <span className="text-sm font-semibold text-primary uppercase tracking-[0.2em]">Next Step</span>
                            <h2 className="text-3xl sm:text-4xl font-bold text-foreground font-serif mt-4">Make it a Night to Remember</h2>
                            <p className="text-muted-foreground mt-4 leading-relaxed">
                                Inspired by the story? Reserve your spot now for an elite experience in our lounge.
                            </p>
                        </div>

                        <LeadForm
                            formType="reserve"
                            title="Secure Your Reservation"
                            description="Fill out the form below and our VIP concierge will contact you shortly to confirm your booking."
                            buttonText="Request Reservation"
                            className="shadow-2xl border-primary/10"
                        />
                    </div>
                </div>
            </article>

            <Footer />
        </main>
    );
}
