import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Configuration for Odoo authentication
const ODOO_AUTH_URL = 'https://your-odoo-instance.com/api/auth';
const AUTH_TOKEN_KEY = 'food_delivery_auth_token';
const USER_DATA_KEY = 'food_delivery_user_data';

// Session management variables
let currentUser = null;
let authToken = null;

/**
 * Initialize the auth service by loading any existing session
 * @returns {Promise<void>}
 */
export const initAuthService = async () => {
  try {
    // Load auth token from secure storage
    const storedToken = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
    if (storedToken) {
      authToken = storedToken;
      
      // Load cached user data
      const userData = await SecureStore.getItemAsync(USER_DATA_KEY);
      if (userData) {
        currentUser = JSON.parse(userData);
      } else {
        // If we have a token but no user data, fetch the user profile
        await refreshUserProfile();
      }
    }
  } catch (error) {
    console.error('Failed to initialize auth service:', error);
    // Clear potentially corrupted data
    await logout();
  }
};

/**
 * Login with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} User data
 */
export const login = async (email, password) => {
  try {
    // TODO: Replace with actual Odoo API call
    // const response = await axios.post(ODOO_AUTH_URL + '/login', {
    //   email,
    //   password
    // });
    // const { token, user } = response.data;
    
    // Mock login for development
    // In production, this would validate credentials against Odoo
    if (email && password) {
      const token = 'mock_token_' + Math.random().toString(36).substring(2, 15);
      const user = {
        id: '1001',
        name: 'John Doe',
        email: email,
        phone: '+1234567890',
        avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=300'
      };
      
      // Store token and user data
      authToken = token;
      currentUser = user;
      
      await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
      await SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(user));
      
      return user;
    } else {
      throw new Error('Invalid credentials');
    }
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} Newly created user
 */
export const register = async (userData) => {
  try {
    // TODO: Replace with actual Odoo API call
    // const response = await axios.post(ODOO_AUTH_URL + '/register', userData);
    // const { token, user } = response.data;
    
    // Mock registration for development
    const { name, email, password, phone } = userData;
    
    if (!name || !email || !password) {
      throw new Error('Missing required fields');
    }
    
    // Simulate registration process
    const token = 'mock_token_' + Math.random().toString(36).substring(2, 15);
    const user = {
      id: '1002',
      name,
      email,
      phone: phone || '',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=300'
    };
    
    // Store token and user data
    authToken = token;
    currentUser = user;
    
    await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
    await SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(user));
    
    return user;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
};

/**
 * Refresh the user profile data from the server
 * @returns {Promise<Object>} Updated user data
 */
export const refreshUserProfile = async () => {
  try {
    if (!authToken) {
      throw new Error('Not authenticated');
    }
    
    // TODO: Replace with actual Odoo API call
    // const response = await axios.get(ODOO_AUTH_URL + '/profile', {
    //   headers: { Authorization: `Bearer ${authToken}` }
    // });
    // const user = response.data;
    
    // Mock profile refresh for development
    // In production, this would fetch the latest user data from Odoo
    if (currentUser) {
      // No changes in mock implementation, but in production this would
      // get the latest user data from the server
      
      // Update stored user data
      await SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(currentUser));
      
      return currentUser;
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    console.error('Failed to refresh user profile:', error);
    // If unauthorized, clear the session
    if (error.response?.status === 401) {
      await logout();
    }
    throw error;
  }
};

/**
 * Get the current authenticated user
 * @returns {Promise<Object|null>} Current user or null if not authenticated
 */
export const getCurrentUser = async () => {
  // If we don't have user data in memory, try to load it
  if (!currentUser && authToken) {
    await refreshUserProfile();
  }
  
  // For mock implementation, ensure we always return a user
  // In production, this would be properly tied to authentication
  if (!currentUser) {
    currentUser = {
      id: '1001',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=300'
    };
    
    await SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(currentUser));
  }
  
  return currentUser;
};

/**
 * Update user profile information
 * @param {Object} updates - User data to update
 * @returns {Promise<Object>} Updated user data
 */
export const updateUserProfile = async (updates) => {
  try {
    if (!authToken) {
      throw new Error('Not authenticated');
    }
    
    // TODO: Replace with actual Odoo API call
    // const response = await axios.put(ODOO_AUTH_URL + '/profile', updates, {
    //   headers: { Authorization: `Bearer ${authToken}` }
    // });
    // const updatedUser = response.data;
    
    // Mock profile update for development
    const updatedUser = {
      ...currentUser,
      ...updates,
    };
    
    // Update user data in memory and storage
    currentUser = updatedUser;
    await SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(updatedUser));
    
    return updatedUser;
  } catch (error) {
    console.error('Failed to update user profile:', error);
    throw error;
  }
};

/**
 * Logout the current user
 * @returns {Promise<void>}
 */
export const logout = async () => {
  try {
    // TODO: Replace with actual Odoo API call if needed
    // await axios.post(ODOO_AUTH_URL + '/logout', {}, {
    //   headers: { Authorization: `Bearer ${authToken}` }
    // });
    
    // Clear token and user data
    authToken = null;
    currentUser = null;
    
    await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_DATA_KEY);
  } catch (error) {
    console.error('Logout failed:', error);
    
    // Even if the server call fails, clear local data
    authToken = null;
    currentUser = null;
    
    await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_DATA_KEY);
    
    throw error;
  }
};

/**
 * Check if the user is authenticated
 * @returns {Promise<boolean>} True if authenticated, false otherwise
 */
export const isAuthenticated = async () => {
  // Check if we have a token in memory
  if (authToken) {
    return true;
  }
  
  // Check if we have a token in storage
  const storedToken = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
  if (storedToken) {
    authToken = storedToken;
    return true;
  }
  
  return false;
};

/**
 * Get the authentication token for API requests
 * @returns {Promise<string|null>} Auth token or null if not authenticated
 */
export const getAuthToken = async () => {
  // If we don't have a token in memory, try to load it
  if (!authToken) {
    const storedToken = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
    if (storedToken) {
      authToken = storedToken;
    }
  }
  
  return authToken;
};

export default {
  initAuthService,
  login,
  register,
  getCurrentUser,
  updateUserProfile,
  logout,
  isAuthenticated,
  getAuthToken
};