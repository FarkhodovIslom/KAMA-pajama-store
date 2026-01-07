"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui";
import { motion } from "framer-motion";

interface CategoryCardProps {
    id: string;
    name: string;
    slug: string;
    icon?: string | null;
    productCount: number;
}

export default function CategoryCard({ name, slug, icon, productCount }: CategoryCardProps) {
    return (
        <Link href={`/category/${slug}`} className="block h-full">
            <motion.div
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="h-full"
            >
                <Card interactive padding="lg" className="text-center h-full border-transparent hover:border-indigo-100 dark:border-indigo-900/50">
                    {/* Icon */}
                    <div className="group relative w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-tr from-indigo-50 to-pink-50 flex items-center justify-center transition-all duration-300 group-hover:from-indigo-100 group-hover:to-pink-100 group-hover:shadow-xl group-hover:shadow-indigo-500/20">
                        {icon ? (
                            <Image
                                src={icon}
                                alt={name}
                                width={48}
                                height={48}
                                className="object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-110"
                            />
                        ) : (
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--kama-primary)" strokeWidth="1.5" className="transition-transform duration-300 group-hover:scale-110">
                                <path d="M16 6a4 4 0 1 1-8 0" strokeLinecap="round" />
                                <path d="M4 14s1-1 4-1 5 2 8 2 4-1 4-1" strokeLinecap="round" />
                                <path d="M4 14v6a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-6" strokeLinecap="round" />
                            </svg>
                        )}
                    </div>

                    {/* Name */}
                    <h3 className="text-lg font-bold text-[var(--kama-gray-900)] mb-1 group-hover:text-[var(--kama-primary)] transition-colors">
                        {name}
                    </h3>

                    {/* Product Count */}
                    <p className="text-sm font-medium text-[var(--kama-gray-500)]">
                        {productCount} ta mahsulot
                    </p>
                </Card>
            </motion.div>
        </Link>
    );
}
