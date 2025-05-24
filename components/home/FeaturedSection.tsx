import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, useColorScheme } from 'react-native';
import { Star } from 'lucide-react-native';

interface FeaturedItem {
  id: string;
  name: string;
  image: string;
  price: number;
  restaurant: string;
  rating: number;
}

interface FeaturedSectionProps {
  items: FeaturedItem[];
  onSelectItem: (id: string) => void;
}

export default function FeaturedSection({ items, onSelectItem }: FeaturedSectionProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={[
          styles.sectionTitle,
          {color: isDark ? '#FFFFFF' : '#333333'}
        ]}>
          Featured Items
        </Text>
      </View>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.itemsContainer}
      >
        {items.map(item => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.itemCard,
              {backgroundColor: isDark ? '#222222' : '#FFFFFF'}
            ]}
            onPress={() => onSelectItem(item.id)}
          >
            <Image 
              source={{ uri: item.image }} 
              style={styles.itemImage}
            />
            
            <View style={styles.itemDetails}>
              <Text style={[
                styles.itemName,
                {color: isDark ? '#FFFFFF' : '#333333'}
              ]}>
                {item.name}
              </Text>
              
              <Text style={styles.restaurantName}>
                {item.restaurant}
              </Text>
              
              <View style={styles.itemBottom}>
                <Text style={[
                  styles.price,
                  {color: isDark ? '#FFFFFF' : '#333333'}
                ]}>
                  ${item.price.toFixed(2)}
                </Text>
                
                <View style={styles.ratingContainer}>
                  <Star size={14} color="#FFD700" fill="#FFD700" />
                  <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  itemsContainer: {
    paddingRight: 16,
  },
  itemCard: {
    width: 200,
    borderRadius: 12,
    marginRight: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  itemDetails: {
    padding: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  restaurantName: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  itemBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '600',
    color: '#666666',
  },
});