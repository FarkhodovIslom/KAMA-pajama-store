import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui";

interface CategoryCardProps {
    id: string;
    name: string;
    slug: string;
    icon?: string | null;
    productCount: number;
}

export default function CategoryCard({ name, slug, icon, productCount }: CategoryCardProps) {
    return (
        <Link href={`/category/${slug}`} className="block">
            <Card interactive padding="lg" className="text-center h-full">
                {/* Icon */}
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[var(--kama-beige)] to-[var(--kama-rose)] flex items-center justify-center">
                    {icon ? (
                        <Image
                            src={icon}
                            alt={name}
                            width={48}
                            height={48}
                            className="object-contain"
                        />
                    ) : (
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--kama-gold)" strokeWidth="1.5">
                            <path d="M16 6a4 4 0 1 1-8 0" strokeLinecap="round" />
                            <path d="M4 14s1-1 4-1 5 2 8 2 4-1 4-1" strokeLinecap="round" />
                            <path d="M4 14v6a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-6" strokeLinecap="round" />
                        </svg>
                    )}
                </div>

                {/* Name */}
                <h3 className="text-lg font-semibold text-[var(--kama-gray-900)] mb-1">
                    {name}
                </h3>

                {/* Product Count */}
                <p className="text-sm text-[var(--kama-gray-500)]">
                    {productCount} ta mahsulot
                </p>
            </Card>
        </Link>
    );
}
