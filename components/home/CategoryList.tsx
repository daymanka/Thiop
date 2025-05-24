import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, useColorScheme } from 'react-native';

interface Category {
  id: string;
  name: string;
  image: string;
}

interface CategoryListProps {
  categories: Category[];
  onSelectCategory: (id: string) => void;
}

export default function CategoryList({ categories, onSelectCategory }: CategoryListProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={[
          styles.title,
          {color: isDark ? '#FFFFFF' : '#333333'}
        ]}>
          Categories
        </Text>
      </View>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {categories.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryItem,
              {backgroundColor: isDark ? '#222222' : '#FFFFFF'}
            ]}
            onPress={() => onSelectCategory(category.id)}
          >
            <Image 
              source={{ uri: category.image }} 
              style={styles.categoryImage}
            />
            <Text style={[
              styles.categoryName,
              {color: isDark ? '#FFFFFF' : '#333333'}
            ]}>
              {category.name}
            </Text>
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
  titleContainer: {
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  categoriesContainer: {
    paddingRight: 16,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 100,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  categoryName: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});