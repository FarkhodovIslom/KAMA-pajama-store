"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui";

interface ImageUploadProps {
    onUploadStart?: () => void;
    onUploadSuccess: (url: string) => void;
    onUploadError?: (error: string) => void;
}

export function ImageUpload({
    onUploadStart,
    onUploadSuccess,
    onUploadError,
}: ImageUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = async (file: File) => {
        if (!file) return;

        // Basic client-side validation
        const validTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!validTypes.includes(file.type)) {
            onUploadError?.("Faqat JPEG, PNG va WebP formatlari qabul qilinadi.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            onUploadError?.("Fayl hajmi 5MB dan oshmasligi kerak.");
            return;
        }

        setIsUploading(true);
        onUploadStart?.();

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Rasm yuklashda xatolik yuz berdi");
            }

            onUploadSuccess(data.url);
        } catch (error: any) {
            console.error("Upload failed", error);
            onUploadError?.(error.message || "Rasm yuklashda xatolik yuz berdi");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = ""; // Reset input
            }
        }
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFile(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
            e.dataTransfer.clearData();
        }
    };

    return (
        <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer flex flex-col items-center justify-center gap-4
                ${isDragging ? "border-[var(--kama-primary)] bg-[var(--kama-beige)]" : "border-[var(--kama-gray-200)] hover:border-[var(--kama-primary-light)] hover:bg-[var(--kama-gray-50)]"}
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !isUploading && fileInputRef.current?.click()}
        >
            <input
                type="file"
                ref={fileInputRef}
                onChange={onFileChange}
                accept="image/jpeg, image/png, image/webp"
                className="hidden"
                disabled={isUploading}
            />

            <div className="w-12 h-12 rounded-full bg-[var(--kama-gray-100)] flex items-center justify-center text-[var(--kama-primary)]">
                {isUploading ? (
                    <svg className="animate-spin w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                )}
            </div>

            <div>
                <h4 className="font-semibold text-[var(--kama-gray-900)] text-sm">
                    {isUploading ? "Yuklanmoqda..." : "Rasmni yuklash"}
                </h4>
                <p className="text-xs text-[var(--kama-gray-500)] mt-1">
                    {isUploading ? "Iltimos, kuting" : "Faylni shu yerga tashlang yoki bosing. (max 5MB)"}
                </p>
                <p className="text-[10px] text-[var(--kama-gray-400)] mt-1">
                    JPEG, PNG, WebP
                </p>
            </div>

            <Button
                variant="secondary"
                size="sm"
                disabled={isUploading}
                onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                }}
            >
                Fayl tanlash
            </Button>
        </div>
    );
}
