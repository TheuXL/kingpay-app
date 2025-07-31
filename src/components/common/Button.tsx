// src/components/common/Button.tsx
import { ArrowRight, Check } from 'phosphor-react-native';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  icon?: 'arrow' | 'check' | React.ReactNode;
};

export const Button = ({ title, onPress, variant = 'primary', loading = false, disabled = false, icon }: ButtonProps) => {
  const buttonStyle: ViewStyle[] = [styles.base];
  const textStyle: TextStyle[] = [styles.textBase];

  switch (variant) {
    case 'primary':
      buttonStyle.push(styles.primary);
      textStyle.push(styles.textPrimary);
      break;
    case 'secondary':
      buttonStyle.push(styles.secondary);
      textStyle.push(styles.textSecondary);
      break;
    case 'ghost':
      buttonStyle.push(styles.ghost);
      textStyle.push(styles.textGhost);
      break;
    case 'danger':
      buttonStyle.push(styles.danger);
      textStyle.push(styles.textDanger);
      break;
  }
  
  if (disabled || loading) {
    buttonStyle.push(styles.disabled);
  }
  
  const renderIcon = () => {
    if (!icon) return null;
    if (icon === 'arrow') return <ArrowRight size={20} color={colors.white} style={styles.icon} />;
    if (icon === 'check') return <Check size={20} color={colors.white} style={styles.icon} />;
    return icon;
  }

  return (
    <TouchableOpacity onPress={onPress} style={buttonStyle} disabled={disabled || loading}>
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? colors.white : colors.primary} />
      ) : (
        <>
          <Text style={textStyle}>{title}</Text>
          {renderIcon()}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    height: 56,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    marginVertical: 8,
  },
  textBase: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  icon: {
    marginLeft: 8,
  },
  primary: {
    backgroundColor: colors.primaryDark,
  },
  textPrimary: {
    color: colors.white,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  textSecondary: {
    color: colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  textGhost: {
      color: colors.primary,
  },
  danger: {
      backgroundColor: colors.red,
  },
  textDanger: {
      color: colors.white,
  },
  disabled: {
    opacity: 0.6,
  },
});
