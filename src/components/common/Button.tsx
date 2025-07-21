import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  primary?: boolean;
  loading?: boolean;
  disabled?: boolean;
  style?: object;
  textStyle?: object;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  primary = true,
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        primary ? styles.primaryButton : styles.secondaryButton,
        disabled || loading ? styles.disabledButton : {},
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={primary ? 'white' : '#0052cc'} />
      ) : (
        <Text
          style={[
            styles.buttonText,
            primary ? styles.primaryText : styles.secondaryText,
            disabled ? styles.disabledText : {},
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    width: '100%',
    marginVertical: 8,
  },
  primaryButton: {
    backgroundColor: '#0052cc',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#0052cc',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
    borderColor: '#cccccc',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryText: {
    color: 'white',
  },
  secondaryText: {
    color: '#0052cc',
  },
  disabledText: {
    color: '#666666',
  },
}); 