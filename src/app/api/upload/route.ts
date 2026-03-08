import { NextResponse } from "next/server";
import crypto from "crypto";
import sharp from "sharp";
import { verifySession } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const BUCKET_NAME = "product-images";

export async function POST(request: Request) {
    const admin = await verifySession(request);
    if (!admin) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { error: "File size exceeds 5MB limit" },
                { status: 400 }
            );
        }

        const validTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!validTypes.includes(file.type)) {
            return NextResponse.json(
                { error: "Invalid file type. Only JPEG, PNG, and WebP are allowed." },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Generate a unique filename
        const uniqueId = crypto.randomUUID();
        const filename = `${uniqueId}.webp`; // We'll convert everything to WebP

        // Process image with Sharp
        const processedBuffer = await sharp(buffer)
            .resize({
                width: 1200,
                withoutEnlargement: true,
            })
            .webp({ quality: 80 })
            .toBuffer();

        // Upload to Supabase Storage
        const { error: uploadError } = await supabaseAdmin.storage
            .from(BUCKET_NAME)
            .upload(filename, processedBuffer, {
                contentType: "image/webp",
                upsert: false,
            });

        if (uploadError) {
            console.error("Supabase upload error:", uploadError);
            return NextResponse.json(
                { error: "Failed to upload file to storage" },
                { status: 500 }
            );
        }

        // Get public URL
        const { data: urlData } = supabaseAdmin.storage
            .from(BUCKET_NAME)
            .getPublicUrl(filename);

        const publicUrl = urlData.publicUrl;

        return NextResponse.json({ url: publicUrl }, { status: 201 });
    } catch (error) {
        console.error("Error uploading file:", error);
        return NextResponse.json(
            { error: "Failed to upload file" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    const admin = await verifySession(request);
    if (!admin) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { url } = body;

        if (!url || typeof url !== "string") {
            return NextResponse.json(
                { error: "Invalid or missing URL parameter" },
                { status: 400 }
            );
        }

        // Extract filename from Supabase URL
        // Format: https://[project].supabase.co/storage/v1/object/public/product-images/filename.webp
        const urlParts = url.split("/");
        const filename = urlParts[urlParts.length - 1];

        if (!filename || filename.includes("..")) {
            return NextResponse.json(
                { error: "Invalid filename" },
                { status: 400 }
            );
        }

        // Delete from Supabase Storage
        const { error: deleteError } = await supabaseAdmin.storage
            .from(BUCKET_NAME)
            .remove([filename]);

        if (deleteError) {
            console.error("Supabase delete error:", deleteError);
            return NextResponse.json(
                { error: "Failed to delete file" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting file:", error);
        return NextResponse.json(
            { error: "Failed to delete file" },
            { status: 500 }
        );
    }
}
