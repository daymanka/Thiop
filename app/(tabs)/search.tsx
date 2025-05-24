import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import { Search as SearchIcon, Filter } from 'lucide-react-native';
import { searchRestaurantsAndItems } from '@/services/api';
import SearchResult from '@/components/search/SearchResult';

export default function SearchScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    cuisine: [],
    priceRange: [],
    dietary: [],
  });
  const [showFilters, setShowFilters] = useState(false);

  // Debounced search function
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      handleSearch();
    }, 500);

    return () => clearTimeout(timer);
  }, [query, filters]);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const searchResults = await searchRestaurantsAndItems(query, filters);
      setResults(searchResults);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to complete search. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleFilter = (category, value) => {
    setFilters(prevFilters => {
      const categoryFilters = [...prevFilters[category]];
      
      if (categoryFilters.includes(value)) {
        return {
          ...prevFilters,
          [category]: categoryFilters.filter(item => item !== value)
        };
      } else {
        return {
          ...prevFilters,
          [category]: [...categoryFilters, value]
        };
      }
    });
  };

  return (
    <SafeAreaView style={[
      styles.container,
      {backgroundColor: isDark ? '#121212' : '#F8F9FA'}
    ]}>
      <View style={styles.header}>
        <Text style={[
          styles.title,
          {color: isDark ? '#FFFFFF' : '#333333'}
        ]}>
          Search
        </Text>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={[
          styles.searchInputContainer,
          {backgroundColor: isDark ? '#333333' : '#FFFFFF'}
        ]}>
          <SearchIcon size={20} color={isDark ? '#BBBBBB' : '#999999'} />
          <TextInput
            style={[
              styles.searchInput,
              {color: isDark ? '#FFFFFF' : '#333333'}
            ]}
            placeholder="Search for restaurants or dishes..."
            placeholderTextColor={isDark ? '#BBBBBB' : '#999999'}
            value={query}
            onChangeText={setQuery}
          />
        </View>
        
        <TouchableOpacity 
          style={[
            styles.filterButton,
            {backgroundColor: isDark ? '#333333' : '#FFFFFF'}
          ]}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter size={20} color={filters.cuisine.length || filters.priceRange.length || filters.dietary.length ? '#FF6B35' : isDark ? '#BBBBBB' : '#999999'} />
        </TouchableOpacity>
      </View>
      
      {showFilters && (
        <View style={[
          styles.filtersContainer,
          {backgroundColor: isDark ? '#222222' : '#FFFFFF'}
        ]}>
          {/* Cuisine Filters */}
          <View style={styles.filterSection}>
            <Text style={[styles.filterTitle, {color: isDark ? '#FFFFFF' : '#333333'}]}>
              Cuisine
            </Text>
            <View style={styles.filterOptions}>
              {['Italian', 'Asian', 'Mexican', 'Fast Food'].map(cuisine => (
                <TouchableOpacity
                  key={cuisine}
                  style={[
                    styles.filterChip,
                    filters.cuisine.includes(cuisine) && styles.filterChipSelected
                  ]}
                  onPress={() => toggleFilter('cuisine', cuisine)}
                >
                  <Text style={[
                    styles.filterChipText,
                    filters.cuisine.includes(cuisine) && styles.filterChipTextSelected
                  ]}>
                    {cuisine}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          {/* Price Range Filters */}
          <View style={styles.filterSection}>
            <Text style={[styles.filterTitle, {color: isDark ? '#FFFFFF' : '#333333'}]}>
              Price
            </Text>
            <View style={styles.filterOptions}>
              {['$', '$$', '$$$'].map(price => (
                <TouchableOpacity
                  key={price}
                  style={[
                    styles.filterChip,
                    filters.priceRange.includes(price) && styles.filterChipSelected
                  ]}
                  onPress={() => toggleFilter('priceRange', price)}
                >
                  <Text style={[
                    styles.filterChipText,
                    filters.priceRange.includes(price) && styles.filterChipTextSelected
                  ]}>
                    {price}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          {/* Dietary Filters */}
          <View style={styles.filterSection}>
            <Text style={[styles.filterTitle, {color: isDark ? '#FFFFFF' : '#333333'}]}>
              Dietary
            </Text>
            <View style={styles.filterOptions}>
              {['Vegetarian', 'Vegan', 'Gluten-Free'].map(diet => (
                <TouchableOpacity
                  key={diet}
                  style={[
                    styles.filterChip,
                    filters.dietary.includes(diet) && styles.filterChipSelected
                  ]}
                  onPress={() => toggleFilter('dietary', diet)}
                >
                  <Text style={[
                    styles.filterChipText,
                    filters.dietary.includes(diet) && styles.filterChipTextSelected
                  ]}>
                    {diet}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.filterActions}>
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={() => setFilters({cuisine: [], priceRange: [], dietary: []})}
            >
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.applyButton}
              onPress={() => {
                setShowFilters(false);
                handleSearch();
              }}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B35" />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={handleSearch}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : results.length === 0 && query.length >= 2 ? (
        <View style={styles.noResultsContainer}>
          <Text style={[styles.noResultsText, {color: isDark ? '#FFFFFF' : '#333333'}]}>
            No results found for "{query}"
          </Text>
          <Text style={[styles.noResultsSubtext, {color: isDark ? '#BBBBBB' : '#999999'}]}>
            Try different keywords or filters
          </Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <SearchResult 
              item={item} 
              onPress={() => {
                if (item.type === 'restaurant') {
                  router.push(`/restaurant/${item.id}`);
                } else {
                  router.push(`/item/${item.id}`);
                }
              }}
              isDark={isDark}
            />
          )}
          style={styles.resultsList}
          contentContainerStyle={styles.resultsContent}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  filterButton: {
    marginLeft: 12,
    height: 48,
    width: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filtersContainer: {
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterChip: {
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    marginRight: 8,
    marginBottom: 8,
  },
  filterChipSelected: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  filterChipText: {
    color: '#666666',
  },
  filterChipTextSelected: {
    color: '#FFFFFF',
  },
  filterActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  clearButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 12,
  },
  clearButtonText: {
    color: '#666666',
    fontWeight: '600',
  },
  applyButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  errorText: {
    color: '#E53935',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 16,
    textAlign: 'center',
  },
  resultsList: {
    flex: 1,
  },
  resultsContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});