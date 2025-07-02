import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Check } from 'lucide-react-native';

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  enabled: boolean;
}

interface PaymentMethodCardProps {
  method: PaymentMethod;
  selected: boolean;
  onSelect: () => void;
  isDark: boolean;
}

export default function PaymentMethodCard({ method, selected, onSelect, isDark }: PaymentMethodCardProps) {
  const IconComponent = method.icon;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: isDark ? '#333333' : '#F8F9FA',
          borderColor: selected ? '#FF6B35' : (isDark ? '#444444' : '#EEEEEE'),
        }
      ]}
      onPress={onSelect}
      disabled={!method.enabled}
    >
      <View style={styles.leftContent}>
        <View style={[
          styles.iconContainer,
          {backgroundColor: isDark ? '#444444' : '#FFFFFF'}
        ]}>
          <IconComponent size={20} color="#FF6B35" />
        </View>
        
        <View style={styles.textContainer}>
          <Text style={[
            styles.methodName,
            {color: isDark ? '#FFFFFF' : '#333333'}
          ]}>
            {method.name}
          </Text>
          <Text style={styles.methodDescription}>
            {method.description}
          </Text>
        </View>
      </View>
      
      {selected && (
        <View style={styles.selectedIndicator}>
          <Check size={16} color="#FFFFFF" />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 12,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  methodName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  methodDescription: {
    fontSize: 14,
    color: '#666666',
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
  },
});