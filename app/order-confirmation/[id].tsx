import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import { CircleCheck as CheckCircle, Clock, MapPin, Phone, MessageCircle, ArrowLeft } from 'lucide-react-native';
import { getOrder, trackOrder } from '@/services/orderService';
import OrderTrackingCard from '@/components/order/OrderTrackingCard';
import OrderItemsList from '@/components/order/OrderItemsList';

export default function OrderConfirmationScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [order, setOrder] = useState(null);
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadOrderData();
    }
  }, [id]);

  const loadOrderData = async () => {
    setLoading(true);
    try {
      const [orderData, trackingData] = await Promise.all([
        getOrder(id as string),
        trackOrder(id as string)
      ]);
      
      setOrder(orderData);
      setTracking(trackingData);
    } catch (err) {
      console.error('Error loading order data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered, {backgroundColor: isDark ? '#121212' : '#F8F9FA'}]}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={[styles.container, {backgroundColor: isDark ? '#121212' : '#F8F9FA'}]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/')} style={styles.backButton}>
            <ArrowLeft size={24} color={isDark ? '#FFFFFF' : '#333333'} />
          </TouchableOpacity>
          <Text style={[styles.title, {color: isDark ? '#FFFFFF' : '#333333'}]}>
            Order Not Found
          </Text>
        </View>
        
        <View style={styles.centered}>
          <Text style={[styles.errorText, {color: isDark ? '#FFFFFF' : '#333333'}]}>
            Order not found
          </Text>
          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => router.push('/')}
          >
            <Text style={styles.homeButtonText}>Go Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: isDark ? '#121212' : '#F8F9FA'}]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/')} style={styles.backButton}>
          <ArrowLeft size={24} color={isDark ? '#FFFFFF' : '#333333'} />
        </TouchableOpacity>
        <Text style={[styles.title, {color: isDark ? '#FFFFFF' : '#333333'}]}>
          Order Confirmation
        </Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Success Message */}
        <View style={[styles.successCard, {backgroundColor: isDark ? '#222222' : '#FFFFFF'}]}>
          <View style={styles.successIcon}>
            <CheckCircle size={48} color="#4CB944" />
          </View>
          
          <Text style={[styles.successTitle, {color: isDark ? '#FFFFFF' : '#333333'}]}>
            Order Placed Successfully!
          </Text>
          
          <Text style={styles.successMessage}>
            Your order has been confirmed and is being prepared
          </Text>
          
          <View style={styles.orderInfo}>
            <Text style={[styles.orderNumber, {color: isDark ? '#FFFFFF' : '#333333'}]}>
              Order #{order.id}
            </Text>
            <Text style={styles.orderDate}>
              {new Date(order.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Text>
          </View>
        </View>

        {/* Order Tracking */}
        {tracking && (
          <OrderTrackingCard
            tracking={tracking}
            isDark={isDark}
          />
        )}

        {/* Restaurant Info */}
        <View style={[styles.section, {backgroundColor: isDark ? '#222222' : '#FFFFFF'}]}>
          <View style={styles.restaurantHeader}>
            <Image 
              source={{ uri: order.restaurantImage }} 
              style={styles.restaurantImage}
            />
            <View style={styles.restaurantInfo}>
              <Text style={[styles.restaurantName, {color: isDark ? '#FFFFFF' : '#333333'}]}>
                {order.restaurantName}
              </Text>
              <Text style={styles.estimatedTime}>
                Estimated delivery: {order.estimatedDelivery}
              </Text>
            </View>
          </View>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <Phone size={20} color="#FF6B35" />
              <Text style={styles.actionButtonText}>Call Restaurant</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <MessageCircle size={20} color="#FF6B35" />
              <Text style={styles.actionButtonText}>Chat Support</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Delivery Address */}
        <View style={[styles.section, {backgroundColor: isDark ? '#222222' : '#FFFFFF'}]}>
          <View style={styles.sectionHeader}>
            <MapPin size={20} color="#FF6B35" />
            <Text style={[styles.sectionTitle, {color: isDark ? '#FFFFFF' : '#333333'}]}>
              Delivery Address
            </Text>
          </View>
          
          <Text style={[styles.addressText, {color: isDark ? '#BBBBBB' : '#666666'}]}>
            {order.deliveryAddress?.address}
          </Text>
          <Text style={[styles.addressText, {color: isDark ? '#BBBBBB' : '#666666'}]}>
            {order.deliveryAddress?.city}
          </Text>
          
          {order.deliveryInstructions && (
            <View style={styles.instructionsContainer}>
              <Text style={[styles.instructionsLabel, {color: isDark ? '#FFFFFF' : '#333333'}]}>
                Delivery Instructions:
              </Text>
              <Text style={[styles.instructionsText, {color: isDark ? '#BBBBBB' : '#666666'}]}>
                {order.deliveryInstructions}
              </Text>
            </View>
          )}
        </View>

        {/* Order Items */}
        <OrderItemsList
          items={order.items}
          isDark={isDark}
        />

        {/* Payment Summary */}
        <View style={[styles.section, {backgroundColor: isDark ? '#222222' : '#FFFFFF'}]}>
          <Text style={[styles.sectionTitle, {color: isDark ? '#FFFFFF' : '#333333'}]}>
            Payment Summary
          </Text>
          
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, {color: isDark ? '#BBBBBB' : '#666666'}]}>
              Subtotal
            </Text>
            <Text style={[styles.summaryValue, {color: isDark ? '#FFFFFF' : '#333333'}]}>
              ${order.subtotal.toFixed(2)}
            </Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, {color: isDark ? '#BBBBBB' : '#666666'}]}>
              Delivery Fee
            </Text>
            <Text style={[styles.summaryValue, {color: isDark ? '#FFFFFF' : '#333333'}]}>
              ${order.deliveryFee.toFixed(2)}
            </Text>
          </View>
          
          {order.discount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, {color: '#4CB944'}]}>
                Discount
              </Text>
              <Text style={[styles.summaryValue, {color: '#4CB944'}]}>
                -${order.discount.toFixed(2)}
              </Text>
            </View>
          )}
          
          <View style={styles.divider} />
          
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, {color: isDark ? '#FFFFFF' : '#333333'}]}>
              Total Paid
            </Text>
            <Text style={[styles.totalValue, {color: isDark ? '#FFFFFF' : '#333333'}]}>
              ${order.total.toFixed(2)}
            </Text>
          </View>
          
          <Text style={styles.paymentMethod}>
            Paid with {order.paymentMethod === 'card' ? 'Credit Card' : order.paymentMethod}
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={[styles.bottomActions, {backgroundColor: isDark ? '#222222' : '#FFFFFF'}]}>
        <TouchableOpacity
          style={styles.trackOrderButton}
          onPress={() => router.push(`/order-tracking/${order.id}`)}
        >
          <Clock size={20} color="#FFFFFF" />
          <Text style={styles.trackOrderButtonText}>Track Order</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.continueShoppingButton}
          onPress={() => router.push('/')}
        >
          <Text style={styles.continueShoppingButtonText}>Continue Shopping</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  successCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  successIcon: {
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  successMessage: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
  },
  orderInfo: {
    alignItems: 'center',
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: '#666666',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 8,
  },
  restaurantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  restaurantImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  estimatedTime: {
    fontSize: 14,
    color: '#666666',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  actionButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B35',
  },
  addressText: {
    fontSize: 16,
    marginBottom: 4,
  },
  instructionsContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  instructionsLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  instructionsText: {
    fontSize: 14,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666666',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FF6B35',
  },
  paymentMethod: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  bottomActions: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  trackOrderButton: {
    backgroundColor: '#FF6B35',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    height: 48,
    marginBottom: 12,
  },
  trackOrderButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  continueShoppingButton: {
    borderWidth: 2,
    borderColor: '#FF6B35',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueShoppingButtonText: {
    color: '#FF6B35',
    fontSize: 16,
    fontWeight: '700',
  },
  errorText: {
    fontSize: 18,
    marginBottom: 24,
  },
  homeButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  homeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});