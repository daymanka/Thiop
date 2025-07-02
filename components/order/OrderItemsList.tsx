import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Package } from 'lucide-react-native';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  options?: string[];
}

interface OrderItemsListProps {
  items: OrderItem[];
  isDark: boolean;
}

export default function OrderItemsList({ items, isDark }: OrderItemsListProps) {
  return (
    <View style={[styles.container, {backgroundColor: isDark ? '#222222' : '#FFFFFF'}]}>
      <View style={styles.header}>
        <Package size={20} color="#FF6B35" />
        <Text style={[styles.title, {color: isDark ? '#FFFFFF' : '#333333'}]}>
          Order Items ({items.length})
        </Text>
      </View>
      
      {items.map((item, index) => (
        <View key={`${item.id}-${index}`} style={styles.itemContainer}>
          <View style={styles.itemContent}>
            {item.image && (
              <Image source={{ uri: item.image }} style={styles.itemImage} />
            )}
            
            <View style={styles.itemDetails}>
              <Text style={[styles.itemName, {color: isDark ? '#FFFFFF' : '#333333'}]}>
                {item.name}
              </Text>
              
              {item.options && item.options.length > 0 && (
                <Text style={styles.itemOptions}>
                  {item.options.join(', ')}
                </Text>
              )}
              
              <View style={styles.itemBottom}>
                <Text style={[styles.itemPrice, {color: isDark ? '#FFFFFF' : '#333333'}]}>
                  ${item.price.toFixed(2)}
                </Text>
                <Text style={styles.itemQuantity}>
                  Qty: {item.quantity}
                </Text>
              </View>
            </View>
          </View>
          
          <Text style={[styles.itemTotal, {color: isDark ? '#FFFFFF' : '#333333'}]}>
            ${(item.price * item.quantity).toFixed(2)}
          </Text>
        </View>
      ))}
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
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemOptions: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  itemBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666666',
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 12,
  },
});