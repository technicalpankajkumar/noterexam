import { Input, InputField, InputIcon, InputSlot } from "@components/ui/input";
import { Eye, EyeOff } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";


type PasswordInputNEProps = {
    showPassword: boolean;
    value: string;
    onChangeText: (text: string) => void;
    onShowPasswordToggle: () => void;
    passwordError?: string;
};

export default function PasswordInputNE({
    showPassword,
    value,
    onChangeText,
    onShowPasswordToggle,
    passwordError
}: PasswordInputNEProps) {

    return(
        <View className="mb-5">
        <Text className="text-sm font-medium text-[#333] mb-1.5">Password</Text>
         <View className="relative">

                  <Input variant="outline" size="md">
                    <InputField
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      secureTextEntry={!showPassword}
                      value={value}
                      onChangeText={onChangeText}
                    />
                    <InputSlot className='pe-2'>
                      <Pressable onPress={onShowPasswordToggle}>
                        <InputIcon
                          as={showPassword ? Eye : EyeOff}
                        />
                      </Pressable>
                    </InputSlot>
                  </Input>
                </View>
                {passwordError ? (
                  <Text className="text-red-600 text-xs mt-1">{passwordError}</Text>
                ) : null}
              </View>
    )

}