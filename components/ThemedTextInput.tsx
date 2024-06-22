import {
  View,
  TextInput,
  Button,
  type TextInputProps,
  StyleSheet,
} from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedTextInputProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
  handleInputChange: (input:string) => void;
  text: string;
    placeholder: string;
};

export function ThemedTextInput({
  style,
  lightColor,
  darkColor,
  handleInputChange,
  text,
  placeholder,
  ...otherProps
}: ThemedTextInputProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <View>
      <TextInput
        style={[{ color },styles.input, { borderColor: color }, style]}
        onChangeText={handleInputChange}
        value={text}
        placeholder={placeholder}
        placeholderTextColor={color}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  }
});
