import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Receipt } from 'lucide-react-native';

interface Cart {
  items: any[];
  subtotal: number;
  deliveryFee: number;
  total: number;
}

interface OrderSummaryProps {
  cart: Cart;
  promoApplied: boolean;
  finalTotal: number;
  isDark: boolean;
}

export default function OrderSummary({ cart, promoApplied, finalTotal, isDark }: OrderSummaryProps) {
  const discount = promoApplied ? cart.subtotal * 0.1 : 0;

  return (
    <View style={[styles.container, {backgroundColor: isDark ? '#222222' : '#FFFFFF'}]}>
      <View style={styles.header}>
        <Receipt size={20} color="#FF6B35" />
        <Text style={[styles.title, {color: isDark ? '#FFFFFF' : '#333333'}]}>
          Order Summary
        </Text>
      </View>
      
      <View style={styles.summaryContent}>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, {color: isDark ? '#BBBBBB' : '#666666'}]}>
            Subtotal ({cart.items.reduce((total, item) => total + item.quantity, 0)} items)
          </Text>
          <Text style={[styles.summaryValue, {color: isDark ? '#FFFFFF' : '#333333'}]}>
            ${cart.subtotal.toFixed(2)}
          </Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, {color: isDark ? '#BBBBBB' : '#666666'}]}>
            Delivery Fee
          </Text>
          <Text style={[styles.summaryValue, {color: isDark ? '#FFFFFF' : '#333333'}]}>
            ${cart.deliveryFee.toFixed(2)}
          </Text>
        </View>
        
        {promoApplied && (
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, {color: '#4CB944'}]}>
              Promo Discount (WELCOME10)
            </Text>
            <Text style={[styles.summaryValue, {color: '#4CB944'}]}>
              -${discount.toFixed(2)}
            </Text>
          </View>
        )}
        
        <View style={styles.divider} />
        
        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, {color: isDark ? '#FFFFFF' : '#333333'}]}>
            Total
          </Text>
          <Text style={[styles.totalValue, {color: isDark ? '#FFFFFF' : '#333333'}]}>
            ${finalTotal.toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 8,
  },
  summaryContent: {
    marginTop: 8,
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
    marginTop: 8,
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
});