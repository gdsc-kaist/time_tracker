// Import necessary libraries
import React from "react";
import { useColorScheme, ViewStyle, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Define props for ThemedButton
interface ThemedButtonProps {
  onPress: (...args: any[]) => void;
  style?: ViewStyle;
  iconName: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  iconSize?: number;
}

// ThemedButton component
const ThemedButton: React.FC<ThemedButtonProps> = ({
  onPress,
  style,
  iconName = "play-circle-outline",
  iconColor = "black",
  iconSize = 24,
}) => {
  const scheme = useColorScheme(); // Detects the color scheme of the device

  // Define styles for light and dark themes

  // Determine icon color based on theme or use custom color if provided
  const actualIconColor = iconColor || (scheme === "dark" ? "#FFF" : "#333");

  // Render the button using TouchableOpacity for better styling flexibility
  return (
    <Pressable style={style} onPress={onPress}>
      <Ionicons name={iconName} size={iconSize} color={actualIconColor} />
    </Pressable>
  );
};

export default ThemedButton;
