export function formatPrice(price: number): string {
    return new Intl.NumberFormat("uz-UZ", {
        style: "currency",
        currency: "UZS",
        maximumFractionDigits: 0,
    }).format(price);
}
