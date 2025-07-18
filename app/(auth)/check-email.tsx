import { Header } from "@components/layout-partials/Header";
import { MailCheck } from "lucide-react-native";
import { Image, Text, View } from "react-native";

import checkImage from '@assets/images/check-email.png';
import { router } from "expo-router";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { useEffect } from "react";

const CheckEmail = () => {
 const { email } = useLocalSearchParams();
  useEffect(()=>{
    const timer = setTimeout(()=>{
    router.push('/(auth)/login')
   },3000)
   return ()=>{
    clearTimeout(timer)
   }
  },[])

  return (<>
    <View className="flex-1 bg-white">
      <Header backButton bellIcon={false} />
      <View className="flex-1 items-center top-20">
        <Image
         source={checkImage}
         resizeMode="cover"
         className="w-64 h-64 md:w-72 md:h-72"
        />
        <Text className="text-xl text-blue-800 font-bold text-center">Check your email for Verification </Text>
        <View className="flex-row gap-2 mt-2  items-center justify-center">
          <MailCheck color={'#111827'}/>
          <Text className="text-lg text-gray-700 font-bold">{email ?? "Email@gmail.com"}</Text>
        </View>
       </View> 
    </View>
  </>)
}

export default CheckEmail