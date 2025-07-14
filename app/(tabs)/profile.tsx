import { useAuth } from '@contexts/AuthContext';
import { useRouter } from 'expo-router';
import {
  Bell,
  Camera,
  ChevronRight,
  Edit,
  HelpCircle,
  LogOut,
  Settings,
  Shield,
} from 'lucide-react-native';
import React from 'react';
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  const handleNavigate=()=>{
     router.push("/profile")
  }

  const menuItems = [
    { id: 1, title: 'Edit Profile', icon: Edit, onPress: () => handleNavigate()},
    { id: 2, title: 'Settings', icon: Settings, onPress: () => console.log('Settings') },
    { id: 3, title: 'Notifications', icon: Bell, onPress: () => console.log('Notifications') },
    { id: 4, title: 'Privacy & Security', icon: Shield, onPress: () => console.log('Privacy') },
    { id: 5, title: 'Help & Support', icon: HelpCircle, onPress: () => console.log('Help') },
  ];

  const stats = [
    { label: 'Notes', value: '24' },
    { label: 'Posts', value: '12' },
    { label: 'Following', value: '156' },
    { label: 'Followers', value: '89' },
  ];

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
            <View className="absolute top-0 left-0 right-0 z-10 flex-row justify-between items-center px-2 pt-2 pb-2 bg-white border-b border-gray-200">
              <Text className="text-2xl font-bold text-gray-800 mt-1">Profile</Text>
              <View className="flex-row space-x-3">
                <TouchableOpacity className="p-2" onPress={handleLogout}>
                  <LogOut size={24} color="#333" />
                </TouchableOpacity>
              </View>
            </View>
      <ScrollView className="flex-1 mt-14" showsVerticalScrollIndicator={false}>
        <View className="bg-white py-4 items-center mb-1">
          <View className="relative mb-4">
            <Image
              source={{ uri: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg' }}
              className="w-24 h-24 rounded-full"
            />
            <TouchableOpacity className="absolute bottom-0 right-0 bg-blue-500 w-8 h-8 rounded-full justify-center items-center border-2 border-white">
              <Camera size={16} color="white" />
            </TouchableOpacity>
          </View>
          <Text className="text-xl font-bold text-gray-800 mb-1">{user?.name || 'User Name'}</Text>
          <Text className="text-sm text-gray-600 mb-6">{user?.email || 'user@email.com'}</Text>
        </View>

        {/* <View className="flex-row bg-white py-5 mb-1">
          {stats.map((stat, index) => (
            <View key={index} className="flex-1 items-center">
              <Text className="text-xl font-bold text-gray-800 mb-1">{stat.value}</Text>
              <Text className="text-sm text-gray-600">{stat.label}</Text>
            </View>
          ))}
        </View> */}

        <View className="bg-white mb-5">
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              className="flex-row items-center justify-between px-5 py-4 border-b border-gray-200"
              onPress={item.onPress}
            >
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-blue-50 justify-center items-center mr-4">
                  <item.icon size={20} color="#4A90E2" />
                </View>
                <Text className="text-base text-gray-800 font-medium">{item.title}</Text>
              </View>
              <ChevronRight size={20} color="#999" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
