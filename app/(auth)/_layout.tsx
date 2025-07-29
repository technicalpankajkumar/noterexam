import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="check-email" />
      <Stack.Screen name="verify-email" />
      <Stack.Screen name="forgot-password"/>
      <Stack.Screen name="reset-password" />
    </Stack>
  );
}