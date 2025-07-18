import { Header } from "@components/layout-partials/Header";
import { useState } from "react";
import { Image, ScrollView, View } from "react-native";

const CoordinatorEarning=()=>{
    const [loading,setLoading] = useState(false)
    
    return (<>
    <View className="flex-1 bg-white">
          <Header backButton />
          <ScrollView className="flex-1 mt-14" showsVerticalScrollIndicator={false}>
            <View className="bg-white py-4 items-center mb-1">
              <View className="relative mb-1">
                <Image
                  source={{ uri: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg' }}
                  className="w-24 h-24 rounded-full"
                />
              </View>
            </View>
            <View className="w-full px-4">
             
            </View>
          </ScrollView>
        </View>
    </>)
}

export default CoordinatorEarning