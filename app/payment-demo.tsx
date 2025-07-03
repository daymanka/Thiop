import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import { 
  ArrowLeft, 
  CreditCard, 
  Smartphone, 
  Wallet, 
  CheckCircle, 
  Clock,
  ShoppingCart,
  MapPin,
  Receipt,
  Truck,
  Package
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function PaymentDemoScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [animatedValue] = useState(new Animated.Value(0));
  const [progressValue] = useState(new Animated.Value(0));

  const demoSteps = [
    {
      id: 'cart',
      title: 'Panier',
      description: 'Articles sélectionnés',
      icon: ShoppingCart,
      color: '#FF6B35'
    },
    {
      id: 'address',
      title: 'Adresse',
      description: 'Lieu de livraison',
      icon: MapPin,
      color: '#4CB944'
    },
    {
      id: 'payment',
      title: 'Paiement',
      description: 'Méthode de paiement',
      icon: CreditCard,
      color: '#8B5CF6'
    },
    {
      id: 'confirmation',
      title: 'Confirmation',
      description: 'Commande validée',
      icon: CheckCircle,
      color: '#10B981'
    },
    {
      id: 'tracking',
      title: 'Suivi',
      description: 'En cours de livraison',
      icon: Truck,
      color: '#F59E0B'
    }
  ];

  const paymentMethods = [
    {
      id: 'card',
      name: 'Carte Bancaire',
      icon: CreditCard,
      description: 'Visa, Mastercard, Amex',
      processingTime: '2-3 secondes'
    },
    {
      id: 'apple_pay',
      name: 'Apple Pay',
      icon: Smartphone,
      description: 'Touch ID / Face ID',
      processingTime: '1-2 secondes'
    },
    {
      id: 'google_pay',
      name: 'Google Pay',
      icon: Wallet,
      description: 'Paiement rapide',
      processingTime: '1-2 secondes'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: Wallet,
      description: 'Compte PayPal',
      processingTime: '3-5 secondes'
    }
  ];

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [orderData] = useState({
    items: [
      { name: 'Pizza Margherita', price: 12.99, quantity: 2 },
      { name: 'Coca Cola', price: 2.50, quantity: 1 }
    ],
    subtotal: 28.48,
    deliveryFee: 2.99,
    total: 31.47
  });

  useEffect(() => {
    // Animation d'entrée
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const simulatePaymentProcess = async () => {
    setIsProcessing(true);
    
    // Simulation du processus de paiement
    const steps = [
      { step: 1, message: 'Validation des données...', duration: 1000 },
      { step: 2, message: 'Traitement du paiement...', duration: 2000 },
      { step: 3, message: 'Confirmation de la commande...', duration: 1000 },
      { step: 4, message: 'Notification au restaurant...', duration: 800 },
      { step: 5, message: 'Commande confirmée !', duration: 500 }
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, steps[i].duration));
      
      Animated.timing(progressValue, {
        toValue: (i + 1) / steps.length,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }

    setIsProcessing(false);
    setCurrentStep(4); // Aller au suivi
  };

  const nextStep = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {demoSteps.map((step, index) => {
        const StepIcon = step.icon;
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        
        return (
          <View key={step.id} style={styles.stepItem}>
            <View style={[
              styles.stepCircle,
              {
                backgroundColor: isActive ? step.color : isCompleted ? '#4CB944' : (isDark ? '#444444' : '#EEEEEE'),
                borderColor: isActive ? step.color : 'transparent'
              }
            ]}>
              <StepIcon 
                size={16} 
                color={isActive || isCompleted ? '#FFFFFF' : '#999999'} 
              />
            </View>
            <Text style={[
              styles.stepLabel,
              {
                color: isActive ? (isDark ? '#FFFFFF' : '#333333') : '#999999',
                fontWeight: isActive ? '600' : '400'
              }
            ]}>
              {step.title}
            </Text>
          </View>
        );
      })}
    </View>
  );

  const renderCartStep = () => (
    <Animated.View style={[
      styles.stepContent,
      {
        opacity: animatedValue,
        transform: [{
          translateY: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [50, 0]
          })
        }]
      }
    ]}>
      <View style={[styles.card, {backgroundColor: isDark ? '#222222' : '#FFFFFF'}]}>
        <View style={styles.cardHeader}>
          <ShoppingCart size={24} color="#FF6B35" />
          <Text style={[styles.cardTitle, {color: isDark ? '#FFFFFF' : '#333333'}]}>
            Votre Panier
          </Text>
        </View>
        
        {orderData.items.map((item, index) => (
          <View key={index} style={styles.cartItem}>
            <View style={styles.cartItemInfo}>
              <Text style={[styles.itemName, {color: isDark ? '#FFFFFF' : '#333333'}]}>
                {item.name}
              </Text>
              <Text style={styles.itemPrice}>
                ${item.price.toFixed(2)} x {item.quantity}
              </Text>
            </View>
            <Text style={[styles.itemTotal, {color: isDark ? '#FFFFFF' : '#333333'}]}>
              ${(item.price * item.quantity).toFixed(2)}
            </Text>
          </View>
        ))}
        
        <View style={styles.cartSummary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Sous-total</Text>
            <Text style={[styles.summaryValue, {color: isDark ? '#FFFFFF' : '#333333'}]}>
              ${orderData.subtotal.toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Livraison</Text>
            <Text style={[styles.summaryValue, {color: isDark ? '#FFFFFF' : '#333333'}]}>
              ${orderData.deliveryFee.toFixed(2)}
            </Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={[styles.totalLabel, {color: isDark ? '#FFFFFF' : '#333333'}]}>
              Total
            </Text>
            <Text style={styles.totalValue}>
              ${orderData.total.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );

  const renderAddressStep = () => (
    <View style={styles.stepContent}>
      <View style={[styles.card, {backgroundColor: isDark ? '#222222' : '#FFFFFF'}]}>
        <View style={styles.cardHeader}>
          <MapPin size={24} color="#4CB944" />
          <Text style={[styles.cardTitle, {color: isDark ? '#FFFFFF' : '#333333'}]}>
            Adresse de Livraison
          </Text>
        </View>
        
        <View style={styles.addressCard}>
          <View style={styles.addressHeader}>
            <Text style={[styles.addressType, {color: isDark ? '#FFFFFF' : '#333333'}]}>
              Domicile
            </Text>
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultText}>Par défaut</Text>
            </View>
          </View>
          <Text style={styles.addressText}>123 Rue de la Paix, Apt 4B</Text>
          <Text style={styles.addressText}>75001 Paris, France</Text>
        </View>
        
        <View style={styles.deliveryInfo}>
          <Clock size={16} color="#F59E0B" />
          <Text style={styles.deliveryTime}>
            Livraison estimée: 30-45 minutes
          </Text>
        </View>
      </View>
    </View>
  );

  const renderPaymentStep = () => (
    <View style={styles.stepContent}>
      <View style={[styles.card, {backgroundColor: isDark ? '#222222' : '#FFFFFF'}]}>
        <View style={styles.cardHeader}>
          <CreditCard size={24} color="#8B5CF6" />
          <Text style={[styles.cardTitle, {color: isDark ? '#FFFFFF' : '#333333'}]}>
            Méthode de Paiement
          </Text>
        </View>
        
        {paymentMethods.map(method => {
          const MethodIcon = method.icon;
          const isSelected = selectedPaymentMethod === method.id;
          
          return (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentMethod,
                {
                  backgroundColor: isDark ? '#333333' : '#F8F9FA',
                  borderColor: isSelected ? '#8B5CF6' : (isDark ? '#444444' : '#EEEEEE')
                }
              ]}
              onPress={() => setSelectedPaymentMethod(method.id)}
            >
              <View style={styles.methodInfo}>
                <View style={styles.methodIcon}>
                  <MethodIcon size={20} color="#8B5CF6" />
                </View>
                <View style={styles.methodDetails}>
                  <Text style={[styles.methodName, {color: isDark ? '#FFFFFF' : '#333333'}]}>
                    {method.name}
                  </Text>
                  <Text style={styles.methodDescription}>
                    {method.description}
                  </Text>
                  <Text style={styles.processingTime}>
                    Traitement: {method.processingTime}
                  </Text>
                </View>
              </View>
              {isSelected && (
                <CheckCircle size={20} color="#8B5CF6" />
              )}
            </TouchableOpacity>
          );
        })}
        
        {isProcessing && (
          <View style={styles.processingContainer}>
            <View style={styles.progressBar}>
              <Animated.View 
                style={[
                  styles.progressFill,
                  {
                    width: progressValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%']
                    })
                  }
                ]} 
              />
            </View>
            <Text style={styles.processingText}>
              Traitement du paiement en cours...
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderConfirmationStep = () => (
    <View style={styles.stepContent}>
      <View style={[styles.card, {backgroundColor: isDark ? '#222222' : '#FFFFFF'}]}>
        <View style={styles.successContainer}>
          <CheckCircle size={64} color="#10B981" />
          <Text style={[styles.successTitle, {color: isDark ? '#FFFFFF' : '#333333'}]}>
            Paiement Réussi !
          </Text>
          <Text style={styles.successMessage}>
            Votre commande a été confirmée et est en cours de préparation
          </Text>
          
          <View style={styles.orderInfo}>
            <Text style={[styles.orderNumber, {color: isDark ? '#FFFFFF' : '#333333'}]}>
              Commande #ORD123456
            </Text>
            <Text style={styles.orderDate}>
              {new Date().toLocaleDateString('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderTrackingStep = () => (
    <View style={styles.stepContent}>
      <View style={[styles.card, {backgroundColor: isDark ? '#222222' : '#FFFFFF'}]}>
        <View style={styles.cardHeader}>
          <Truck size={24} color="#F59E0B" />
          <Text style={[styles.cardTitle, {color: isDark ? '#FFFFFF' : '#333333'}]}>
            Suivi de Commande
          </Text>
        </View>
        
        <View style={styles.trackingContainer}>
          <View style={styles.trackingStep}>
            <CheckCircle size={20} color="#10B981" />
            <Text style={[styles.trackingText, {color: isDark ? '#FFFFFF' : '#333333'}]}>
              Commande confirmée
            </Text>
          </View>
          
          <View style={styles.trackingStep}>
            <Package size={20} color="#F59E0B" />
            <Text style={[styles.trackingText, {color: isDark ? '#FFFFFF' : '#333333'}]}>
              En cours de préparation
            </Text>
          </View>
          
          <View style={[styles.trackingStep, {opacity: 0.5}]}>
            <Truck size={20} color="#999999" />
            <Text style={styles.trackingTextInactive}>
              En route
            </Text>
          </View>
          
          <View style={[styles.trackingStep, {opacity: 0.5}]}>
            <CheckCircle size={20} color="#999999" />
            <Text style={styles.trackingTextInactive}>
              Livré
            </Text>
          </View>
        </View>
        
        <View style={styles.estimatedTime}>
          <Clock size={16} color="#F59E0B" />
          <Text style={styles.estimatedTimeText}>
            Temps estimé: 25-35 minutes
          </Text>
        </View>
      </View>
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0: return renderCartStep();
      case 1: return renderAddressStep();
      case 2: return renderPaymentStep();
      case 3: return renderConfirmationStep();
      case 4: return renderTrackingStep();
      default: return renderCartStep();
    }
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: isDark ? '#121212' : '#F8F9FA'}]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={isDark ? '#FFFFFF' : '#333333'} />
        </TouchableOpacity>
        <Text style={[styles.title, {color: isDark ? '#FFFFFF' : '#333333'}]}>
          Simulation Paiement
        </Text>
      </View>

      {renderStepIndicator()}

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderCurrentStep()}
      </ScrollView>

      <View style={[styles.footer, {backgroundColor: isDark ? '#222222' : '#FFFFFF'}]}>
        <View style={styles.buttonContainer}>
          {currentStep > 0 && (
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={prevStep}
            >
              <Text style={styles.secondaryButtonText}>Précédent</Text>
            </TouchableOpacity>
          )}
          
          {currentStep < 2 && (
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={nextStep}
            >
              <Text style={styles.primaryButtonText}>Suivant</Text>
            </TouchableOpacity>
          )}
          
          {currentStep === 2 && (
            <TouchableOpacity
              style={[styles.button, styles.primaryButton, {opacity: isProcessing ? 0.7 : 1}]}
              onPress={simulatePaymentProcess}
              disabled={isProcessing}
            >
              <Text style={styles.primaryButtonText}>
                {isProcessing ? 'Traitement...' : 'Payer Maintenant'}
              </Text>
            </TouchableOpacity>
          )}
          
          {currentStep >= 3 && (
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={() => router.push('/')}
            >
              <Text style={styles.primaryButtonText}>Retour à l'accueil</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
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
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  stepItem: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 2,
  },
  stepLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  stepContent: {
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 12,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  cartItemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: '#666666',
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: '700',
  },
  cartSummary: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666666',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FF6B35',
  },
  addressCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
    color: '#666666',
    marginBottom: 2,
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryTime: {
    marginLeft: 8,
    fontSize: 14,
    color: '#F59E0B',
    fontWeight: '600',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 12,
  },
  methodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  methodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  methodDetails: {
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
    marginBottom: 2,
  },
  processingTime: {
    fontSize: 12,
    color: '#8B5CF6',
    fontWeight: '500',
  },
  processingContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 2,
  },
  processingText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  successMessage: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
  },
  orderInfo: {
    alignItems: 'center',
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: '#666666',
  },
  trackingContainer: {
    marginVertical: 16,
  },
  trackingStep: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  trackingText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  trackingTextInactive: {
    marginLeft: 12,
    fontSize: 16,
    color: '#999999',
  },
  estimatedTime: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    padding: 12,
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
  },
  estimatedTimeText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#F59E0B',
    fontWeight: '600',
  },
  footer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  primaryButton: {
    backgroundColor: '#FF6B35',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FF6B35',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButtonText: {
    color: '#FF6B35',
    fontSize: 16,
    fontWeight: '700',
  },
});