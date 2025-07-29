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

export default function ForgetPasswordScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');

    const { resetPasswordWithEmail, loading, user } = useAuth();

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };


    const handleResetPassword = async () => {
        setEmailError('');

        if (!email) {
            setEmailError('Email is required');
            return;
        }

        if (!validateEmail(email)) {
            setEmailError('Please enter a valid email');
            return;
        }

        let { success,error } = await resetPasswordWithEmail(email);
        if (error) {
            Alert.alert('Error sending reset email:', error);
        } else {
            Alert.alert('Password reset email sent successfully.');
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
                        <View className='flex-row items-center gap-1 justify-center py-2 h-10 mb-10'>
                            <Image source={require('@assets/images/logo.png')} className='bg-cover text-center' />
                        </View>

                        <View className="flex-1">
                            <InputNE
                                isRequired
                                title='Email'
                                placeholder='Enter your email'
                                value={email}
                                onChangeText={(text) => {
                                    setEmail(text);
                                    setEmailError('');
                                }}
                                keyboardType='email-address'
                                error={emailError}
                            />

                            <View className="flex-row justify-end items-center mb-3">
                                <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
                                    <Text className="text-base text-blue-800 font-medium">I remember my password</Text>
                                </TouchableOpacity>
                            </View>
                            <ButtonNE
                                onPress={handleResetPassword}
                                loading={loading}
                                title='Forgot Password'
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