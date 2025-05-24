import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, useColorScheme } from 'react-native';
import { Star, Clock } from 'lucide-react-native';

interface Restaurant {
  id: string;
  name: string;
  image: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  distance: number;
}

interface RestaurantListProps {
  restaurants: Restaurant[];
  onSelectRestaurant: (id: string) => void;
}

export default function RestaurantList({ restaurants, onSelectRestaurant }: RestaurantListProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const renderRestaurant = ({ item }: { item: Restaurant }) => (
    <TouchableOpacity
      style={[
        styles.restaurantCard,
        {backgroundColor: isDark ? '#222222' : '#FFFFFF'}
      ]}
      onPress={() => onSelectRestaurant(item.id)}
    >
      <Image 
        source={{ uri: item.image }} 
        style={styles.restaurantImage}
      />
      
      <View style={styles.infoContainer}>
        <Text style={[
          styles.restaurantName,
          {color: isDark ? '#FFFFFF' : '#333333'}
        ]}>
          {item.name}
        </Text>
        
        <Text style={styles.cuisine}>{item.cuisine}</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Star size={14} color="#FFD700" fill="#FFD700" />
            <Text style={styles.statText}>{item.rating.toFixed(1)}</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Clock size={14} color="#666666" />
            <Text style={styles.statText}>{item.deliveryTime}</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <Text style={styles.statText}>{item.distance} km</Text>
        </View>
        
        <View style={styles.deliveryInfo}>
          <Text style={styles.deliveryFee}>
            {item.deliveryFee === 0 ? 'Free Delivery' : `Delivery: $${item.deliveryFee.toFixed(2)}`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={restaurants}
      renderItem={renderRestaurant}
      keyExtractor={item => item.id}
      scrollEnabled={false}
    />
  );
}

const styles = StyleSheet.create({
  restaurantCard: {
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
  restaurantImage: {
    width: 100,
    height: 100,
  },
  infoContainer: {
    flex: 1,
    padding: 12,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  cuisine: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666666',
  },
  statDivider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CCCCCC',
    marginHorizontal: 8,
  },
  deliveryInfo: {
    marginTop: 4,
  },
  deliveryFee: {
    fontSize: 12,
    color: '#4CB944',
    fontWeight: '600',
  },
});