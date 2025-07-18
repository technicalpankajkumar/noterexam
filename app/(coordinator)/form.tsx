import ButtonNE from "@components/custom-ui/ButtonNE";
import InputNE from "@components/custom-ui/InputNE";
import TextAreaNE from "@components/custom-ui/TextAreaNE";
import { Header } from "@components/layout-partials/Header";
import { useAuth } from "@contexts/AuthContext";
import { Clock } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Image, ScrollView, Text, View } from "react-native";

import ReviewImage from '@assets/images/connect_you.png';

const CoordinatorForm = () => {
  const {user} = useAuth()
  const { control, handleSubmit, formState: { errors }, watch, reset, setValue } = useForm();
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data: any) => {
    setLoading(true)
    try {
      //   await updateProfile(data)
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=>{
      setValue('name',user?.name);
      setValue('email',user?.email);
      setValue('mobile',user?.mobile);
  },[user])

  return (<>
    <View className="flex-1 bg-white">
      <Header backButton />
      {user?.become ? <View className="flex-1 items-center justify-center">
        <Image
         source={ReviewImage}
         resizeMode="cover"
         className="w-64 h-64 md:w-72 md:h-72"
        />
        <Text className="text-xl text-blue-800 font-bold text-center">Wait for admin approval</Text>
        <View className="flex-row gap-2 mt-2  items-center justify-center">
          <Clock color={'#111827'}/>
          <Text className="text-lg text-gray-900 font-bold">Max 48 Hour</Text>
        </View>
       </View> : 
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
          <Controller
            name="name"
            control={control}
            rules={{ required: 'Name is required' }}
            render={({ field: { onChange, value } }) => (
              <InputNE
                placeholder="Enter your name"
                type="text"
                value={value}
                onChangeText={onChange}
                title="Name"
                isRequired={true}
                error={typeof errors?.title?.message === 'string' ? errors.title.message : undefined}
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            rules={{ required: 'Email ID is required' }}
            render={({ field: { onChange, value } }) => (
              <InputNE
                placeholder="Enter your email"
                type="text"
                value={value}
                onChangeText={onChange}
                title="Email"
                isRequired={true}
                disabled
                error={typeof errors?.title?.message === 'string' ? errors.title.message : undefined}
              />
            )}
          />
          <Controller
            name="mobile"
            control={control}
            rules={{ required: 'Mobile is required' }}
            render={({ field: { onChange, value } }) => (
              <InputNE
                placeholder="Enter your mobile"
                type="text"
                value={value}
                onChangeText={onChange}
                title="Mobile"
                isRequired={true}
                error={typeof errors?.title?.message === 'string' ? errors.title.message : undefined}
              />
            )}
          />
          <Controller
            name="description"
            control={control}
            rules={{ required: 'Description is required' }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextAreaNE onChange={onChange} isRequired error={typeof error?.message === 'string' ? error.message : undefined} value={value} />
            )}
          />

          <ButtonNE
            onPress={handleSubmit(onSubmit)}
            loading={false}
            title="Submit"
            className="mt-2"
          />
        </View>
      </ScrollView>}
    </View>
  </>)
}

export default CoordinatorForm