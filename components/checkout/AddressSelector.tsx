import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Check, Plus } from 'lucide-react-native';

interface Address {
  id: string;
  type: string;
  address: string;
  city: string;
  isDefault: boolean;
}

interface AddressSelectorProps {
  addresses: Address[];
  selectedAddress: Address | null;
  onSelectAddress: (address: Address) => void;
  isDark: boolean;
}

export default function AddressSelector({ addresses, selectedAddress, onSelectAddress, isDark }: AddressSelectorProps) {
  return (
    <View style={styles.container}>
      {addresses.map(address => (
        <TouchableOpacity
          key={address.id}
          style={[
            styles.addressCard,
            {
              backgroundColor: isDark ? '#333333' : '#F8F9FA',
              borderColor: selectedAddress?.id === address.id ? '#FF6B35' : (isDark ? '#444444' : '#EEEEEE'),
            }
          ]}
          onPress={() => onSelectAddress(address)}
        >
          <View style={styles.addressContent}>
            <View style={styles.addressHeader}>
              <Text style={[
                styles.addressType,
                {color: isDark ? '#FFFFFF' : '#333333'}
              ]}>
                {address.type}
              </Text>
              {address.isDefault && (
                <View style={styles.defaultBadge}>
                  <Text style={styles.defaultText}>Default</Text>
                </View>
              )}
            </View>
            
            <Text style={[
              styles.addressText,
              {color: isDark ? '#BBBBBB' : '#666666'}
            ]}>
              {address.address}
            </Text>
            <Text style={[
              styles.cityText,
              {color: isDark ? '#BBBBBB' : '#666666'}
            ]}>
              {address.city}
            </Text>
          </View>
          
          {selectedAddress?.id === address.id && (
            <View style={styles.selectedIndicator}>
              <Check size={16} color="#FFFFFF" />
            </View>
          )}
        </TouchableOpacity>
      ))}
      
      <TouchableOpacity style={[
        styles.addAddressButton,
        {backgroundColor: isDark ? '#333333' : '#F8F9FA'}
      ]}>
        <Plus size={20} color="#FF6B35" />
        <Text style={[
          styles.addAddressText,
          {color: isDark ? '#FFFFFF' : '#333333'}
        ]}>
          Add New Address
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 12,
  },
  addressContent: {
    flex: 1,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressType: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  defaultBadge: {
    backgroundColor: '#4CB944',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  defaultText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  addressText: {
    fontSize: 14,
    marginBottom: 4,
  },
  cityText: {
    fontSize: 14,
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FF6B35',
    borderStyle: 'dashed',
  },
  addAddressText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});