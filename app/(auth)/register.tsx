import ButtonNE from '@components/custom-ui/ButtonNE';
import InputNE from '@components/custom-ui/InputNE';
import { useAuth } from '@contexts/AuthContext';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cnfPassword, setCnfPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [cnfShowPassword, setCnfShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [cnfPasswordError, setCnfPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');

  const { signupWithEmailPassword , loading} = useAuth();
  const router = useRouter();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleRegister = async () => {
    setEmailError('');
    setPasswordError('');
    setCnfPasswordError('');

    // const mobileRegex = /^[6-9]\d{9}$/;

    // if (!mobile) {
    //   setMobileError('Mobile is required');
    //   return;
    // }
    
    // if (!mobileRegex.test(mobile)) {
    //   setMobileError('Enter valid mobile number');
    //   return;
    // }

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
    if (!cnfPassword) {
      setCnfPasswordError('Confirm password is required');
      return;
    }
    if(password != cnfPassword){
      setCnfPasswordError("Password not matched");
      return ;
    }

    const { success ,error} = await signupWithEmailPassword({
      email,
      password,
    });
    if (success) {
      router.push({
        pathname: '/(auth)/check-email',
        params: { email }
      });
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
          <View className='flex-row items-center gap-1 justify-center py-2 h-10 mb-10'>
            <Image source={require('@assets/images/logo.png')} className='bg-cover text-center' />
          </View>
            
            <View className="flex-1">
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
                isRequired
              />
              <InputNE
                title='Password'
                isRequired
                type='password'
                value={password}
                placeholder='Enter your password'
                onChangeText={(text: string) => {
                  setPassword(text);
                  setPasswordError('');
                }
                }
                showPassword={showPassword}
                onShowPasswordToggle={() => setShowPassword(!showPassword)}
                error={passwordError}
                postfixIcon
              />
              <InputNE
                title='Confirm Password'
                isRequired
                type='password'
                value={cnfPassword}
                placeholder='Enter your confirm password'
                onChangeText={(text: string) => {
                  setCnfPassword(text);
                  setCnfPasswordError('');
                }
                }
                showPassword={cnfShowPassword}
                onShowPasswordToggle={() => setCnfShowPassword(!cnfShowPassword)}
                error={cnfPasswordError}
                postfixIcon
              />
              <ButtonNE
                loading={loading}
                title='Sign Up'
                onPress={handleRegister}
                className='mt-4'
              />
              <View className="flex-row justify-center items-center">
                <Text className="text-[#666] text-base">Already have an account?  </Text>
                <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                  <Text className="text-[#4A90E2] text-base font-medium">Log in</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}