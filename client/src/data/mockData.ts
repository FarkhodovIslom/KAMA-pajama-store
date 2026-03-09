
import type { Product, Category } from '../types';

export const categories: Category[] = [
  { id: 1, name: 'Женские', slug: 'women' },
  { id: 2, name: 'Мужские', slug: 'men' },
  { id: 3, name: 'Детские', slug: 'kids' },
];

export const products: Product[] = [
  {
    id: 1,
    name: 'Набор «Ночное небо»',
    description: 'Мягкая и уютная пижама из 100% хлопка. Отличный выбор для комфортного сна. Материал дышащий, не вызывает раздражения.',
    price: 89000,
    category: 'Женские',
    categoryId: 1,
    images: ['/products/p1-1.jpg', '/products/p1-2.jpg', '/products/p1-3.jpg'],
    inStock: true,
    badge: 'hit',
    createdAt: '2024-01-15',
    popular: true,
    variants: [
      { id: 1, productId: 1, size: 'XS', color: 'Тёмно-синий', stockQty: 5 },
      { id: 2, productId: 1, size: 'S', color: 'Тёмно-синий', stockQty: 8 },
      { id: 3, productId: 1, size: 'M', color: 'Тёмно-синий', stockQty: 3 },
      { id: 4, productId: 1, size: 'L', color: 'Тёмно-синий', stockQty: 0 },
    ]
  },
  {
    id: 2,
    name: 'Пижама «Мишки»',
    description: 'Очаровательная детская пижама с милыми мишками. Удобная резинка на поясе и манжетах.',
    price: 65000,
    category: 'Детские',
    categoryId: 3,
    images: ['/products/p2-1.jpg'],
    inStock: true,
    badge: 'new',
    createdAt: '2024-02-01',
    variants: [
      { id: 5, productId: 2, size: '86', color: 'Розовый', stockQty: 4 },
      { id: 6, productId: 2, size: '92', color: 'Розовый', stockQty: 6 },
      { id: 7, productId: 2, size: '98', color: 'Розовый', stockQty: 2 },
      { id: 8, productId: 2, size: '104', color: 'Розовый', stockQty: 5 },
    ]
  },
  {
    id: 3,
    name: '«Лесная сказка»',
    description: 'Элегантная пижама с лесным принтом. Свободный крой обеспечивает максимальный комфорт.',
    price: 95000,
    category: 'Женские',
    categoryId: 1,
    images: ['/products/p3-1.jpg'],
    inStock: true,
    badge: null,
    createdAt: '2024-01-20',
    variants: [
      { id: 9, productId: 3, size: 'S', color: 'Зелёный', stockQty: 7 },
      { id: 10, productId: 3, size: 'M', color: 'Зелёный', stockQty: 4 },
      { id: 11, productId: 3, size: 'L', color: 'Зелёный', stockQty: 2 },
      { id: 12, productId: 3, size: 'XL', color: 'Зелёный', stockQty: 0 },
    ]
  },
  {
    id: 4,
    name: 'Пижама «Море»',
    description: 'Мужская пижама в морском стиле. Качественная ткань, которая сохраняет форму после стирки.',
    price: 72000,
    category: 'Мужские',
    categoryId: 2,
    images: ['/products/p4-1.jpg'],
    inStock: true,
    badge: null,
    createdAt: '2024-01-25',
    popular: true,
    variants: [
      { id: 13, productId: 4, size: 'M', color: 'Синий', stockQty: 5 },
      { id: 14, productId: 4, size: 'L', color: 'Синий', stockQty: 8 },
      { id: 15, productId: 4, size: 'XL', color: 'Синий', stockQty: 3 },
      { id: 16, productId: 4, size: 'XXL', color: 'Синий', stockQty: 4 },
    ]
  },
  {
    id: 5,
    name: 'Набор «Звёздочки»',
    description: 'Детский комплект с блёстками. В комплекте пижама и мягкие носочки.',
    price: 58000,
    category: 'Детские',
    categoryId: 3,
    images: ['/products/p5-1.jpg'],
    inStock: true,
    badge: 'hit',
    createdAt: '2024-02-05',
    variants: [
      { id: 17, productId: 5, size: '86', color: 'Золотой', stockQty: 3 },
      { id: 18, productId: 5, size: '92', color: 'Золотой', stockQty: 5 },
      { id: 19, productId: 5, size: '98', color: 'Золотой', stockQty: 2 },
    ]
  },
  {
    id: 6,
    name: 'Пижама «Облака»',
    description: 'Премиальная пижама из бамбукового волокна. Невероятно мягкая и нежная к коже.',
    price: 110000,
    category: 'Женские',
    categoryId: 1,
    images: ['/products/p6-1.jpg'],
    inStock: true,
    badge: 'premium',
    createdAt: '2024-02-10',
    variants: [
      { id: 20, productId: 6, size: 'XS', color: 'Белый', stockQty: 2 },
      { id: 21, productId: 6, size: 'S', color: 'Белый', stockQty: 4 },
      { id: 22, productId: 6, size: 'M', color: 'Белый', stockQty: 6 },
      { id: 23, productId: 6, size: 'L', color: 'Белый', stockQty: 3 },
    ]
  },
  {
    id: 7,
    name: 'Комплект «Зефир»',
    description: 'Нежная розовая пижама из флиса. Идеальна для холодных зимних вечеров.',
    price: 83000,
    category: 'Женские',
    categoryId: 1,
    images: ['/products/p7-1.jpg'],
    inStock: true,
    badge: null,
    createdAt: '2024-01-28',
    variants: [
      { id: 24, productId: 7, size: 'S', color: 'Розовый', stockQty: 5 },
      { id: 25, productId: 7, size: 'M', color: 'Розовый', stockQty: 7 },
      { id: 26, productId: 7, size: 'L', color: 'Розовый', stockQty: 4 },
    ]
  },
  {
    id: 8,
    name: '«Тигрёнок»',
    description: 'Забавная детская пижама с тигрёнком. Яркие цвета порадуют любого ребёнка.',
    price: 69000,
    category: 'Детские',
    categoryId: 3,
    images: ['/products/p8-1.jpg'],
    inStock: true,
    badge: 'new',
    createdAt: '2024-02-12',
    variants: [
      { id: 27, productId: 8, size: '92', color: 'Оранжевый', stockQty: 4 },
      { id: 28, productId: 8, size: '98', color: 'Оранжевый', stockQty: 6 },
      { id: 29, productId: 8, size: '104', color: 'Оранжевый', stockQty: 3 },
      { id: 30, productId: 8, size: '110', color: 'Оранжевый', stockQty: 5 },
    ]
  },
  {
    id: 9,
    name: 'Пижама «Грация»',
    description: 'Элегантная шёлковая пижама для особых случаев. Смотрится роскошно.',
    price: 145000,
    category: 'Женские',
    categoryId: 1,
    images: ['/products/p9-1.jpg'],
    inStock: false,
    badge: 'sale',
    createdAt: '2024-01-10',
    variants: [
      { id: 31, productId: 9, size: 'S', color: 'Чёрный', stockQty: 0 },
      { id: 32, productId: 9, size: 'M', color: 'Чёрный', stockQty: 0 },
      { id: 33, productId: 9, size: 'L', color: 'Чёрный', stockQty: 0 },
    ]
  },
  {
    id: 10,
    name: '«Классика» мужская',
    description: 'Классическая мужская пижама в строгом стиле. Идеальна для деловых людей.',
    price: 78000,
    category: 'Мужские',
    categoryId: 2,
    images: ['/products/p10-1.jpg'],
    inStock: true,
    badge: null,
    createdAt: '2024-01-30',
    popular: true,
    variants: [
      { id: 34, productId: 10, size: 'M', color: 'Серый', stockQty: 6 },
      { id: 35, productId: 10, size: 'L', color: 'Серый', stockQty: 9 },
      { id: 36, productId: 10, size: 'XL', color: 'Серый', stockQty: 4 },
      { id: 37, productId: 10, size: 'XXL', color: 'Серый', stockQty: 2 },
    ]
  },
  {
    id: 11,
    name: '«Единорог»',
    description: 'Волшебная пижама с единорогом. Светится в темноте!',
    price: 72000,
    category: 'Детские',
    categoryId: 3,
    images: ['/products/p11-1.jpg'],
    inStock: true,
    badge: 'new',
    createdAt: '2024-02-15',
    variants: [
      { id: 38, productId: 11, size: '86', color: 'Фиолетовый', stockQty: 3 },
      { id: 39, productId: 11, size: '92', color: 'Фиолетовый', stockQty: 5 },
      { id: 40, productId: 11, size: '98', color: 'Фиолетовый', stockQty: 4 },
    ]
  },
  {
    id: 12,
    name: '«Уютный вечер»',
    description: 'Комплект из мягкого трикотажа. Отлично подходит для домашних посиделок.',
    price: 92000,
    category: 'Женские',
    categoryId: 1,
    images: ['/products/p12-1.jpg'],
    inStock: true,
    badge: null,
    createdAt: '2024-02-08',
    variants: [
      { id: 41, productId: 12, size: 'XS', color: ' Бежевый', stockQty: 4 },
      { id: 42, productId: 12, size: 'S', color: ' Бежевый', stockQty: 6 },
      { id: 43, productId: 12, size: 'M', color: ' Бежевый', stockQty: 8 },
      { id: 44, productId: 12, size: 'L', color: ' Бежевый', stockQty: 5 },
    ]
  },
];

// Placeholder images с цветами для каждого товара
export const getProductPlaceholder = (product: Product): string => {
  const colorMap: Record<string, string> = {
    'Тёмно-синий': '#4A5568',
    'Розовый': '#F8CEDD',
    'Зелёный': '#C8E8CC',
    'Синий': '#C0D8F0',
    'Золотой': '#F8E8B0',
    'Белый': '#F5F5F5',
    'Оранжевый': '#F8D8A8',
    'Чёрный': '#2D3748',
    'Серый': '#A0AEC0',
    'Фиолетовый': '#D8C8F0',
    ' Бежевый': '#F5E6D3',
  };

  const color = product.variants[0]?.color || 'Розовый';
  return colorMap[color] || '#F8CEDD';
};

// Все уникальные размеры
export const allSizes = Array.from(new Set(
  products.flatMap(p => p.variants.map(v => v.size))
)).sort((a, b) => {
  const numA = parseInt(a);
  const numB = parseInt(b);
  if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
  return a.localeCompare(b);
});

// Все уникальные цвета
export const allColors = Array.from(new Set(
  products.flatMap(p => p.variants.map(v => v.color.trim()))
));
