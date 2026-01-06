"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface CartItem {
    productId: string;
    name: string;
    price: number;
    color: string;
    size: string;
    quantity: number;
    image?: string | null;
}

interface CartContextType {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    updateQuantity: (productId: string, color: string, size: string, quantity: number) => void;
    removeItem: (productId: string, color: string, size: string) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "kama-cart";

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        if (stored) {
            try {
                setItems(JSON.parse(stored));
            } catch { }
        }
        setIsLoaded(true);
    }, []);

    // Save cart to localStorage on changes
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        }
    }, [items, isLoaded]);

    const addItem = (newItem: CartItem) => {
        setItems((prev) => {
            const existingIndex = prev.findIndex(
                (item) =>
                    item.productId === newItem.productId &&
                    item.color === newItem.color &&
                    item.size === newItem.size
            );

            if (existingIndex >= 0) {
                const updated = [...prev];
                updated[existingIndex].quantity += newItem.quantity;
                return updated;
            }

            return [...prev, newItem];
        });
    };

    const updateQuantity = (productId: string, color: string, size: string, quantity: number) => {
        setItems((prev) =>
            prev.map((item) =>
                item.productId === productId && item.color === color && item.size === size
                    ? { ...item, quantity: Math.max(1, quantity) }
                    : item
            )
        );
    };

    const removeItem = (productId: string, color: string, size: string) => {
        setItems((prev) =>
            prev.filter(
                (item) =>
                    !(item.productId === productId && item.color === color && item.size === size)
            )
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                updateQuantity,
                removeItem,
                clearCart,
                totalItems,
                totalPrice,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
