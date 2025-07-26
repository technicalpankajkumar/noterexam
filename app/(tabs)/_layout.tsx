import { Tabs } from 'expo-router';
import { FileText, Home, User, Users } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{ 
        headerShown: false,
        tabBarActiveTintColor: '#1e40af',
        tabBarInactiveTintColor: '#999',
        tabBarLabelStyle: { fontSize: 12, fontWeight: '500' },
        // Custom tab bar styles:
        tabBarStyle: {
          backgroundColor: '#f8fafc', // light mode bg-gray-50
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb', // border-gray-200
          paddingVertical: 6,
          height: 64,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Home', tabBarIcon: ({ size, color }) => <Home size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="notes"
        options={{ title: 'Notes', tabBarIcon: ({ size, color }) => <FileText size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="news"
        options={{ title: 'News', tabBarIcon: ({ size, color }) => <Users size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile', tabBarIcon: ({ size, color }) => <User size={size} color={color} /> }}
      />
    </Tabs>
  );
}
