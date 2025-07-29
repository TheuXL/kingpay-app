import { colors } from '@/theme/colors';
import { spacing, radius } from '@/theme/spacing';
import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  Modal, 
  FlatList,
  Dimensions 
} from 'react-native';

interface PeriodOption {
  label: string;
  value: number;
  key: string;
}

interface PeriodDropdownProps {
  onPeriodChange: (period: PeriodOption) => void;
  selectedPeriod?: PeriodOption;
}

const periodOptions: PeriodOption[] = [
  { label: '7 dias', value: 7, key: '7d' },
  { label: '15 dias', value: 15, key: '15d' },
  { label: '30 dias', value: 30, key: '30d' },
  { label: '60 dias', value: 60, key: '60d' },
  { label: '90 dias', value: 90, key: '90d' },
];

const PeriodDropdown: React.FC<PeriodDropdownProps> = ({ 
  onPeriodChange, 
  selectedPeriod = periodOptions[2] // Default: 30 dias
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option: PeriodOption) => {
    onPeriodChange(option);
    setIsOpen(false);
  };

  return (
    <>
      <TouchableOpacity 
        style={styles.dropdown}
        onPress={() => setIsOpen(true)}
      >
        <Text style={styles.selectedText}>{selectedPeriod.label}</Text>
        <Feather 
          name="chevron-down" 
          size={16} 
          color={colors.textSecondary}
        />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity 
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={periodOptions}
              keyExtractor={(item) => item.key}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.option,
                    item.key === selectedPeriod.key && styles.selectedOption
                  ]}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={[
                    styles.optionText,
                    item.key === selectedPeriod.key && styles.selectedOptionText
                  ]}>
                    {item.label}
                  </Text>
                  {item.key === selectedPeriod.key && (
                    <Feather name="check" size={16} color={colors.primary} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  selectedText: {
    fontSize: 12,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    marginHorizontal: spacing.xl,
    maxHeight: 300,
    minWidth: 150,
    ...{
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
    }
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  selectedOption: {
    backgroundColor: colors.primaryLight,
  },
  optionText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  selectedOptionText: {
    color: colors.primary,
    fontWeight: '600',
  },
});

export default PeriodDropdown;
