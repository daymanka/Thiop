import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import { ArrowLeft, CreditCard, Smartphone, Wallet, MapPin, Clock, Check } from 'lucide-react-native';
import { getCart } from '@/services/cartService';
import { placeOrder } from '@/services/orderService';
import { getCurrentUser } from '@/services/authService';
import PaymentMethodCard from '@/components/checkout/PaymentMethodCard';
import AddressSelector from '@/components/checkout/AddressSelector';
import OrderSummary from '@/components/checkout/OrderSummary';

export default function CheckoutScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [cart, setCart] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Visa, Mastercard, American Express',
      enabled: true
    },
    {
      id: 'apple_pay',
      name: 'Apple Pay',
      icon: Smartphone,
      description: 'Pay with Touch ID or Face ID',
      enabled: true
    },
    {
      id: 'google_pay',
      name: 'Google Pay',
      icon: Wallet,
      description: 'Quick and secure payment',
      enabled: true
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: Wallet,
      description: 'Pay with your PayPal account',
      enabled: true
    }
  ];

  const addresses = [
    {
      id: '1',
      type: 'Home',
      address: '123 Main Street, Apt 4B',
      city: 'New York, NY 10001',
      isDefault: true
    },
    {
      id: '2',
      type: 'Work',
      address: '456 Business Ave, Suite 200',
      city: 'New York, NY 10002',
      isDefault: false
    }
  ];

  useEffect(() => {
    loadCheckoutData();
  }, []);

  const loadCheckoutData = async () => {
    setLoading(true);
    try {
      const [cartData, userData] = await Promise.all([
        getCart(),
        getCurrentUser()
      ]);
      
      setCart(cartData);
      setUser(userData);
      setSelectedAddress(addresses.find(addr => addr.isDefault) || addresses[0]);
    } catch (err) {
      console.error('Error loading checkout data:', err);
      Alert.alert('Error', 'Failed to load checkout data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyPromoCode = () => {
    if (promoCode.toUpperCase() === 'WELCOME10') {
      setPromoApplied(true);
      Alert.alert('Success', 'Promo code applied! 10% discount added.');
    } else {
      Alert.alert('Invalid Code', 'The promo code you entered is not valid.');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      Alert.alert('Address Required', 'Please select a delivery address.');
      return;
    }

    if (!selectedPaymentMethod) {
      Alert.alert('Payment Method Required', 'Please select a payment method.');
      return;
    }

    setPlacing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const orderData = {
        items: cart.items,
        subtotal: cart.subtotal,
        deliveryFee: cart.deliveryFee,
        discount: promoApplied ? cart.subtotal * 0.1 : 0,
        total: promoApplied ? cart.total - (cart.subtotal * 0.1) : cart.total,
        paymentMethod: selectedPaymentMethod,
        deliveryAddress: selectedAddress,
        deliveryInstructions,
        estimatedDelivery: '30-45 min'
      };

      const order = await placeOrder(orderData);
      
      // Navigate to order confirmation
      router.replace(`/order-confirmation/${order.id}`);
    } catch (err) {
      console.error('Error placing order:', err);
      Alert.alert('Payment Failed', 'There was an error processing your payment. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered, {backgroundColor: isDark ? '#121212' : '#F8F9FA'}]}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <SafeAreaView style={[styles.container, {backgroundColor: isDark ? '#121212' : '#F8F9FA'}]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={isDark ? '#FFFFFF' : '#333333'} />
          </TouchableOpacity>
          <Text style={[styles.title, {color: isDark ? '#FFFFFF' : '#333333'}]}>
            Checkout
          </Text>
        </View>
        
        <View style={styles.centered}>
          <Text style={[styles.emptyText, {color: isDark ? '#FFFFFF' : '#333333'}]}>
            Your cart is empty
          </Text>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => router.push('/')}
          >
            <Text style={styles.shopButtonText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const finalTotal = promoApplied ? cart.total - (cart.subtotal * 0.1) : cart.total;

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: isDark ? '#121212' : '#F8F9FA'}]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={isDark ? '#FFFFFF' : '#333333'} />
        </TouchableOpacity>
        <Text style={[styles.title, {color: isDark ? '#FFFFFF' : '#333333'}]}>
          Checkout
        </Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Delivery Address */}
        <View style={[styles.section, {backgroundColor: isDark ? '#222222' : '#FFFFFF'}]}>
          <View style={styles.sectionHeader}>
            <MapPin size={20} color="#FF6B35" />
            <Text style={[styles.sectionTitle, {color: isDark ? '#FFFFFF' : '#333333'}]}>
              Delivery Address
            </Text>
          </View>
          
          <AddressSelector
            addresses={addresses}
            selectedAddress={selectedAddress}
            onSelectAddress={setSelectedAddress}
            isDark={isDark}
          />
          
          <TextInput
            style={[
              styles.instructionsInput,
              {
                backgroundColor: isDark ? '#333333' : '#F5F5F5',
                color: isDark ? '#FFFFFF' : '#333333'
              }
            ]}
            placeholder="Delivery instructions (optional)"
            placeholderTextColor={isDark ? '#BBBBBB' : '#999999'}
            value={deliveryInstructions}
            onChangeText={setDeliveryInstructions}
            multiline
          />
        </View>

        {/* Payment Method */}
        <View style={[styles.section, {backgroundColor: isDark ? '#222222' : '#FFFFFF'}]}>
          <View style={styles.sectionHeader}>
            <CreditCard size={20} color="#FF6B35" />
            <Text style={[styles.sectionTitle, {color: isDark ? '#FFFFFF' : '#333333'}]}>
              Payment Method
            </Text>
          </View>
          
          {paymentMethods.map(method => (
            <PaymentMethodCard
              key={method.id}
              method={method}
              selected={selectedPaymentMethod === method.id}
              onSelect={() => setSelectedPaymentMethod(method.id)}
              isDark={isDark}
            />
          ))}
        </View>

        {/* Promo Code */}
        <View style={[styles.section, {backgroundColor: isDark ? '#222222' : '#FFFFFF'}]}>
          <Text style={[styles.sectionTitle, {color: isDark ? '#FFFFFF' : '#333333'}]}>
            Promo Code
          </Text>
          
          <View style={styles.promoContainer}>
            <TextInput
              style={[
                styles.promoInput,
                {
                  backgroundColor: isDark ? '#333333' : '#F5F5F5',
                  color: isDark ? '#FFFFFF' : '#333333'
                }
              ]}
              placeholder="Enter promo code"
              placeholderTextColor={isDark ? '#BBBBBB' : '#999999'}
              value={promoCode}
              onChangeText={setPromoCode}
              editable={!promoApplied}
            />
            
            {promoApplied ? (
              <View style={styles.promoApplied}>
                <Check size={16} color="#4CB944" />
                <Text style={styles.promoAppliedText}>Applied</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.promoButton}
                onPress={handleApplyPromoCode}
                disabled={!promoCode.trim()}
              >
                <Text style={[
                  styles.promoButtonText,
                  {opacity: promoCode.trim() ? 1 : 0.5}
                ]}>
                  Apply
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Order Summary */}
        <OrderSummary
          cart={cart}
          promoApplied={promoApplied}
          finalTotal={finalTotal}
          isDark={isDark}
        />

        {/* Estimated Delivery Time */}
        <View style={[styles.section, {backgroundColor: isDark ? '#222222' : '#FFFFFF'}]}>
          <View style={styles.deliveryTimeContainer}>
            <Clock size={20} color="#FF6B35" />
            <View style={styles.deliveryTimeText}>
              <Text style={[styles.deliveryTimeTitle, {color: isDark ? '#FFFFFF' : '#333333'}]}>
                Estimated Delivery
              </Text>
              <Text style={styles.deliveryTime}>30-45 minutes</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Place Order Button */}
      <View style={[styles.footer, {backgroundColor: isDark ? '#222222' : '#FFFFFF'}]}>
        <TouchableOpacity
          style={[styles.placeOrderButton, {opacity: placing ? 0.7 : 1}]}
          onPress={handlePlaceOrder}
          disabled={placing}
        >
          {placing ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.placeOrderButtonText}>
                Place Order • ${finalTotal.toFixed(2)}
              </Text>
            </>
          )}
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
  instructionsInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  promoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  promoInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    marginRight: 12,
  },
  promoButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  promoButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  promoApplied: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  promoAppliedText: {
    color: '#4CB944',
    fontWeight: '600',
    marginLeft: 4,
  },
  deliveryTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryTimeText: {
    marginLeft: 12,
  },
  deliveryTimeTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  deliveryTime: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  footer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  placeOrderButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeOrderButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  emptyText: {
    fontSize: 18,
    marginBottom: 24,
  },
  shopButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  shopButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});