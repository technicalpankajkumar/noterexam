import { FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlHelper, FormControlHelperText, FormControlLabel, FormControlLabelText } from "@components/ui/form-control";
import { Input, InputField, InputIcon, InputSlot } from "@components/ui/input";
import { AlertCircleIcon, Eye, EyeOff, Search } from "lucide-react-native";
import React from "react";
import { Pressable, Text, View } from "react-native";

import type { KeyboardTypeOptions } from "react-native";

type InputNEProps = {
  value: string;
  placeholder?: string;
  type?: 'text' | 'password';
  disabled?: boolean;
  error?: string;
  errorMsg?: string;
  onChangeText?: (text: string) => void;
  keyboardType?: KeyboardTypeOptions;
  title?: string;
  size?: 'lg' | 'sm' | 'md' | 'xl';
  prefixIcon?: boolean;
  postfixIcon?: boolean;
  isRequired?: boolean;
  onShowPasswordToggle?: () => void,
  showPassword?: boolean;
  prefixIconName?: React.ReactNode
  postfixIconName?: React.ReactNode
};

export default function InputNE({
  title,
  value,
  disabled = false,
  type = 'text',
  error = '',
  errorMsg,
  placeholder,
  onChangeText,
  keyboardType = 'default',
  size = "md",
  prefixIcon = false,
  prefixIconName,
  postfixIcon = false,
  postfixIconName,
  isRequired = false,
  onShowPasswordToggle,
  showPassword = false
}: InputNEProps) {

  return (
    <View className="mb-2">
      <FormControl
        isInvalid={!!error}
        size="sm"
        isDisabled={false}
        isReadOnly={false}
        isRequired={false}
        
      >
        <FormControlLabel>
          <FormControlLabelText >
            {title} {isRequired && <Text className="text-red-700">*</Text>}
          </FormControlLabelText>
        </FormControlLabel>
        <Input variant="outline" size={size} isDisabled={disabled}>
          {prefixIcon && <InputSlot className="ps-2">
            <Pressable >
              {
                prefixIconName ||
                <InputIcon
                  as={Search}
                />
              }

            </Pressable>
          </InputSlot>}
          <InputField
            placeholder={placeholder}
            value={value}
            type={type}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            autoCapitalize={'none'}
            secureTextEntry={true}
          />
          {postfixIcon && <InputSlot className="pe-2">
            {
              type == 'password' ? <Pressable onPress={() => onShowPasswordToggle?.()}>
                <InputIcon
                  as={showPassword ? Eye : EyeOff}
                />
              </Pressable>
                :
                postfixIconName ||
                <InputIcon
                  as={Eye}
                />
            }
          </InputSlot>}
        </Input>
        {errorMsg && <FormControlHelper>
          <FormControlHelperText>
            {errorMsg}
          </FormControlHelperText>
        </FormControlHelper>}
        <FormControlError>
          <FormControlErrorIcon as={AlertCircleIcon} />
          <FormControlErrorText>
            {error}
          </FormControlErrorText>
        </FormControlError>
      </FormControl>
    </View>
  );
}