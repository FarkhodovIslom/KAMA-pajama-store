"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

interface ProductImage {
    id: string;
    url: string;
    color: string | null;
    isMain: boolean;
}

interface ImageGalleryProps {
    images: ProductImage[];
    selectedColor?: string;
    productName: string;
}

export default function ImageGallery({ images, selectedColor, productName }: ImageGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    // Embla carousel for mobile
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, dragFree: false });

    // Check if mobile
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Filter images by selected color
    const displayImages = images.filter(
        (img) => !img.color || img.color === selectedColor
    );

    const mainImage = displayImages[activeIndex]?.url || displayImages[0]?.url || images[0]?.url;

    const handleThumbnailClick = useCallback((index: number) => {
        setActiveIndex(index);
        if (emblaApi) {
            emblaApi.scrollTo(index);
        }
    }, [emblaApi]);

    // Handle color change - reset to first image
    useEffect(() => {
        setActiveIndex(0);
        if (emblaApi) {
            emblaApi.scrollTo(0);
        }
    }, [selectedColor, emblaApi]);

    // Sync embla scroll with activeIndex
    useEffect(() => {
        if (!emblaApi) return;
        const onSelect = () => setActiveIndex(emblaApi.selectedScrollSnap());
        emblaApi.on("select", onSelect);
        return () => { emblaApi.off("select", onSelect); };
    }, [emblaApi]);

    if (!images || images.length === 0) {
        return (
            <div className="detail-main-img" style={{ aspectRatio: "4/5", background: "var(--subtle)", borderRadius: "var(--radius-card)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 80, opacity: 0.3 }}>👗</span>
            </div>
        );
    }

    if (displayImages.length === 0) {
        return (
            <div className="detail-main-img" style={{ aspectRatio: "4/5", background: "var(--subtle)", borderRadius: "var(--radius-card)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 80, opacity: 0.3 }}>👗</span>
            </div>
        );
    }

    // Mobile: Embla Carousel with swipe
    if (isMobile && displayImages.length > 1) {
        return (
            <div className="detail-gallery-mobile">
                {/* Carousel */}
                <div className="embla" ref={emblaRef}>
                    <div className="embla__container">
                        {displayImages.map((img, idx) => (
                            <div key={img.id} className="embla__slide">
                                <div className="detail-main-img" style={{ aspectRatio: "4/5" }}>
                                    <Image
                                        src={img.url}
                                        alt={`${productName} - ${idx + 1}`}
                                        fill
                                        className="object-cover"
                                        sizes="100vw"
                                        priority={idx === 0}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Dots indicator */}
                <div className="embla-dots">
                    {displayImages.map((_, idx) => (
                        <button
                            key={idx}
                            className={`embla-dot ${activeIndex === idx ? "active" : ""}`}
                            onClick={() => handleThumbnailClick(idx)}
                            aria-label={`Go to image ${idx + 1}`}
                        />
                    ))}
                </div>

                {/* Thumbnails (optional, below carousel) */}
                {displayImages.length > 1 && (
                    <div className="detail-thumbnails" style={{ marginTop: 12, justifyContent: "center" }}>
                        {displayImages.map((img, idx) => (
                            <button
                                key={img.id}
                                className={`detail-thumb ${activeIndex === idx ? "active" : ""}`}
                                onClick={() => handleThumbnailClick(idx)}
                            >
                                <Image
                                    src={img.url}
                                    alt={`${productName} - ${idx + 1}`}
                                    width={60}
                                    height={75}
                                    style={{ objectFit: "cover" }}
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // Desktop: Static image with thumbnails
    return (
        <div className="detail-gallery">
            {/* Main Image */}
            <div className="detail-main-img">
                <Image
                    src={mainImage}
                    alt={productName}
                    fill
                    className="object-cover"
                    sizes="(max-width: 900px) 100vw, 50vw"
                    priority
                />
            </div>

            {/* Thumbnails */}
            {displayImages.length > 1 && (
                <div className="detail-thumbnails">
                    {displayImages.map((img, idx) => (
                        <button
                            key={img.id}
                            className={`detail-thumb ${activeIndex === idx ? "active" : ""}`}
                            onClick={() => handleThumbnailClick(idx)}
                        >
                            <Image
                                src={img.url}
                                alt={`${productName} - ${idx + 1}`}
                                width={80}
                                height={100}
                                style={{ objectFit: "cover" }}
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}