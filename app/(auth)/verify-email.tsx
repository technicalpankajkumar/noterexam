import ButtonNE from '@components/custom-ui/ButtonNE';
import { Button, ButtonText } from '@components/ui/button';
import { Input, InputField } from '@components/ui/input';
import { useAuth } from '@contexts/AuthContext';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Alert,
  NativeSyntheticEvent,
  Text,
  TextInput,
  TextInputKeyPressEventData,
  View,
} from 'react-native';

export default function VerifyEmailScreen() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<TextInput[]>([]);
  const { verifyEmail } = useAuth();
  const router = useRouter();

  const handleCodeChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const verificationCode = code.join('');
    if (verificationCode.length !== 6) {
      Alert.alert('Error', 'Please enter the complete verification code');
      return;
    }
    setLoading(true);
    const success = await verifyEmail(verificationCode);
    setLoading(false);
    if (success) {
      router.replace('/(tabs)');
    } else {
      Alert.alert('Error', 'Invalid verification code');
    }
  };

  return (
    <View className="flex-1 bg-white px-6 pt-28">
      {/* Content */}
      <View className="flex-1 ">
        <Text className="text-3xl font-bold text-zinc-800 text-center">Check your email</Text>
        <Text className="text-base text-zinc-500 text-center">
          We sent a verification link to your@gmail.com
        </Text>

        {/* OTP Input */}
        <View className="justify-evenly w-full mt-6 mb-6 flex-row">
          {code.map((digit, index) => (
            <Input
              key={index}
              variant="outline"
              size="lg"
              className="w-12 h-14 rounded-lg border border-blue-800 text-center text-xl font-bold"
            >
              <InputField
                ref={(ref) => {
                  if (ref) inputRefs.current[index] = ref;
                }}
                maxLength={1}
                keyboardType="numeric"
                value={digit}
                onChangeText={(text) => handleCodeChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                textAlign="center"
              />
            </Input>
          ))}
        </View>
        <ButtonNE
          className='w-full text-center'
          loading={loading}
          onPress={handleVerify}
          title='Verify Email'
        />
        {/* Resend link */}
        <View className="items-center">
          <Text className="text-sm text-zinc-500">Didn't receive the email? </Text>
          <Button variant="link" onPress={() => { }}>
            <ButtonText className="text-blue-800 font-medium text-sm">Click to resend</ButtonText>
          </Button>
        </View>
      </View>
    </View>
  );
}
