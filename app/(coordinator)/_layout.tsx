import { Stack } from 'expo-router';

export default function CoordinatorLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="form" />
      <Stack.Screen name="earning" />
      <Stack.Screen name="history" />
    </Stack>
  );
}