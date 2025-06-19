import ButtonNE from '@components/custom-ui/ButtonNE';
import InputNE from '@components/custom-ui/InputNE';
import PasswordInputNE from '@components/custom-ui/PasswordInputNE';
import { useAuth } from '@contexts/AuthContext';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [mobileError, setMobileError] = useState('');

  const { signupWithEmailMobilePassword , loading} = useAuth();
  const router = useRouter();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleRegister = async () => {
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setMobileError('')

    if (!name) {
      setNameError('Name is required');
      return;
    }
    if (!mobile) {
      setMobileError('Mobile is required');
      return;
    }

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

    if (!validatePassword(password)) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }

    const { success ,error} = await signupWithEmailMobilePassword({
      email,
      password,
      name,
      mobile
    });
    if (success) {
      Alert.alert('Success', 'Registration successful');
      router.push('/(tabs)')
      // router.push('/(auth)/verify-email');
    } else {
      Alert.alert('Error', error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          <View className="flex-1 px-6 pt-32 justify-center ">
            <Text className="text-[30px] font-bold text-[#333] mb-2 text-center">Welcome Back</Text>
            <Text className="text-base text-[#666] mb-8 text-center">
              Create an account : NoterExam
            </Text>
            <View className="flex-1">
              <InputNE
                title='Name'
                placeholder='Enter your name'
                value={name}
                onChangeText={(text: string) => {
                  setName(text);
                  setNameError('');
                }
                }
                error={nameError}
                keyboardType='numbers-and-punctuation'
              />
              <InputNE
                title='Mobile'
                placeholder='Enter your mobile number'
                value={mobile}
                onChangeText={(text: string) => {
                  setMobile(text);
                  setMobileError('');
                }
                }
                error={mobileError}
                keyboardType='number-pad'
              />
  
              <InputNE
                title='Email'
                placeholder='Enter your email'
                value={email}
                onChangeText={(text: string) => {
                  setEmail(text);
                  setEmailError('');
                }
                }
                error={emailError}
                keyboardType='email-address'
              />
              <PasswordInputNE
                value={password}
                onChangeText={(text: string) => {
                  setPassword(text);
                  setPasswordError('');
                }
                }
                
                showPassword={showPassword}
                onShowPasswordToggle={() => setShowPassword(!showPassword)}
                passwordError={passwordError}
              />
              <ButtonNE
                loading={loading}
                title='Sign Up'
                onPress={handleRegister}
              />
              <View className="flex-row justify-center items-center">
                <Text className="text-[#666] text-sm">Already have an account?  </Text>
                <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                  <Text className="text-[#4A90E2] text-sm font-medium">Log in</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}