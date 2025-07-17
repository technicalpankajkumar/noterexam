import { useAuth } from '@contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { NotebookPen } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { View } from 'react-native';

export default function SplashScreen() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        if (user) {
          router.replace('/(tabs)');
        } else {
          router.replace('/(auth)/login');
        }
      }, 2000);
    }
  }, [user, loading]);

  return (
    <LinearGradient
      colors={['#4A90E2', '#357ABD']}
      className={'flex-1'}
    >
     <View className="flex-1 bg-blue-600 items-center justify-center">
      {/* Concentric Circles */}
      <View className="absolute w-[500px] h-[500px] rounded-full bg-blue-500 border border-dotted border-white animate-spin" />
      <View className="absolute w-96 h-96 rounded-full bg-blue-400 opacity-45 border border-dotted border-blue-800 animate-spin" />
      <View className="absolute w-64 h-64 rounded-full bg-blue-200 opacity-35" />
      <View className="absolute w-28 h-w-28 rounded-full bg-blue-100 opacity-25" />

      {/* Center Icon + Text */}
      <View className="w-24 h-24 rounded-full border-4 border-white items-center justify-center bg-blue-500">
        <NotebookPen size={32} color="white" />
        
      </View>
    </View>
    </LinearGradient>
  );
}
