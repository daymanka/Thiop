import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Switch, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import { Settings, CreditCard, History, MapPin, LogOut, ChevronRight, Bell } from 'lucide-react-native';
import { getCurrentUser, logout } from '@/services/authService';
import { getRecentOrders } from '@/services/orderService';
import RecentOrderCard from '@/components/profile/RecentOrderCard';

export default function ProfileScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [user, setUser] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setLoading(true);
    try {
      const userData = await getCurrentUser();
      const ordersData = await getRecentOrders(3);
      
      setUser(userData);
      setRecentOrders(ordersData);
    } catch (err) {
      console.error('Error loading user data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/auth/login');
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered, {backgroundColor: isDark ? '#121212' : '#F8F9FA'}]}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  // This would normally check if the user is logged in
  if (!user) {
    return (
      <SafeAreaView style={[styles.container, {backgroundColor: isDark ? '#121212' : '#F8F9FA'}]}>
        <View style={styles.header}>
          <Text style={[styles.title, {color: isDark ? '#FFFFFF' : '#333333'}]}>Profile</Text>
        </View>
        
        <View style={styles.loginContainer}>
          <Text style={[styles.loginMessage, {color: isDark ? '#FFFFFF' : '#333333'}]}>
            Sign in to view your profile and order history
          </Text>
          
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push('/auth/login')}
          >
            <Text style={styles.loginButtonText}>Sign In / Sign Up</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: isDark ? '#121212' : '#F8F9FA'}]}>
      <View style={styles.header}>
        <Text style={[styles.title, {color: isDark ? '#FFFFFF' : '#333333'}]}>Profile</Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={[styles.profileCard, {backgroundColor: isDark ? '#222222' : '#FFFFFF'}]}>
          <Image 
            source={{ uri: user.avatar }} 
            style={styles.avatar}
          />
          
          <View style={styles.profileInfo}>
            <Text style={[styles.userName, {color: isDark ? '#FFFFFF' : '#333333'}]}>
              {user.name}
            </Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            
            <TouchableOpacity
              style={styles.editProfileButton}
              onPress={() => router.push('/profile/edit')}
            >
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {recentOrders.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, {color: isDark ? '#FFFFFF' : '#333333'}]}>
                Recent Orders
              </Text>
              
              <TouchableOpacity onPress={() => router.push('/profile/orders')}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            
            {recentOrders.map(order => (
              <RecentOrderCard 
                key={order.id} 
                order={order} 
                onPress={() => router.push(`/order/${order.id}`)}
                isDark={isDark}
              />
            ))}
          </View>
        )}
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: isDark ? '#FFFFFF' : '#333333'}]}>
            Account Settings
          </Text>
          
          <View style={[styles.optionsCard, {backgroundColor: isDark ? '#222222' : '#FFFFFF'}]}>
            <TouchableOpacity 
              style={styles.optionItem}
              onPress={() => router.push('/profile/personal-info')}
            >
              <View style={styles.optionLeft}>
                <Settings size={20} color="#FF6B35" />
                <Text style={[styles.optionText, {color: isDark ? '#FFFFFF' : '#333333'}]}>
                  Personal Information
                </Text>
              </View>
              <ChevronRight size={20} color={isDark ? '#BBBBBB' : '#999999'} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.optionItem}
              onPress={() => router.push('/profile/payment')}
            >
              <View style={styles.optionLeft}>
                <CreditCard size={20} color="#FF6B35" />
                <Text style={[styles.optionText, {color: isDark ? '#FFFFFF' : '#333333'}]}>
                  Payment Methods
                </Text>
              </View>
              <ChevronRight size={20} color={isDark ? '#BBBBBB' : '#999999'} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.optionItem}
              onPress={() => router.push('/profile/addresses')}
            >
              <View style={styles.optionLeft}>
                <MapPin size={20} color="#FF6B35" />
                <Text style={[styles.optionText, {color: isDark ? '#FFFFFF' : '#333333'}]}>
                  Address Book
                </Text>
              </View>
              <ChevronRight size={20} color={isDark ? '#BBBBBB' : '#999999'} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.optionItem}
              onPress={() => router.push('/profile/orders')}
            >
              <View style={styles.optionLeft}>
                <History size={20} color="#FF6B35" />
                <Text style={[styles.optionText, {color: isDark ? '#FFFFFF' : '#333333'}]}>
                  Order History
                </Text>
              </View>
              <ChevronRight size={20} color={isDark ? '#BBBBBB' : '#999999'} />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: isDark ? '#FFFFFF' : '#333333'}]}>
            Preferences
          </Text>
          
          <View style={[styles.optionsCard, {backgroundColor: isDark ? '#222222' : '#FFFFFF'}]}>
            <View style={styles.optionItem}>
              <View style={styles.optionLeft}>
                <Bell size={20} color="#FF6B35" />
                <Text style={[styles.optionText, {color: isDark ? '#FFFFFF' : '#333333'}]}>
                  Push Notifications
                </Text>
              </View>
              <Switch
                trackColor={{ false: '#DDDDDD', true: '#FF6B35' }}
                thumbColor={'#FFFFFF'}
                onValueChange={setNotificationsEnabled}
                value={notificationsEnabled}
              />
            </View>
          </View>
        </View>
        
        <TouchableOpacity
          style={[styles.logoutButton, {backgroundColor: isDark ? '#222222' : '#FFFFFF'}]}
          onPress={handleLogout}
        >
          <LogOut size={20} color="#E53935" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
        
        <Text style={styles.versionText}>Version 1.0.0</Text>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0F0F0',
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
  },
  userEmail: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  editProfileButton: {
    marginTop: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FF6B35',
    alignSelf: 'flex-start',
  },
  editProfileText: {
    color: '#FF6B35',
    fontWeight: '600',
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B35',
  },
  optionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    marginLeft: 12,
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#E53935',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#999999',
    marginBottom: 24,
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  loginMessage: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 24,
  },
  loginButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});