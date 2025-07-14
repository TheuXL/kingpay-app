import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle, useColorScheme } from 'react-native';
import { theme } from '../../theme/theme';

export interface AppButtonProps {
  onPress: () => void;
  title?: string;
  mode?: 'contained' | 'outlined' | 'text';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  color?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

export const AppButton: React.FC<AppButtonProps> = ({
  onPress,
  title,
  mode = 'contained',
  disabled = false,
  loading = false,
  style,
  textStyle,
  color,
  icon,
  fullWidth = false,
  children,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const buttonColor = color || theme.colors.primary;

  const getButtonStyle = () => {
    switch (mode) {
      case 'contained':
        return {
          backgroundColor: disabled ? (isDark ? '#444' : '#ccc') : buttonColor,
          borderColor: 'transparent',
        };
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          borderColor: disabled ? (isDark ? '#444' : '#ccc') : buttonColor,
          borderWidth: 1,
        };
      case 'text':
        return {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
        };
      default:
        return {
          backgroundColor: disabled ? (isDark ? '#444' : '#ccc') : buttonColor,
          borderColor: 'transparent',
        };
    }
  };

  const getTextColor = () => {
    switch (mode) {
      case 'contained':
        return '#fff';
      case 'outlined':
      case 'text':
        return disabled ? (isDark ? '#777' : '#999') : buttonColor;
      default:
        return '#fff';
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyle(),
        fullWidth && styles.fullWidth,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          {children ? (
            typeof children === 'string' ? (
              <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
                {children}
              </Text>
            ) : (
              children
            )
          ) : title ? (
            <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
              {title}
            </Text>
          ) : null}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 120,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  iconContainer: {
    marginRight: 8,
  },
}); 