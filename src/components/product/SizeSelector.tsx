"use client";

interface ProductVariant {
    id: string;
    color: string;
    size: string;
    inStock: boolean;
}

interface SizeSelectorProps {
    sizes: string[];
    variants: ProductVariant[];
    selectedColor: string;
    selectedSize: string;
    onChange: (size: string) => void;
}

export default function SizeSelector({
    sizes,
    variants,
    selectedColor,
    selectedSize,
    onChange,
}: SizeSelectorProps) {
    if (sizes.length === 0) return null;

    return (
        <div className="detail-options">
            <div className="detail-option-label">Размер</div>
            <div className="detail-sizes">
                {sizes.map((size) => {
                    const variant = variants?.find(
                        (v) => v.color === selectedColor && v.size === size
                    );
                    const available = variant?.inStock ?? true;

                    return (
                        <button
                            key={size}
                            onClick={() => available && onChange(size)}
                            disabled={!available}
                            className={`detail-size ${selectedSize === size ? "active" : ""} ${!available ? "out-of-stock" : ""}`}
                        >
                            {size}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
