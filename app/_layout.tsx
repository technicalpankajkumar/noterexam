import { GluestackUIProvider } from "@components/ui/gluestack-ui-provider";
import { AuthProvider } from "@contexts/AuthContext";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import "../global.css";

export default function RootLayout() {
  return <GluestackUIProvider>
    <AuthProvider>
    <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar barStyle="default" />
      </AuthProvider>
    </GluestackUIProvider>;
}
