// src/features/settings/components/SettingsMenuItem.tsx
import { CaretRight } from 'phosphor-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../../theme/colors';

type Props = {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
};

export const SettingsMenuItem = ({ icon, label, onPress }: Props) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.leftContainer}>
        <View style={styles.iconContainer}>{icon}</View>
        <Text style={styles.label}>{label}</Text>
      </View>
      <CaretRight size={20} color={colors.primary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.iconBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
});
