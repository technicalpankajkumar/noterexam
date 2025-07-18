import { GluestackUIProvider } from "@components/ui/gluestack-ui-provider";
import { AuthProvider } from "@contexts/AuthContext";
import { Stack } from "expo-router";
import { useState } from "react";
import { StatusBar, Text, View } from "react-native";
import NetworkLogger from 'react-native-network-logger';
import { SafeAreaView } from "react-native-safe-area-context";
import "../global.css";

export default function RootLayout() {
  const [toggle,setToggle] = useState(false)
  return <GluestackUIProvider>
    <AuthProvider>
      <SafeAreaView className='flex-1 relative'>
        <View className="absolute top-16 right-24 bg-blue-300 z-10 w-16 h-16 rounded-full items-center justify-center"><Text onPress={()=>setToggle(prev=>!prev)} className="text-2xl text-white text-center" >Logs</Text>
        </View>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(coordinator)" options={{ headerShown: false }} />
        </Stack>
        <StatusBar barStyle="default" />
        {toggle && 
          <NetworkLogger />
        }
      </SafeAreaView>
    </AuthProvider>
  </GluestackUIProvider>;
}
