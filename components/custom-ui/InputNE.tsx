import { Input, InputField, InputIcon, InputSlot } from "@components/ui/input";
import { Search } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

import type { KeyboardTypeOptions } from "react-native";

type InputNEProps = {
  value: string;
  placeholder?: string;
  type?: 'text';
  disabled?: boolean;
  error?: string;
  onChangeText?: (text: string) => void;
  keyboardType?: KeyboardTypeOptions;
  title?: string;
  size?: 'lg' | 'sm' | 'md' | 'xl';
  searchBox?: boolean;
 };

export default function InputNE({ 
  title,
  value, 
  disabled = false, 
  type = 'text',
  error,
  placeholder,
  onChangeText,
  keyboardType = 'default',
  size= "md",
  searchBox = false
}: InputNEProps) {
  return (
   <View className="mb-3">
                <Text  className="text-sm font-medium text-[#333] mb-1.5">{title}</Text>
                <Input variant="outline" size={size} isDisabled={disabled}>
                {searchBox && <InputSlot className="ps-2">
                <Pressable >
                  <InputIcon
                   as={Search}
                  />
                </Pressable>
                </InputSlot>}
                  <InputField
                    placeholder={placeholder}
                    value={value}
                    type={type}
                    onChangeText={onChangeText}
                    keyboardType={keyboardType}
                    autoCapitalize={'none'}
                    
                  />
                </Input>
                {error ? (
                  <Text className="text-red-600 text-xs mt-1">{error}</Text>
                ) : null}
              </View>
  );
}