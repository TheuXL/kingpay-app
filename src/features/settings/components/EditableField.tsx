// src/features/settings/components/EditableField.tsx
import { PencilSimple } from 'phosphor-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../../theme/colors';

type Props = {
  label: string;
  value: string;
  onPress?: () => void;
};

export const EditableField = ({ label, value, onPress }: Props) => {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value || 'Não informado'}</Text>
      </View>
      <TouchableOpacity onPress={onPress}>
        <PencilSimple size={24} color={colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 64,
  },
  label: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
});
