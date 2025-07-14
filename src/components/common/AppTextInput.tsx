import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  useColorScheme
} from 'react-native';
import { customTheme } from '../../theme/theme';

export interface AppTextInputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  secureTextEntry?: boolean;
  containerStyle?: any;
  labelStyle?: any;
  left?: (props: any) => React.ReactNode; // Adicionado para compatibilidade
}

interface IconProps {
  name: string;
  color?: string;
  size?: number;
}

// Extendendo o tipo para incluir o subcomponente Icon
export interface AppTextInputComponent extends React.FC<AppTextInputProps> {
  Icon: React.FC<IconProps>;
}

// Create the base component
const BaseAppTextInput = React.forwardRef<TextInput, AppTextInputProps>(({
  label,
  error,
  leftIcon,
  rightIcon,
  secureTextEntry = false,
  containerStyle,
  labelStyle,
  style,
  left,
  ...rest
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Use either leftIcon ou left prop
  const finalLeftIcon = leftIcon || (left && left({}));

  const getBorderColor = () => {
    if (error) return customTheme.colors.danger;
    if (isFocused) return customTheme.colors.primary;
    return isDark ? customTheme.colors.border.dark : customTheme.colors.border.light;
  };

  const getBackgroundColor = () => {
    return isDark ? '#1E1E1E' : '#F9F9F9';
  };

  const getTextColor = () => {
    return isDark ? customTheme.colors.text.primary.dark : customTheme.colors.text.primary.light;
  };

  const getLabelColor = () => {
    if (error) return customTheme.colors.danger;
    if (isFocused) return customTheme.colors.primary;
    return isDark ? customTheme.colors.text.secondary.dark : customTheme.colors.text.secondary.light;
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const passwordIcon = isPasswordVisible ? '👁️' : '👁️‍🗨️';

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[
          styles.label, 
          { color: getLabelColor() },
          labelStyle
        ]}>
          {label}
        </Text>
      )}
      
      <View style={[
        styles.inputContainer,
        {
          borderColor: getBorderColor(),
          backgroundColor: getBackgroundColor(),
        },
      ]}>
        {finalLeftIcon && <View style={styles.leftIcon}>{finalLeftIcon}</View>}
        
        <TextInput
          ref={ref}
          style={[
            styles.input,
            {
              color: getTextColor(),
              paddingLeft: finalLeftIcon ? 0 : customTheme.spacing.md,
              paddingRight: (rightIcon || secureTextEntry) ? 0 : customTheme.spacing.md,
            },
            style,
          ]}
          placeholderTextColor={isDark ? '#666' : '#999'}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          {...rest}
        />
        
        {secureTextEntry && (
          <TouchableOpacity
            style={styles.rightIcon}
            onPress={togglePasswordVisibility}
          >
            <Text style={{ fontSize: 18 }}>{passwordIcon}</Text>
          </TouchableOpacity>
        )}
        
        {rightIcon && !secureTextEntry && (
          <View style={styles.rightIcon}>{rightIcon}</View>
        )}
      </View>
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
});

// Create the final component with Icon property
export const AppTextInput = BaseAppTextInput as unknown as AppTextInputComponent;

// Add the Icon component as a property
AppTextInput.Icon = ({ name, color, size = 24 }: IconProps) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const iconColor = color || (isDark ? customTheme.colors.text.primary.dark : customTheme.colors.text.primary.light);
  
  // Usar "as any" para resolver o problema de tipagem do nome do ícone
  return <MaterialCommunityIcons name={name as any} size={size} color={iconColor} />;
};

const styles = StyleSheet.create({
  container: {
    marginBottom: customTheme.spacing.md,
    width: '100%',
  },
  label: {
    fontSize: customTheme.fontSizes.sm,
    marginBottom: customTheme.spacing.xs,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: customTheme.borderRadius.medium,
    overflow: 'hidden',
    minHeight: 48,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: customTheme.fontSizes.md,
  },
  leftIcon: {
    paddingLeft: customTheme.spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightIcon: {
    paddingRight: customTheme.spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: customTheme.fontSizes.xs,
    color: customTheme.colors.danger,
    marginTop: customTheme.spacing.xs,
  },
}); 