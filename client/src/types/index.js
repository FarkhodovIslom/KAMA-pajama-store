/**
 * @typedef {Object} Product
 * @property {number} id
 * @property {string} name
 * @property {string} description
 * @property {number} price
 * @property {string} category
 * @property {number} categoryId
 * @property {string[]} images
 * @property {boolean} inStock
 * @property {'hit'|'new'|'sale'|'premium'|null} [badge]
 * @property {string} createdAt
 * @property {boolean} [popular]
 * @property {ProductVariant[]} variants
 */

/**
 * @typedef {Object} ProductVariant
 * @property {number} id
 * @property {number} productId
 * @property {string} size
 * @property {string} color
 * @property {number} stockQty
 */

/**
 * @typedef {Object} Category
 * @property {number} id
 * @property {string} name
 * @property {string} slug
 */

/**
 * @typedef {Object} CartItem
 * @property {Product} product
 * @property {ProductVariant} variant
 * @property {number} quantity
 */

/**
 * @typedef {Object} Order
 * @property {number} id
 * @property {string} customerName
 * @property {string} phone
 * @property {string} [comment]
 * @property {CartItem[]} items
 * @property {number} totalPrice
 * @property {string} createdAt
 * @property {'new'|'processing'|'completed'} status
 */

/**
 * @typedef {Object} FilterState
 * @property {string} category
 * @property {string[]} sizes
 * @property {string[]} colors
 * @property {number|null} minPrice
 * @property {number|null} maxPrice
 * @property {string} search
 * @property {'price-asc'|'price-desc'|'newest'|'popular'} sort
 */

// Re-export for convenience - these are type aliases, not runtime values
module.exports = {
  Product: {},
  ProductVariant: {},
  Category: {},
  CartItem: {},
  Order: {},
  FilterState: {}
};

