import {
  View,
  TextInput,
  Button,
  type TextInputProps,
  StyleSheet,
  Keyboard,
} from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedTextInputProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
  handleInputChange: (input: string) => void;
  text: string;
  type: string;
  placeholder: string;
};

export function ThemedTextInput({
  lightColor,
  darkColor,
  handleInputChange,
  text,
  placeholder,
  type = "input",
  ...otherProps
}: ThemedTextInputProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <View>
      <TextInput
      // change style to input or subjectInput based on type
        style={[{ color }, type === "subjectInput"? styles.subjectInput: styles.input  , { borderColor: color }]}
        onChangeText={handleInputChange}
        value={text}
        placeholder={placeholder}
        placeholderTextColor={color}
        onSubmitEditing={Keyboard.dismiss}
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
  },
  subjectInput: {
    borderBottomWidth: 1,
    borderStyle: "dashed",
    fontSize: 30,
    paddingBottom: 5,
  

  },
});
