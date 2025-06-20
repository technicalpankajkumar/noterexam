import { useAuth } from '@contexts/AuthContext';
import {
  Box,
  Button,
  ButtonText,
  HStack,
  Icon,
  Input,
  InputField,
  Text,
  VStack,
} from '@gluestack-ui/themed';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import {
  Alert,
  NativeSyntheticEvent,
  TextInput,
  TextInputKeyPressEventData,
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
    <Box className="flex-1 bg-white px-6 pt-28">
      {/* Back button */}
      <Box className="absolute top-16 left-5 z-10">
        <Button variant="link" action="secondary" onPress={() => router.back()}>
          <Icon as={ChevronLeft} size="lg" color="$textDark900" />
        </Button>
      </Box>

      {/* Content */}
      <VStack className="flex-1 items-center space-y-6">
        <Text className="text-[30px] font-bold text-zinc-800">Check your email</Text>
        <Text className="text-base text-zinc-500 text-center">
          We sent a verification link to sarah@cruz.com
        </Text>

        {/* OTP Input */}
        <HStack className="justify-between w-full mt-6 mb-10 space-x-3">
          {code.map((digit, index) => (
            <Input
              key={index}
              variant="outline"
              size="lg"
              className="w-12 h-14 rounded-lg border border-zinc-300 text-center text-xl font-bold"
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
        </HStack>

        {/* Verify Button */}
        <Button
          className="w-full py-4 rounded-lg bg-[#4A90E2] mb-6"
          isDisabled={loading}
          onPress={handleVerify}
        >
          {loading ? (
            <ButtonText className="text-white">Loading...</ButtonText>
          ) : (
            <ButtonText className="text-white font-semibold">Verify email</ButtonText>
          )}
        </Button>

        {/* Resend link */}
        <HStack className="items-center">
          <Text className="text-sm text-zinc-500">Didn't receive the email? </Text>
          <Button variant="link" onPress={() => {}}>
            <ButtonText className="text-[#4A90E2] font-medium text-sm">Click to resend</ButtonText>
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
}
