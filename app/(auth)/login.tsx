import ButtonNE from '@components/custom-ui/ButtonNE';
import InputNE from '@components/custom-ui/InputNE';
import { useAuth } from '@contexts/AuthContext';
import { useRouter } from 'expo-router';
import { NotebookPen } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const { loginWithEmailPassword,loading,user } = useAuth();
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
   let {success} = await loginWithEmailPassword(email, password );

    if (success) {
      router.replace('/(tabs)');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>

          <View className="flex-1 px-6 pt-32  justify-center "> 
            <Text className="text-4xl font-bold text-[#333] mb-2 text-center">Welcome</Text>
            <View className='flex-row items-center gap-1 justify-center py-2'>
              <NotebookPen size={20} color={'#1e40af'} fontWeight={'bold'} />
              <Text className="text-base font-bold text-blue-800">{'Noter Exam'}</Text>
            </View>

            <View className="flex-1">
              <InputNE
              isRequired
                 title='Email'
                 placeholder='Enter your email'
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setEmailError('');} }
                    keyboardType='email-address'
                    error={emailError}
              />

              <InputNE
                title='Password'
                isRequired
                type='password'
                value={password}
                placeholder='Enter your password'
                onChangeText={(text) => {
                  setPassword(text);
                  setPasswordError('');
                }}
                showPassword={showPassword}
                onShowPasswordToggle={() => setShowPassword(!showPassword)}
                error={passwordError}
                postfixIcon
              />

              <View className="flex-row justify-end items-center mb-3">
                <TouchableOpacity>
                  <Text className="text-base text-blue-800 font-medium">Forgot password</Text>
                </TouchableOpacity>
              </View>
              <ButtonNE 
               onPress={handleLogin}
               loading={loading}
              />

              <View className="flex-row justify-center items-center">
                <Text className="text-[#666] text-base">Don't have an account? </Text>
                <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                  <Text className="text-blue-800 text-base font-medium">Sign up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}