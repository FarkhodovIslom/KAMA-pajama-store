"use client";

import Image from "next/image";
import { Button } from "@/components/ui";

export interface ProductImageInput {
    url: string;
    isMain: boolean;
    color: string | null;
    sortOrder: number;
}

interface ImageManagerProps {
    images: ProductImageInput[];
    onChange: (images: ProductImageInput[]) => void;
    availableColors?: string[];
}

export function ImageManager({ images, onChange, availableColors = [] }: ImageManagerProps) {
    if (images.length === 0) {
        return null;
    }

    const setMainImage = (index: number) => {
        const newImages = images.map((img, i) => ({
            ...img,
            isMain: i === index,
        }));
        onChange(newImages);
    };

    const removeImage = (index: number) => {
        const newImages = [...images];
        const removed = newImages.splice(index, 1)[0];

        // If we removed the main image and there are others left, make the first one main
        if (removed.isMain && newImages.length > 0) {
            newImages[0].isMain = true;
        }

        onChange(newImages);
    };

    const setColor = (index: number, color: string) => {
        const newImages = [...images];
        newImages[index].color = color || null;
        onChange(newImages);
    };

    const moveImage = (index: number, direction: 'up' | 'down') => {
        if (
            (direction === 'up' && index === 0) ||
            (direction === 'down' && index === images.length - 1)
        ) {
            return;
        }

        const newImages = [...images];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;

        // Swap elements
        const temp = newImages[index];
        newImages[index] = newImages[swapIndex];
        newImages[swapIndex] = temp;

        // Update sortOrders to match array position
        const sortedImages = newImages.map((img, i) => ({
            ...img,
            sortOrder: i
        }));

        onChange(sortedImages);
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            {images.map((image, index) => (
                <div
                    key={`${image.url}-${index}`}
                    className={`relative group rounded-xl border-2 overflow-hidden bg-white
                        ${image.isMain ? 'border-[var(--kama-primary)]' : 'border-[var(--kama-gray-200)] hover:border-[var(--kama-gray-300)]'}
                    `}
                >
                    <div className="aspect-square relative flex items-center justify-center bg-[var(--kama-beige)]">
                        <Image
                            src={image.url}
                            alt={`Product image ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, 33vw"
                        />

                        {/* Top corner actions */}
                        <div className="absolute top-2 right-2 flex gap-1 z-10">
                            <button
                                type="button"
                                onClick={() => setMainImage(index)}
                                className={`p-1.5 rounded-full shadow-sm backdrop-blur-md transition-colors 
                                    ${image.isMain
                                        ? 'bg-[var(--kama-primary)] text-white'
                                        : 'bg-white/80 text-[var(--kama-gray-500)] hover:text-[var(--kama-primary)] hover:bg-white'}
                                `}
                                title="Asosiy rasm qilish"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill={image.isMain ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                </svg>
                            </button>
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="p-1.5 rounded-full shadow-sm backdrop-blur-md bg-white/80 text-[var(--kama-gray-500)] hover:text-red-600 hover:bg-red-50 transition-colors"
                                title="O'chirish"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>

                        {image.isMain && (
                            <span className="absolute top-2 left-2 bg-[var(--kama-primary)] text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10">
                                Asosiy
                            </span>
                        )}
                    </div>

                    <div className="p-3 bg-white border-t border-[var(--kama-gray-100)] flex flex-col gap-2 relative z-20">
                        {/* Assignment dropdown */}
                        {availableColors.length > 0 && (
                            <select
                                value={image.color || ""}
                                onChange={(e) => setColor(index, e.target.value)}
                                className="w-full text-xs p-1.5 rounded-md border border-[var(--kama-gray-200)] focus:border-[var(--kama-primary)] focus:outline-none"
                            >
                                <option value="">(Barcha ranglar)</option>
                                {availableColors.map((color) => (
                                    <option key={color} value={color}>
                                        {color}
                                    </option>
                                ))}
                            </select>
                        )}

                        {/* Order controls */}
                        <div className="flex items-center justify-between mt-1">
                            <span className="text-[10px] uppercase text-[var(--kama-gray-400)] font-medium">Tartib: {index + 1}</span>
                            <div className="flex gap-1">
                                <button
                                    type="button"
                                    onClick={() => moveImage(index, 'up')}
                                    disabled={index === 0}
                                    className="p-1 text-[var(--kama-gray-400)] hover:text-[var(--kama-gray-900)] disabled:opacity-30 disabled:hover:text-[var(--kama-gray-400)] transition-colors"
                                    title="Oldinga"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="15 18 9 12 15 6" />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => moveImage(index, 'down')}
                                    disabled={index === images.length - 1}
                                    className="p-1 text-[var(--kama-gray-400)] hover:text-[var(--kama-gray-900)] disabled:opacity-30 disabled:hover:text-[var(--kama-gray-400)] transition-colors"
                                    title="Orqaga"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="9 18 15 12 9 6" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
