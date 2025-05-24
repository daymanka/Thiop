import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { MapPin, ChevronDown } from 'lucide-react-native';

export default function LocationHeader() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [location, setLocation] = useState('Current Location');

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.locationButton}>
        <MapPin size={20} color="#FF6B35" />
        <Text style={[
          styles.locationText,
          {color: isDark ? '#FFFFFF' : '#333333'}
        ]}>
          {location}
        </Text>
        <ChevronDown size={16} color={isDark ? '#BBBBBB' : '#999999'} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 8,
  },
});