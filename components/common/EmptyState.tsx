import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { ShoppingCart, Search, AlertCircle } from 'lucide-react-native';

interface EmptyStateProps {
  icon: 'shopping-cart' | 'search' | 'alert';
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({ icon, title, message, actionLabel, onAction }: EmptyStateProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const renderIcon = () => {
    const size = 64;
    const color = '#FF6B35';
    
    switch (icon) {
      case 'shopping-cart':
        return <ShoppingCart size={size} color={color} />;
      case 'search':
        return <Search size={size} color={color} />;
      case 'alert':
        return <AlertCircle size={size} color={color} />;
      default:
        return <AlertCircle size={size} color={color} />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {renderIcon()}
      </View>
      
      <Text style={[
        styles.title,
        {color: isDark ? '#FFFFFF' : '#333333'}
      ]}>
        {title}
      </Text>
      
      <Text style={styles.message}>
        {message}
      </Text>
      
      {actionLabel && onAction && (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onAction}
        >
          <Text style={styles.actionButtonText}>
            {actionLabel}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
  },
  actionButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});