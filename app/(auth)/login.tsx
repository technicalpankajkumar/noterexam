import { useAuth } from '@contexts/AuthContext';
import { supabase } from '@lib/supabase';
import { useRouter } from 'expo-router';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const { login, loginWithGoogle } = useAuth();
  const router = useRouter();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    setEmailError('');
    setPasswordError('');

    if (!email) {
      setEmailError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email');
      return;
    }

    if (!password) {
      setPasswordError('Password is required');
      return;
    }

    setLoading(true);
    // const success = await login(email, password);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      console.error(error)
    }
    setLoading(false);

    if (data) {
      router.replace('/(tabs)');
    } else {
      Alert.alert('Error', 'Invalid credentials');
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    // const success = await loginWithGoogle();
    const { data, error } = await supabase.auth.signInWithOAuth({ provider:'google' })
    setLoading(false);
console.log(data, error)
    // if (data) {
    //   router.replace('/(tabs)');
    // } else {
    //   Alert.alert('Error', 'Google login failed');
    // }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <TouchableOpacity
            className="absolute top-16 left-5 z-10"
            onPress={() => router.back()}
          >
            <ChevronLeft size={24} color="#333" />
          </TouchableOpacity>

          <View className="flex-1 px-6 pt-32">
            <Text className="text-[30px] font-bold text-[#333] mb-2">Log in</Text>
            <Text className="text-base text-[#666] mb-8">
              Welcome back! Please enter your details.
            </Text>

            <View className="flex-1">
              <View className="mb-5">
                <Text className="text-sm font-medium text-[#333] mb-1.5">Email</Text>
                <TextInput
                  className={`border rounded-lg px-3.5 py-3 text-base bg-white border-[#E1E5E9] ${emailError ? 'border-[#FF6B6B]' : ''}`}
                  placeholder="Enter your email"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setEmailError('');
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {emailError ? (
                  <Text className="text-[#FF6B6B] text-xs mt-1">{emailError}</Text>
                ) : null}
              </View>

              <View className="mb-5">
                <Text className="text-sm font-medium text-[#333] mb-1.5">Password</Text>
                <View className="relative">
                  <TextInput
                    className={`border rounded-lg px-3.5 py-3 pr-11 text-base bg-white border-[#E1E5E9] ${passwordError ? 'border-[#FF6B6B]' : ''}`}
                    placeholder="••••••••"
                    placeholderTextColor="#999"
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      setPasswordError('');
                    }}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    className="absolute right-3.5 top-3"
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={20} color="#999" />
                    ) : (
                      <Eye size={20} color="#999" />
                    )}
                  </TouchableOpacity>
                </View>
                {passwordError ? (
                  <Text className="text-[#FF6B6B] text-xs mt-1">{passwordError}</Text>
                ) : null}
              </View>

              <View className="flex-row justify-between items-center mb-6">
                <TouchableOpacity
                  className="flex-row items-center"
                  onPress={() => setRememberMe(!rememberMe)}
                >
                  <View className={`w-[18px] h-[18px] border-2 border-[#4A90E2] rounded-[3px] mr-2 flex items-center justify-center ${rememberMe ? 'bg-[#4A90E2]' : ''}`}>
                    {rememberMe && (
                      <Text className="text-white text-xs font-bold">✓</Text>
                    )}
                  </View>
                  <Text className="text-sm text-[#333]">Remember for 30 days</Text>
                </TouchableOpacity>

                <TouchableOpacity>
                  <Text className="text-sm text-[#4A90E2] font-medium">Forgot password</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                className={`bg-[#4A90E2] rounded-lg py-3.5 items-center mb-6 ${loading ? 'opacity-70' : ''}`}
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white text-base font-semibold">Log In</Text>
                )}
              </TouchableOpacity>

              <Text className="text-center text-[#666] mb-6">Or log in with</Text>

              <View className="flex-row justify-center gap-4 mb-8">
                <TouchableOpacity className="w-12 h-12 rounded-lg border border-[#E1E5E9] items-center justify-center bg-white">
                  <Text className="text-xl"></Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="w-12 h-12 rounded-lg border border-[#E1E5E9] items-center justify-center bg-white"
                  onPress={handleGoogleLogin}
                >
                  <Text className="text-xl">G</Text>
                </TouchableOpacity>
                <TouchableOpacity className="w-12 h-12 rounded-lg border border-[#E1E5E9] items-center justify-center bg-white">
                  <Text className="text-xl">f</Text>
                </TouchableOpacity>
              </View>

              <View className="flex-row justify-center items-center">
                <Text className="text-[#666] text-sm">Don't have an account? </Text>
                <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                  <Text className="text-[#4A90E2] text-sm font-medium">Sign up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}