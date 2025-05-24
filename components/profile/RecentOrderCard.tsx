import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Clock } from 'lucide-react-native';

interface Order {
  id: string;
  restaurantName: string;
  restaurantImage: string;
  date: string;
  status: 'delivered' | 'processing' | 'cancelled';
  total: number;
  items: number;
}

interface RecentOrderCardProps {
  order: Order;
  onPress: () => void;
  isDark: boolean;
}

export default function RecentOrderCard({ order, onPress, isDark }: RecentOrderCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return '#4CB944';
      case 'processing':
        return '#F59E0B';
      case 'cancelled':
        return '#E53935';
      default:
        return '#666666';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'Delivered';
      case 'processing':
        return 'Processing';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {backgroundColor: isDark ? '#222222' : '#FFFFFF'}
      ]}
      onPress={onPress}
    >
      <Image 
        source={{ uri: order.restaurantImage }} 
        style={styles.image}
      />
      
      <View style={styles.details}>
        <View style={styles.row}>
          <Text style={[
            styles.restaurantName,
            {color: isDark ? '#FFFFFF' : '#333333'}
          ]}>
            {order.restaurantName}
          </Text>
          
          <Text style={[
            styles.total,
            {color: isDark ? '#FFFFFF' : '#333333'}
          ]}>
            ${order.total.toFixed(2)}
          </Text>
        </View>
        
        <View style={styles.row}>
          <View style={styles.dateContainer}>
            <Clock size={14} color="#666666" />
            <Text style={styles.date}>{order.date}</Text>
          </View>
          
          <Text style={styles.itemCount}>
            {order.items} {order.items === 1 ? 'item' : 'items'}
          </Text>
        </View>
        
        <View style={styles.statusContainer}>
          <View 
            style={[
              styles.statusIndicator, 
              {backgroundColor: getStatusColor(order.status)}
            ]} 
          />
          <Text style={[
            styles.statusText,
            {color: getStatusColor(order.status)}
          ]}>
            {getStatusText(order.status)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
  },
  details: {
    flex: 1,
    padding: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '600',
  },
  total: {
    fontSize: 16,
    fontWeight: '700',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 4,
  },
  itemCount: {
    fontSize: 12,
    color: '#666666',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
});