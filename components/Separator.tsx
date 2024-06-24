import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedView } from './ThemedView';
import { View, StyleSheet } from 'react-native';

type SeparatorProps = {
    height?: number;
    lightColor?: string;
    darkColor?: string;
    color?: string;
    marginVertical?: number;
    useDefaultColor?: boolean;
};


const Separator: React.FC<SeparatorProps> = ({
    height = 1,
    lightColor,
    darkColor,
    color,
    marginVertical = 10,
    useDefaultColor = true,
}) => (
    <ThemedView
        style={[
            styles.separator,
            {
                height,
                marginVertical,
                backgroundColor: useDefaultColor
                    ? useThemeColor({ light: lightColor, dark: darkColor }, 'text')
                    : color,
            },
        ]}
    />
);

const styles = StyleSheet.create({
    separator: {
        width: '100%', // Ensure the separator spans the full width of its container
    },
});

export default Separator;