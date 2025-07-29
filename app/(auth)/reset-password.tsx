import ButtonNE from '@components/custom-ui/ButtonNE';
import InputNE from '@components/custom-ui/InputNE';
import { supabase } from '@lib/supabase';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [cnfPassword, setCnfPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [cnfShowPassword, setCnfShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [cnfPasswordError, setCnfPasswordError] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const getTokenFromURL = async () => {
      const url = await Linking.getInitialURL();
      console.log('Initial URL:', url);

      if (url) {
        const urlObj = new URL(url);
        const hashParams = new URLSearchParams(urlObj.hash.substring(1)); // remove `#`

        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');

        console.log('Access:', accessToken);
        console.log('Refresh:', refreshToken);

        if (accessToken && refreshToken) {
          setToken(accessToken)
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.error('❌ setSession error:', error.message);
          } else {
            console.log('✅ Session restored:', data.session?.user);
          }
        }
      }

      // Check session
      const { data: sessionData } = await supabase.auth.getSession();
      console.log('🔐 Current session:', sessionData.session);
    };

    getTokenFromURL();
  }, []);


  let validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleReset = async () => {
    setPasswordError('');
    setCnfPasswordError('');

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
    if (password != cnfPassword) {
      setCnfPasswordError("Password not matched");
      return;
    }
    setLoading(true);

    const { data, error } = await supabase.auth.updateUser({ password });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Password updated successfully!');
      router.push('/(auth)/login');
    }
    setLoading(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>

          <View className="flex-1 px-6 pt-32  justify-center ">
            <View className='flex-row items-center gap-1 justify-center py-2 h-10 mb-10'>
              <Image source={require('@assets/images/logo.png')} className='bg-cover text-center' />
            </View>

            <View className="flex-1">
              <InputNE
                title='New Password'
                isRequired
                type='password'
                value={password}
                placeholder='Enter your new password'
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
              {message ? <Text className='text-red-600'>{message}</Text> : null}
              <View className="flex-row justify-end items-center mb-3">
                <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
                  <Text className="text-base text-blue-800 font-medium">I remember my password</Text>
                </TouchableOpacity>
              </View>
              <ButtonNE
                onPress={handleReset}
                loading={loading}
                title='Update Password'
                disabled={!token}
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
