import { getAuthToken } from './authService';
import * as SecureStore from 'expo-secure-store';
// Storage key for cart data
const CART_STORAGE_KEY = 'food_delivery_cart';

// In-memory cache of the cart
let currentCart = null;

// Simulated delivery fee calculation
const DELIVERY_BASE_FEE = 2.99;
const DELIVERY_DISTANCE_FACTOR = 0.5;
const DELIVERY_ITEM_FACTOR = 0.2;

/**
 * Initialize the cart service
 * @returns {Promise<void>}
 */
export const initCartService = async () => {
  try {
    // Load cart from storage
    await loadCartFromStorage();
  } catch (error) {
    console.error('Failed to initialize cart service:', error);
    
    // Reset cart to empty state
    currentCart = createEmptyCart();
    await saveCartToStorage();
  }
};

/**
 * Create an empty cart structure
 * @returns {Object} Empty cart object
 */
const createEmptyCart = () => {
  return {
    items: [],
    subtotal: 0,
    deliveryFee: 0,
    total: 0
  };
};

/**
 * Load cart data from secure storage
 * @returns {Promise<Object>} Cart data
 */
const loadCartFromStorage = async () => {
  try {
    const cartData = await SecureStore.getItemAsync(CART_STORAGE_KEY);
    
    if (cartData) {
      currentCart = JSON.parse(cartData);
    } else {
      currentCart = createEmptyCart();
    }
    
    return currentCart;
  } catch (error) {
    console.error('Failed to load cart from storage:', error);
    currentCart = createEmptyCart();
    throw error;
  }
};

/**
 * Save cart data to secure storage
 * @returns {Promise<void>}
 */
const saveCartToStorage = async () => {
  try {
    await SecureStore.setItemAsync(CART_STORAGE_KEY, JSON.stringify(currentCart));
  } catch (error) {
    console.error('Failed to save cart to storage:', error);
    throw error;
  }
};

/**
 * Recalculate cart totals
 * @returns {Object} Updated cart with recalculated totals
 */
const recalculateCart = () => {
  if (!currentCart) {
    currentCart = createEmptyCart();
  }
  
  // Calculate subtotal
  let subtotal = 0;
  currentCart.items.forEach(item => {
    subtotal += item.price * item.quantity;
  });
  
  // Calculate delivery fee based on number of items and simulated distance
  const itemCount = currentCart.items.reduce((total, item) => total + item.quantity, 0);
  const deliveryFee = itemCount > 0 
    ? DELIVERY_BASE_FEE + (DELIVERY_DISTANCE_FACTOR * 1.5) + (DELIVERY_ITEM_FACTOR * (itemCount - 1))
    : 0;
  
  // Round to 2 decimal places
  subtotal = parseFloat(subtotal.toFixed(2));
  const roundedDeliveryFee = parseFloat(deliveryFee.toFixed(2));
  
  // Update cart totals
  currentCart.subtotal = subtotal;
  currentCart.deliveryFee = roundedDeliveryFee;
  currentCart.total = parseFloat((subtotal + roundedDeliveryFee).toFixed(2));
  
  return currentCart;
};

/**
 * Get the current cart
 * @returns {Promise<Object>} Cart data
 */
export const getCart = async () => {
  // If cart is not loaded, load it from storage
  if (!currentCart) {
    await loadCartFromStorage();
  }
  
  // Always recalculate totals to ensure they're accurate
  recalculateCart();
  
  return currentCart;
};

/**
 * Add an item to the cart
 * @param {Object} item - Item to add to cart
 * @param {number} quantity - Quantity to add
 * @param {Array} options - Selected options for the item
 * @returns {Promise<Object>} Updated cart
 */
export const addToCart = async (item, quantity = 1, options = []) => {
  try {
    // If cart is not loaded, load it from storage
    if (!currentCart) {
      await loadCartFromStorage();
    }
    
    // Check if this item with the same options already exists in cart
    const existingItemIndex = currentCart.items.findIndex(cartItem => {
      // Check if item ID matches
      if (cartItem.id !== item.id) return false;
      
      // If no options, or options length doesn't match, it's not the same
      if (!options.length && !cartItem.options.length) return true;
      if (options.length !== cartItem.options.length) return false;
      
      // Check if all options match
      const optionsSorted = [...options].sort();
      const cartOptionsSorted = [...cartItem.options].sort();
      
      return optionsSorted.every((opt, idx) => opt === cartOptionsSorted[idx]);
    });
    
    if (existingItemIndex !== -1) {
      // Update quantity of existing item
      currentCart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      currentCart.items.push({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity,
        options: options || [],
        restaurantId: item.restaurantId || null,
        restaurantName: item.restaurantName || null
      });
    }
    
    // Recalculate totals
    recalculateCart();
    
    // Save updated cart
    await saveCartToStorage();
    
    return currentCart;
  } catch (error) {
    console.error('Failed to add item to cart:', error);
    throw error;
  }
};

/**
 * Update the quantity of an item in the cart
 * @param {string} itemId - ID of the item to update
 * @param {number} quantity - New quantity
 * @returns {Promise<Object>} Updated cart
 */
export const updateCartItem = async (itemId, quantity) => {
  try {
    // If cart is not loaded, load it from storage
    if (!currentCart) {
      await loadCartFromStorage();
    }
    
    // Find the item in the cart
    const itemIndex = currentCart.items.findIndex(item => item.id === itemId);
    
    if (itemIndex === -1) {
      throw new Error(`Item with ID ${itemId} not found in cart`);
    }
    
    // Update quantity
    currentCart.items[itemIndex].quantity = quantity;
    
    // Recalculate totals
    recalculateCart();
    
    // Save updated cart
    await saveCartToStorage();
    
    return currentCart;
  } catch (error) {
    console.error('Failed to update cart item:', error);
    throw error;
  }
};

/**
 * Remove an item from the cart
 * @param {string} itemId - ID of the item to remove
 * @returns {Promise<Object>} Updated cart
 */
export const removeCartItem = async (itemId) => {
  try {
    // If cart is not loaded, load it from storage
    if (!currentCart) {
      await loadCartFromStorage();
    }
    
    // Remove the item from the cart
    currentCart.items = currentCart.items.filter(item => item.id !== itemId);
    
    // Recalculate totals
    recalculateCart();
    
    // Save updated cart
    await saveCartToStorage();
    
    return currentCart;
  } catch (error) {
    console.error('Failed to remove cart item:', error);
    throw error;
  }
};

/**
 * Clear the cart
 * @returns {Promise<Object>} Empty cart
 */
export const clearCart = async () => {
  try {
    // Reset cart to empty state
    currentCart = createEmptyCart();
    
    // Save empty cart
    await saveCartToStorage();
    
    return currentCart;
  } catch (error) {
    console.error('Failed to clear cart:', error);
    throw error;
  }
};

/**
 * Validate cart for checkout
 * @returns {Promise<Object>} Validation result
 */
export const validateCart = async () => {
  try {
    // If cart is not loaded, load it from storage
    if (!currentCart) {
      await loadCartFromStorage();
    }
    
    // Check if cart is empty
    if (currentCart.items.length === 0) {
      return {
        valid: false,
        error: 'Cart is empty'
      };
    }
    
    // In a real app, this would check:
    // - Restaurant availability
    // - Item availability
    // - Price changes
    // - Delivery area validation
    // - Minimum order amount
    // - etc.
    
    return {
      valid: true,
      cart: currentCart
    };
  } catch (error) {
    console.error('Failed to validate cart:', error);
    throw error;
  }
};

/**
 * Get estimated delivery time
 * @returns {Promise<string>} Estimated delivery time range
 */
export const getEstimatedDeliveryTime = async () => {
  try {
    // In a real app, this would calculate based on:
    // - Restaurant preparation time
    // - Distance
    // - Traffic
    // - Number of orders
    // - etc.
    
    // Mock implementation with random time between 25-45 minutes
    const minTime = 25 + Math.floor(Math.random() * 10);
    const maxTime = minTime + 10;
    
    return `${minTime}-${maxTime} min`;
  } catch (error) {
    console.error('Failed to get estimated delivery time:', error);
    throw error;
  }
};

/**
 * Apply a promo code to the cart
 * @param {string} code - Promo code
 * @returns {Promise<Object>} Updated cart with discount
 */
export const applyPromoCode = async (code) => {
  try {
    // If cart is not loaded, load it from storage
    if (!currentCart) {
      await loadCartFromStorage();
    }
    
    // TODO: Replace with actual Odoo API call to validate promo code
    // Mock implementation with fixed discount
    if (code.toUpperCase() === 'WELCOME10') {
      // Apply 10% discount
      const discount = parseFloat((currentCart.subtotal * 0.1).toFixed(2));
      
      currentCart.discount = {
        code: code.toUpperCase(),
        amount: discount,
        type: 'percentage',
        value: 10
      };
      
      // Recalculate total with discount
      currentCart.total = parseFloat((currentCart.subtotal - discount + currentCart.deliveryFee).toFixed(2));
      
      // Save updated cart
      await saveCartToStorage();
      
      return {
        success: true,
        cart: currentCart,
        message: '10% discount applied!'
      };
    } else {
      return {
        success: false,
        message: 'Invalid promo code'
      };
    }
  } catch (error) {
    console.error('Failed to apply promo code:', error);
    throw error;
  }
};

/**
 * Remove promo code from the cart
 * @returns {Promise<Object>} Updated cart without discount
 */
export const removePromoCode = async () => {
  try {
    // If cart is not loaded, load it from storage
    if (!currentCart) {
      await loadCartFromStorage();
    }
    
    // Remove discount
    delete currentCart.discount;
    
    // Recalculate totals
    recalculateCart();
    
    // Save updated cart
    await saveCartToStorage();
    
    return currentCart;
  } catch (error) {
    console.error('Failed to remove promo code:', error);
    throw error;
  }
};

export default {
  initCartService,
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  validateCart,
  getEstimatedDeliveryTime,
  applyPromoCode,
  removePromoCode
};