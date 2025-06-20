import { useAuth } from '@contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

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
      <View className={'flex-1 justify-center items-center px-5'}>
        <Text className={'text-white text-3xl font-bold mb-2'}>
          Welcome
        </Text>
        <Text className={'text-white text-opacity-80 text-base mb-10'}>
          Noter-Exam
        </Text>
        <ActivityIndicator size="large" color="white" className={'mt-5'} />
      </View>
    </LinearGradient>
  );
}
