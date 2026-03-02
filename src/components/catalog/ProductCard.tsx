import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
    id: string;
    name: string;
    price: number;
    image?: string | null;
}

export default function ProductCard({ id, name, price, image }: ProductCardProps) {
    return (
        <Link href={`/product/${id}`} className="block group">
            <div className="flex flex-col gap-3">
                {/* Image Container */}
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[var(--kama-beige)] group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all">
                    {image ? (
                        <Image
                            src={image}
                            alt={name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width: 834px) 50vw, 33vw"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--kama-primary-light)" strokeWidth="1">
                                <rect x="3" y="3" width="18" height="18" rx="2" />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                                <path d="M21 15l-5-5L5 21" />
                            </svg>
                        </div>
                    )}

                    {/* Floating Add Button */}
                    <button
                        className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-[var(--kama-primary)] hover:bg-[var(--kama-primary)] hover:text-white transition-colors z-10"
                        onClick={(e) => {
                            e.preventDefault();
                            // Future: Fast add logic
                        }}
                        aria-label="Savatga qo'shish"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                    </button>
                </div>

                {/* Info Text */}
                <div className="flex justify-between items-start gap-2 w-full px-1">
                    <div className="flex flex-col">
                        <h3 className="text-sm font-bold text-[var(--kama-gray-900)] line-clamp-2">
                            {name}
                        </h3>
                        {/* Placeholder subtitle since real DB lacks this feature for now */}
                        <p className="text-xs text-[var(--kama-gray-500)] mt-0.5 font-medium">
                            Premium Sifat
                        </p>
                    </div>
                    <p className="text-sm font-bold text-[var(--kama-primary)] whitespace-nowrap">
                        {formatPrice(price)}
                    </p>
                </div>
            </div>
        </Link>
    );
}

