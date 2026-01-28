import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generateSlug } from "@/lib/utils";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * n8n News Webhook
 * Receives STRICTLY: { english: { title, content, excerpt, tags, published, image } }
 * - Downloads image from URL and uploads to Supabase Storage
 * - Maps to Supabase: news table
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();

        // 1. Strict Validation - must have exactly this structure
        if (!body.english) {
            return NextResponse.json(
                { success: false, error: "Invalid payload: missing 'english' object" },
                { status: 400 }
            );
        }

        const { title, content, excerpt, tags, published, image } = body.english;

        // Validate required fields
        if (!title || !content) {
            return NextResponse.json(
                { success: false, error: "Missing required fields: title or content" },
                { status: 400 }
            );
        }

        // Validate types
        if (typeof title !== "string" || typeof content !== "string") {
            return NextResponse.json(
                { success: false, error: "Invalid types: title and content must be strings" },
                { status: 400 }
            );
        }

        // 2. Download and upload image to Supabase Storage if provided
        let uploadedImageUrl = "";
        
        if (image && typeof image === "string" && image.trim() !== "") {
            try {
                console.log("📥 Downloading image from:", image);
                
                // Download image from URL
                const imageResponse = await fetch(image);
                
                if (!imageResponse.ok) {
                    throw new Error(`Failed to download image: ${imageResponse.statusText}`);
                }

                // Get image content type
                const contentType = imageResponse.headers.get("content-type") || "image/jpeg";
                
                if (!contentType.startsWith("image/")) {
                    throw new Error("URL does not point to an image");
                }

                // Get image buffer
                const arrayBuffer = await imageResponse.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);

                // Validate file size (max 10MB)
                if (buffer.length > 10 * 1024 * 1024) {
                    throw new Error("Image size must be less than 10MB");
                }

                // Create Supabase client with service role key for storage operations
                const supabase = createClient(supabaseUrl, supabaseServiceKey);

                // Generate unique filename
                const fileExt = contentType.split("/")[1] || "jpg";
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
                const filePath = `images/news/${fileName}`;

                // Upload to Supabase Storage
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from("assets")
                    .upload(filePath, buffer, {
                        contentType,
                        cacheControl: "3600",
                        upsert: false,
                    });

                if (uploadError) {
                    console.error("❌ Image upload error:", uploadError);
                    throw new Error(`Failed to upload image: ${uploadError.message}`);
                }

                // Generate public URL
                uploadedImageUrl = `${supabaseUrl}/storage/v1/object/public/assets/${filePath}`;
                console.log("✅ Image uploaded successfully:", uploadedImageUrl);

            } catch (imageError: any) {
                console.error("❌ Image processing error:", imageError);
                return NextResponse.json(
                    { 
                        success: false, 
                        error: `Image processing failed: ${imageError.message}` 
                    },
                    { status: 400 }
                );
            }
        }

        // 3. Data Preparation
        const slug = generateSlug(title);

        // Handle tags: ensuring it's an array for text[]
        const processedTags = Array.isArray(tags) ? tags : [];

        // 4. Insert into Supabase
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        
        // Prepare data with empty russian object to satisfy schema requirements
        const insertData = {
            slug,
            title_en: title,
            content_en: content,
            excerpt_en: excerpt || "",
            tags: processedTags,
            image: uploadedImageUrl || "",
            published: typeof published === "boolean" ? published : true,
            updated_at: new Date().toISOString(),
            // Add empty russian object as required by schema
            russian: {
                title: "",
                content: "",
                excerpt: "",
            },
        };
        
        const { data, error } = await supabase
            .from("news")
            .insert([insertData])
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

    } catch (err: any) {
        console.error("❌ Webhook API Error:", err);
        return NextResponse.json(
            { success: false, error: err.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
