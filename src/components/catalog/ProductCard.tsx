import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui";

interface ProductCardProps {
    id: string;
    name: string;
    price: number;
    image?: string | null;
}

export default function ProductCard({ id, name, price, image }: ProductCardProps) {
    return (
        <Link href={`/product/${id}`} className="block">
            <Card interactive padding="none" className="overflow-hidden h-full flex flex-col">
                {/* Image */}
                <div className="relative aspect-square bg-gradient-to-br from-[var(--kama-beige)] to-[var(--kama-rose)]">
                    {image ? (
                        <Image
                            src={image}
                            alt={name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 834px) 50vw, 33vw"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--kama-gold-light)" strokeWidth="1">
                                <rect x="3" y="3" width="18" height="18" rx="2" />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                                <path d="M21 15l-5-5L5 21" />
                            </svg>
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                    <h3 className="text-base font-medium text-[var(--kama-gray-900)] mb-2 line-clamp-2">
                        {name}
                    </h3>
                    <p className="text-lg font-semibold text-[var(--kama-gold-dark)]">
                        {formatPrice(price)}
                    </p>
                </div>
            </Card>
        </Link>
    );
}

function formatPrice(price: number): string {
    return new Intl.NumberFormat("uz-UZ", {
        style: "currency",
        currency: "UZS",
        maximumFractionDigits: 0,
    }).format(price);
}
