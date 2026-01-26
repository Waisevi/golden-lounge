import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateSlug } from "@/lib/utils";

/**
 * n8n News Webhook
 * Receives: { english: { title, content, excerpt, tags, published, image } }
 * Maps to Supabase: news table
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();

        // 1. Validation
        if (!body.english) {
            return NextResponse.json(
                { success: false, error: "Invalid payload: missing 'english' object" },
                { status: 400 }
            );
        }

        const { title, content, excerpt, tags, published, image } = body.english;

        if (!title || !content) {
            return NextResponse.json(
                { success: false, error: "Missing required fields: title or content" },
                { status: 400 }
            );
        }

        // 2. Data Preparation
        const slug = generateSlug(title);

        // Handle tags: ensuring it's an array for text[]
        const processedTags = Array.isArray(tags) ? tags : [];

        // 3. Insert into Supabase
        const { data, error } = await supabase
            .from("news")
            .insert([
                {
                    slug,
                    title_en: title,
                    content_en: content,
                    excerpt_en: excerpt || "",
                    tags: processedTags,
                    image: image || "",
                    published: typeof published === "boolean" ? published : true,
                    updated_at: new Date().toISOString(),
                },
            ])
            .select();

        if (error) {
            console.error("❌ Supabase Insertion Error:", error);

            // Check for unique constraint violation (slug)
            if (error.code === "23505") {
                return NextResponse.json(
                    { success: false, error: `A post with the title '${title}' already exists (duplicate slug).` },
                    { status: 409 }
                );
            }

            return NextResponse.json(
                { success: false, error: error.message },
                { status: 500 }
            );
        }

        console.log("✅ News Entry Created:", data);

        return NextResponse.json({
            success: true,
            message: "News entry successfully recorded",
            data: data[0],
        });

    } catch (err) {
        console.error("❌ Webhook API Error:", err);
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
