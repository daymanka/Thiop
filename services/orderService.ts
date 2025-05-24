import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { getAuthToken } from './authService';
import { clearCart } from './cartService';


// Configuration for Odoo API
const ODOO_ORDER_API_URL = 'https://your-odoo-instance.com/api/orders';
const ORDERS_STORAGE_KEY = 'food_delivery_orders';

// In-memory cache of orders
let orderCache = null;

/**
 * Place a new order
 * @param {Object} orderData - Order data including cart items, delivery address, payment info
 * @returns {Promise<Object>} Newly created order
 */
export const placeOrder = async (orderData) => {
  try {
    const authToken = await getAuthToken();
    
    if (!authToken) {
      throw new Error('Authentication required to place an order');
    }
    
    // TODO: Replace with actual Odoo API call
    // const response = await axios.post(ODOO_ORDER_API_URL, orderData, {
    //   headers: { Authorization: `Bearer ${authToken}` }
    // });
    // const order = response.data;
    
    // Mock order creation for development
    const orderId = 'ORD' + Math.floor(100000 + Math.random() * 900000);
    const now = new Date();
    
    const order = {
      id: orderId,
      date: now.toISOString(),
      status: 'processing',
      items: orderData.items,
      subtotal: orderData.subtotal,
      deliveryFee: orderData.deliveryFee,
      discount: orderData.discount || 0,
      total: orderData.total,
      paymentMethod: orderData.paymentMethod,
      deliveryAddress: orderData.deliveryAddress,
      estimatedDelivery: orderData.estimatedDelivery || '30-45 min',
      restaurantId: orderData.items[0]?.restaurantId || null,
      restaurantName: orderData.items[0]?.restaurantName || 'Restaurant',
      restaurantImage: 'https://images.pexels.com/photos/905847/pexels-photo-905847.jpeg?auto=compress&cs=tinysrgb&w=300'
    };
    
    // Store order in local cache
    await addOrderToCache(order);
    
    // Clear the cart after successful order
    await clearCart();
    
    return order;
  } catch (error) {
    console.error('Failed to place order:', error);
    throw error;
  }
};

/**
 * Add an order to the local cache
 * @param {Object} order - Order to add to cache
 * @returns {Promise<void>}
 */
const addOrderToCache = async (order) => {
  try {
    // Load orders from storage if not already loaded
    if (!orderCache) {
      const ordersData = await SecureStore.getItemAsync(ORDERS_STORAGE_KEY);
      orderCache = ordersData ? JSON.parse(ordersData) : [];
    }
    
    // Add new order to the beginning of the array
    orderCache.unshift(order);
    
    // Save updated orders
    await SecureStore.setItemAsync(ORDERS_STORAGE_KEY, JSON.stringify(orderCache));
  } catch (error) {
    console.error('Failed to add order to cache:', error);
    throw error;
  }
};

/**
 * Get a specific order by ID
 * @param {string} orderId - Order ID
 * @returns {Promise<Object>} Order details
 */
export const getOrder = async (orderId) => {
  try {
    const authToken = await getAuthToken();
    console.log("hello "  : authToken);
    
    if (!authToken) {
      throw new Error('Authentication required to access order details');
    }
    
    // TODO: Replace with actual Odoo API call
    // const response = await axios.get(`${ODOO_ORDER_API_URL}/${orderId}`, {
    //   headers: { Authorization: `Bearer ${authToken}` }
    // });
    // return response.data;
    
    // Try to find order in local cache first
    if (!orderCache) {
      const ordersData = await SecureStore.getItemAsync(ORDERS_STORAGE_KEY);
      orderCache = ordersData ? JSON.parse(ordersData) : [];
    }
    
    const cachedOrder = orderCache.find(order => order.id === orderId);
    
    if (cachedOrder) {
      return cachedOrder;
    }
    
    // Mock order retrieval for development
    // This would be a fallback if the order isn't in the cache
    throw new Error(`Order with ID ${orderId} not found`);
  } catch (error) {
    console.error(`Failed to get order with ID ${orderId}:`, error);
    throw error;
  }
};

/**
 * Get all orders for the current user
 * @param {Object} options - Query options (limit, offset, status filter)
 * @returns {Promise<Array>} List of orders
 */
export const getOrders = async (options = {}) => {
  try {
    const authToken = await getAuthToken();
    
    if (!authToken) {
      throw new Error('Authentication required to access orders');
    }
    
    // TODO: Replace with actual Odoo API call
    // const response = await axios.get(ODOO_ORDER_API_URL, {
    //   headers: { Authorization: `Bearer ${authToken}` },
    //   params: options
    // });
    // return response.data;
    
    // Use cached orders for development
    if (!orderCache) {
      const ordersData = await SecureStore.getItemAsync(ORDERS_STORAGE_KEY);
      orderCache = ordersData ? JSON.parse(ordersData) : [];
      
      // If no orders in cache, generate some mock orders
      if (orderCache.length === 0) {
        orderCache = generateMockOrders(10);
        await SecureStore.setItemAsync(ORDERS_STORAGE_KEY, JSON.stringify(orderCache));
      }
    }
    
    // Apply filters if provided
    let filteredOrders = [...orderCache];
    
    if (options.status) {
      filteredOrders = filteredOrders.filter(order => order.status === options.status);
    }
    
    // Apply pagination if provided
    const limit = options.limit || filteredOrders.length;
    const offset = options.offset || 0;
    
    return filteredOrders.slice(offset, offset + limit);
  } catch (error) {
    console.error('Failed to get orders:', error);
    throw error;
  }
};

/**
 * Get recent orders for the current user
 * @param {number} limit - Maximum number of orders to return
 * @returns {Promise<Array>} List of recent orders
 */
export const getRecentOrders = async (limit = 5) => {
  try {
    return getOrders({ limit });
  } catch (error) {
    console.error('Failed to get recent orders:', error);
    throw error;
  }
};

/**
 * Track order status
 * @param {string} orderId - Order ID
 * @returns {Promise<Object>} Order status
 */
export const trackOrder = async (orderId) => {
  try {
    const authToken = await getAuthToken();
    
    if (!authToken) {
      throw new Error('Authentication required to track order');
    }
    
    // TODO: Replace with actual Odoo API call
    // const response = await axios.get(`${ODOO_ORDER_API_URL}/${orderId}/track`, {
    //   headers: { Authorization: `Bearer ${authToken}` }
    // });
    // return response.data;
    
    // Mock order tracking for development
    const order = await getOrder(orderId);
    
    // Simulate order progress based on time elapsed
    const orderDate = new Date(order.date);
    const now = new Date();
    const minutesElapsed = Math.floor((now - orderDate) / (1000 * 60));
    
    let status, progress, estimatedArrival;
    
    if (minutesElapsed < 5) {
      status = 'confirmed';
      progress = 0.1;
      estimatedArrival = '30-40 min';
    } else if (minutesElapsed < 10) {
      status = 'preparing';
      progress = 0.3;
      estimatedArrival = '25-35 min';
    } else if (minutesElapsed < 20) {
      status = 'ready_for_pickup';
      progress = 0.6;
      estimatedArrival = '15-20 min';
    } else if (minutesElapsed < 30) {
      status = 'on_the_way';
      progress = 0.8;
      estimatedArrival = '5-10 min';
    } else {
      status = 'delivered';
      progress = 1.0;
      estimatedArrival = 'Delivered';
    }
    
    // Update order status in cache
    if (order.status !== status) {
      order.status = status;
      
      // Find and update the order in cache
      const orderIndex = orderCache.findIndex(o => o.id === orderId);
      if (orderIndex !== -1) {
        orderCache[orderIndex] = order;
        await SecureStore.setItemAsync(ORDERS_STORAGE_KEY, JSON.stringify(orderCache));
      }
    }
    
    return {
      orderId,
      status,
      progress,
      estimatedArrival,
      updatedAt: new Date().toISOString(),
      order
    };
  } catch (error) {
    console.error(`Failed to track order with ID ${orderId}:`, error);
    throw error;
  }
};

/**
 * Cancel an order
 * @param {string} orderId - Order ID
 * @param {string} reason - Cancellation reason
 * @returns {Promise<Object>} Cancelled order
 */
export const cancelOrder = async (orderId, reason) => {
  try {
    const authToken = await getAuthToken();
    
    if (!authToken) {
      throw new Error('Authentication required to cancel order');
    }
    
    // TODO: Replace with actual Odoo API call
    // const response = await axios.post(`${ODOO_ORDER_API_URL}/${orderId}/cancel`, 
    //   { reason },
    //   { headers: { Authorization: `Bearer ${authToken}` } }
    // );
    // return response.data;
    
    // Mock order cancellation for development
    const order = await getOrder(orderId);
    
    // Only allow cancellation if order is not delivered or already cancelled
    if (order.status === 'delivered' || order.status === 'cancelled') {
      throw new Error(`Cannot cancel order with status: ${order.status}`);
    }
    
    // Update order status
    order.status = 'cancelled';
    order.cancellationReason = reason;
    order.cancelledAt = new Date().toISOString();
    
    // Find and update the order in cache
    const orderIndex = orderCache.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
      orderCache[orderIndex] = order;
      await SecureStore.setItemAsync(ORDERS_STORAGE_KEY, JSON.stringify(orderCache));
    }
    
    return order;
  } catch (error) {
    console.error(`Failed to cancel order with ID ${orderId}:`, error);
    throw error;
  }
};

/**
 * Generate mock orders for development
 * @param {number} count - Number of orders to generate
 * @returns {Array} List of mock orders
 */
const generateMockOrders = (count) => {
  const statuses = ['delivered', 'processing', 'cancelled'];
  const restaurants = [
    { 
      id: '201', 
      name: 'Pizza Palace', 
      image: 'https://images.pexels.com/photos/905847/pexels-photo-905847.jpeg?auto=compress&cs=tinysrgb&w=300' 
    },
    { 
      id: '202', 
      name: 'Burger Joint', 
      image: 'https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&w=300' 
    },
    { 
      id: '203', 
      name: 'Sushi Express', 
      image: 'https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg?auto=compress&cs=tinysrgb&w=300' 
    }
  ];
  
  return Array(count).fill(0).map((_, index) => {
    const restaurant = restaurants[index % restaurants.length];
    const date = new Date();
    date.setDate(date.getDate() - index); // Older orders as index increases
    
    return {
      id: `ORD${100000 + index}`,
      date: date.toISOString(),
      status: statuses[index % statuses.length],
      items: [{ name: 'Food Item', quantity: 2 }],
      subtotal: 24.99,
      deliveryFee: 2.99,
      total: 27.98,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      restaurantImage: restaurant.image,
      estimatedDelivery: '30-45 min',
      items: Math.floor(Math.random() * 3) + 1
    };
  });
};

export default {
  placeOrder,
  getOrder,
  getOrders,
  getRecentOrders,
  trackOrder,
  cancelOrder
};