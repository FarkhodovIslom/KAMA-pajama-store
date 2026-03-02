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
    const isSale = slug === "sale" || slug === "rasprodaja" || name.toLowerCase().includes("sale") || name.toLowerCase().includes("aksik");

    return (
        <Link href={`/category/${slug}`} className="block h-full group">
            <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className={`h-full relative rounded-3xl overflow-hidden shadow-sm hover:shadow-md border border-[var(--kama-gray-100)] flex flex-col items-center justify-center p-6 text-center ${isSale ? "bg-[var(--kama-champagne)] border-[var(--kama-primary-light)/30]" : "bg-white"
                    }`}
            >
                {/* Content */}
                <div className={`w-16 h-16 mb-4 rounded-full flex items-center justify-center transition-transform duration-500 group-hover:scale-110 ${isSale ? "bg-[var(--kama-primary)] text-white" : ""
                    }`}>
                    {icon ? (
                        <Image
                            src={icon}
                            alt={name}
                            width={40}
                            height={40}
                            className="object-contain"
                        />
                    ) : (
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={isSale ? "currentColor" : "var(--kama-primary)"} strokeWidth="1.5">
                            {isSale ? (
                                <>
                                    <line x1="19" y1="5" x2="5" y2="19"></line>
                                    <circle cx="6.5" cy="6.5" r="2.5"></circle>
                                    <circle cx="17.5" cy="17.5" r="2.5"></circle>
                                </>
                            ) : (
                                <>
                                    <path d="M16 6a4 4 0 1 1-8 0" strokeLinecap="round" />
                                    <path d="M4 14s1-1 4-1 5 2 8 2 4-1 4-1" strokeLinecap="round" />
                                    <path d="M4 14v6a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-6" strokeLinecap="round" />
                                </>
                            )}
                        </svg>
                    )}
                </div>

                <h3 className={`text-lg font-bold mb-1.5 transition-colors group-hover:text-[var(--kama-primary)] ${isSale ? "text-[var(--kama-primary-dark)]" : "text-[var(--kama-gray-900)]"
                    }`}>
                    {name}
                </h3>

                <p className={`text-xs font-medium ${isSale ? "text-[var(--kama-primary)]" : "text-[var(--kama-gray-500)]"
                    }`}>
                    {productCount} modellar
                </p>
            </motion.div>
        </Link>
    );
}
