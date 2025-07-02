import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import { ArrowLeft, CreditCard, Plus, Trash2, CreditCard as Edit3 } from 'lucide-react-native';

interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'apple_pay' | 'google_pay';
  name: string;
  details: string;
  isDefault: boolean;
  lastFour?: string;
  expiryDate?: string;
  cardType?: string;
}

export default function PaymentMethodsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    setLoading(true);
    try {
      // Mock data - in real app, this would come from your backend
      const mockMethods: PaymentMethod[] = [
        {
          id: '1',
          type: 'card',
          name: 'Visa ending in 4242',
          details: 'Expires 12/25',
          isDefault: true,
          lastFour: '4242',
          expiryDate: '12/25',
          cardType: 'Visa'
        },
        {
          id: '2',
          type: 'card',
          name: 'Mastercard ending in 8888',
          details: 'Expires 08/26',
          isDefault: false,
          lastFour: '8888',
          expiryDate: '08/26',
          cardType: 'Mastercard'
        },
        {
          id: '3',
          type: 'paypal',
          name: 'PayPal',
          details: 'john.doe@example.com',
          isDefault: false
        }
      ];
      
      setPaymentMethods(mockMethods);
    } catch (err) {
      console.error('Error loading payment methods:', err);
      Alert.alert('Error', 'Failed to load payment methods');
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (methodId: string) => {
    try {
      setPaymentMethods(prev => 
        prev.map(method => ({
          ...method,
          isDefault: method.id === methodId
        }))
      );
      
      Alert.alert('Success', 'Default payment method updated');
    } catch (err) {
      console.error('Error setting default payment method:', err);
      Alert.alert('Error', 'Failed to update default payment method');
    }
  };

  const handleDeleteMethod = (methodId: string) => {
    Alert.alert(
      'Delete Payment Method',
      'Are you sure you want to delete this payment method?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setPaymentMethods(prev => prev.filter(method => method.id !== methodId));
              Alert.alert('Success', 'Payment method deleted');
            } catch (err) {
              console.error('Error deleting payment method:', err);
              Alert.alert('Error', 'Failed to delete payment method');
            }
          }
        }
      ]
    );
  };

  const getCardIcon = (cardType: string) => {
    // In a real app, you'd return appropriate card brand icons
    return <CreditCard size={24} color="#FF6B35" />;
  };

  const getMethodIcon = (type: string) => {
    switch (type) {
      case 'card':
        return <CreditCard size={24} color="#FF6B35" />;
      default:
        return <CreditCard size={24} color="#FF6B35" />;
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered, {backgroundColor: isDark ? '#121212' : '#F8F9FA'}]}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: isDark ? '#121212' : '#F8F9FA'}]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={isDark ? '#FFFFFF' : '#333333'} />
        </TouchableOpacity>
        <Text style={[styles.title, {color: isDark ? '#FFFFFF' : '#333333'}]}>
          Payment Methods
        </Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {paymentMethods.map(method => (
          <View key={method.id} style={[styles.methodCard, {backgroundColor: isDark ? '#222222' : '#FFFFFF'}]}>
            <View style={styles.methodHeader}>
              <View style={styles.methodInfo}>
                {method.type === 'card' && method.cardType ? 
                  getCardIcon(method.cardType) : 
                  getMethodIcon(method.type)
                }
                
                <View style={styles.methodDetails}>
                  <Text style={[styles.methodName, {color: isDark ? '#FFFFFF' : '#333333'}]}>
                    {method.name}
                  </Text>
                  <Text style={styles.methodSubtext}>
                    {method.details}
                  </Text>
                </View>
              </View>
              
              {method.isDefault && (
                <View style={styles.defaultBadge}>
                  <Text style={styles.defaultText}>Default</Text>
                </View>
              )}
            </View>
            
            <View style={styles.methodActions}>
              {!method.isDefault && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleSetDefault(method.id)}
                >
                  <Text style={styles.setDefaultText}>Set as Default</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {
                  // Navigate to edit payment method screen
                  router.push(`/edit-payment-method/${method.id}`);
                }}
              >
                <Edit3 size={16} color="#FF6B35" />
                <Text style={styles.actionButtonText}>Edit</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleDeleteMethod(method.id)}
              >
                <Trash2 size={16} color="#E53935" />
                <Text style={[styles.actionButtonText, {color: '#E53935'}]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        
        <TouchableOpacity
          style={[styles.addMethodButton, {backgroundColor: isDark ? '#222222' : '#FFFFFF'}]}
          onPress={() => router.push('/add-payment-method')}
        >
          <Plus size={24} color="#FF6B35" />
          <Text style={[styles.addMethodText, {color: isDark ? '#FFFFFF' : '#333333'}]}>
            Add New Payment Method
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  methodCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  methodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  methodDetails: {
    marginLeft: 12,
    flex: 1,
  },
  methodName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  methodSubtext: {
    fontSize: 14,
    color: '#666666',
  },
  defaultBadge: {
    backgroundColor: '#4CB944',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  defaultText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  methodActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginLeft: 8,
  },
  actionButtonText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B35',
  },
  setDefaultText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CB944',
  },
  addMethodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#FF6B35',
    borderStyle: 'dashed',
  },
  addMethodText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});