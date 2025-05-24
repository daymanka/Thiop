import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Star, Clock } from 'lucide-react-native';

interface SearchResultItem {
  id: string;
  type: 'restaurant' | 'dish';
  name: string;
  image: string;
  restaurant?: string;
  price?: number;
  rating?: number;
  deliveryTime?: string;
  cuisine?: string;
}

interface SearchResultProps {
  item: SearchResultItem;
  onPress: () => void;
  isDark: boolean;
}

export default function SearchResult({ item, onPress, isDark }: SearchResultProps) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        {backgroundColor: isDark ? '#222222' : '#FFFFFF'}
      ]}
      onPress={onPress}
    >
      <Image 
        source={{ uri: item.image }} 
        style={styles.image}
      />
      
      <View style={styles.details}>
        <Text style={[
          styles.name,
          {color: isDark ? '#FFFFFF' : '#333333'}
        ]}>
          {item.name}
        </Text>
        
        {item.type === 'dish' && item.restaurant && (
          <Text style={styles.restaurant}>{item.restaurant}</Text>
        )}
        
        {item.type === 'restaurant' && item.cuisine && (
          <Text style={styles.cuisine}>{item.cuisine}</Text>
        )}
        
        <View style={styles.bottomRow}>
          {item.type === 'dish' && item.price !== undefined && (
            <Text style={[
              styles.price,
              {color: isDark ? '#FFFFFF' : '#333333'}
            ]}>
              ${item.price.toFixed(2)}
            </Text>
          )}
          
          {item.rating !== undefined && (
            <View style={styles.ratingContainer}>
              <Star size={14} color="#FFD700" fill="#FFD700" />
              <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
            </View>
          )}
          
          {item.type === 'restaurant' && item.deliveryTime && (
            <View style={styles.deliveryTimeContainer}>
              <Clock size={14} color="#666666" />
              <Text style={styles.deliveryTimeText}>{item.deliveryTime}</Text>
            </View>
          )}
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
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  restaurant: {
    fontSize: 14,
    color: '#666666',
  },
  cuisine: {
    fontSize: 14,
    color: '#666666',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    marginRight: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666666',
  },
  deliveryTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryTimeText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666666',
  },
});