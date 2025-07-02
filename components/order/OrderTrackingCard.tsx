import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Clock, CircleCheck as CheckCircle, Truck, Package } from 'lucide-react-native';

interface TrackingData {
  status: string;
  progress: number;
  estimatedArrival: string;
}

interface OrderTrackingCardProps {
  tracking: TrackingData;
  isDark: boolean;
}

export default function OrderTrackingCard({ tracking, isDark }: OrderTrackingCardProps) {
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'confirmed':
        return { icon: CheckCircle, text: 'Order Confirmed', color: '#4CB944' };
      case 'preparing':
        return { icon: Package, text: 'Preparing Your Order', color: '#F59E0B' };
      case 'ready_for_pickup':
        return { icon: Package, text: 'Ready for Pickup', color: '#F59E0B' };
      case 'on_the_way':
        return { icon: Truck, text: 'On the Way', color: '#FF6B35' };
      case 'delivered':
        return { icon: CheckCircle, text: 'Delivered', color: '#4CB944' };
      default:
        return { icon: Clock, text: 'Processing', color: '#666666' };
    }
  };

  const statusInfo = getStatusInfo(tracking.status);
  const StatusIcon = statusInfo.icon;

  const trackingSteps = [
    { key: 'confirmed', label: 'Confirmed', progress: 0.25 },
    { key: 'preparing', label: 'Preparing', progress: 0.5 },
    { key: 'on_the_way', label: 'On the Way', progress: 0.75 },
    { key: 'delivered', label: 'Delivered', progress: 1.0 },
  ];

  const getCurrentStepIndex = () => {
    return trackingSteps.findIndex(step => step.key === tracking.status);
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <View style={[styles.container, {backgroundColor: isDark ? '#222222' : '#FFFFFF'}]}>
      <View style={styles.header}>
        <StatusIcon size={24} color={statusInfo.color} />
        <View style={styles.statusInfo}>
          <Text style={[styles.statusText, {color: isDark ? '#FFFFFF' : '#333333'}]}>
            {statusInfo.text}
          </Text>
          <Text style={styles.estimatedTime}>
            {tracking.estimatedArrival}
          </Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { width: `${tracking.progress * 100}%` }
            ]} 
          />
        </View>
        
        <View style={styles.stepsContainer}>
          {trackingSteps.map((step, index) => (
            <View key={step.key} style={styles.step}>
              <View style={[
                styles.stepIndicator,
                {
                  backgroundColor: index <= currentStepIndex ? '#FF6B35' : (isDark ? '#444444' : '#EEEEEE'),
                }
              ]}>
                {index <= currentStepIndex && (
                  <CheckCircle size={12} color="#FFFFFF" />
                )}
              </View>
              <Text style={[
                styles.stepLabel,
                {
                  color: index <= currentStepIndex ? (isDark ? '#FFFFFF' : '#333333') : '#999999',
                  fontWeight: index <= currentStepIndex ? '600' : '400',
                }
              ]}>
                {step.label}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  statusInfo: {
    marginLeft: 12,
    flex: 1,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  estimatedTime: {
    fontSize: 14,
    color: '#666666',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#EEEEEE',
    borderRadius: 2,
    marginBottom: 16,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF6B35',
    borderRadius: 2,
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  step: {
    alignItems: 'center',
    flex: 1,
  },
  stepIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
});