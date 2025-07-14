import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { TextInput, Button, Text, HelperText, Card, Divider } from 'react-native-paper';
import { CompanyTaxes, UpdateCompanyTaxesPayload } from '../../types/company';

interface CompanyTaxesFormProps {
  initialData: CompanyTaxes;
  onSubmit: (data: UpdateCompanyTaxesPayload) => void;
  isLoading: boolean;
}

export const CompanyTaxesForm: React.FC<CompanyTaxesFormProps> = ({
  initialData,
  onSubmit,
  isLoading,
}) => {
  const [formData, setFormData] = useState<UpdateCompanyTaxesPayload>({
    pix_fee_percentage: initialData.pix_fee_percentage,
    pix_fee_fixed: initialData.pix_fee_fixed,
    boleto_fee_percentage: initialData.boleto_fee_percentage,
    boleto_fee_fixed: initialData.boleto_fee_fixed,
    card_fee_percentage: initialData.card_fee_percentage,
    card_fee_fixed: initialData.card_fee_fixed,
    mdr_1x: initialData.mdr_1x,
    mdr_2x: initialData.mdr_2x,
    mdr_3x: initialData.mdr_3x,
    mdr_4x: initialData.mdr_4x,
    mdr_5x: initialData.mdr_5x,
    mdr_6x: initialData.mdr_6x,
    mdr_7x: initialData.mdr_7x,
    mdr_8x: initialData.mdr_8x,
    mdr_9x: initialData.mdr_9x,
    mdr_10x: initialData.mdr_10x,
    mdr_11x: initialData.mdr_11x,
    mdr_12x: initialData.mdr_12x,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof UpdateCompanyTaxesPayload, value: string) => {
    const numValue = parseFloat(value);
    
    if (value === '' || isNaN(numValue)) {
      setFormData((prev) => ({ ...prev, [field]: undefined }));
      return;
    }

    // Validate numeric fields
    if (numValue < 0) {
      setErrors((prev) => ({ ...prev, [field]: 'O valor não pode ser negativo' }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
    }

    setFormData((prev) => ({ ...prev, [field]: numValue }));
  };

  const validateForm = (): boolean => {
    // Check if there are any validation errors
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Taxas PIX" />
        <Card.Content>
          <View style={styles.row}>
            <TextInput
              label="Taxa Percentual (%)"
              value={formData.pix_fee_percentage?.toString() || ''}
              onChangeText={(value) => handleChange('pix_fee_percentage', value)}
              style={[styles.input, styles.halfInput]}
              keyboardType="numeric"
              error={!!errors.pix_fee_percentage}
            />
            <TextInput
              label="Taxa Fixa (R$)"
              value={formData.pix_fee_fixed?.toString() || ''}
              onChangeText={(value) => handleChange('pix_fee_fixed', value)}
              style={[styles.input, styles.halfInput]}
              keyboardType="numeric"
              error={!!errors.pix_fee_fixed}
            />
          </View>
          {errors.pix_fee_percentage && <HelperText type="error">{errors.pix_fee_percentage}</HelperText>}
          {errors.pix_fee_fixed && <HelperText type="error">{errors.pix_fee_fixed}</HelperText>}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Taxas Boleto" />
        <Card.Content>
          <View style={styles.row}>
            <TextInput
              label="Taxa Percentual (%)"
              value={formData.boleto_fee_percentage?.toString() || ''}
              onChangeText={(value) => handleChange('boleto_fee_percentage', value)}
              style={[styles.input, styles.halfInput]}
              keyboardType="numeric"
              error={!!errors.boleto_fee_percentage}
            />
            <TextInput
              label="Taxa Fixa (R$)"
              value={formData.boleto_fee_fixed?.toString() || ''}
              onChangeText={(value) => handleChange('boleto_fee_fixed', value)}
              style={[styles.input, styles.halfInput]}
              keyboardType="numeric"
              error={!!errors.boleto_fee_fixed}
            />
          </View>
          {errors.boleto_fee_percentage && <HelperText type="error">{errors.boleto_fee_percentage}</HelperText>}
          {errors.boleto_fee_fixed && <HelperText type="error">{errors.boleto_fee_fixed}</HelperText>}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Taxas Cartão" />
        <Card.Content>
          <View style={styles.row}>
            <TextInput
              label="Taxa Percentual (%)"
              value={formData.card_fee_percentage?.toString() || ''}
              onChangeText={(value) => handleChange('card_fee_percentage', value)}
              style={[styles.input, styles.halfInput]}
              keyboardType="numeric"
              error={!!errors.card_fee_percentage}
            />
            <TextInput
              label="Taxa Fixa (R$)"
              value={formData.card_fee_fixed?.toString() || ''}
              onChangeText={(value) => handleChange('card_fee_fixed', value)}
              style={[styles.input, styles.halfInput]}
              keyboardType="numeric"
              error={!!errors.card_fee_fixed}
            />
          </View>
          {errors.card_fee_percentage && <HelperText type="error">{errors.card_fee_percentage}</HelperText>}
          {errors.card_fee_fixed && <HelperText type="error">{errors.card_fee_fixed}</HelperText>}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Taxas MDR (Cartão de Crédito)" />
        <Card.Content>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Taxas por parcela (%)
          </Text>
          <Divider style={styles.divider} />
          
          <View style={styles.mdrGrid}>
            {[...Array(12)].map((_, idx) => {
              const installment = idx + 1;
              const fieldName = `mdr_${installment}x` as keyof UpdateCompanyTaxesPayload;
              
              return (
                <View key={fieldName} style={styles.mdrItem}>
                  <TextInput
                    label={`${installment}x`}
                    value={formData[fieldName]?.toString() || ''}
                    onChangeText={(value) => handleChange(fieldName, value)}
                    style={styles.mdrInput}
                    keyboardType="numeric"
                    dense
                    error={!!errors[fieldName as string]}
                  />
                  {errors[fieldName as string] && (
                    <HelperText type="error">{errors[fieldName as string]}</HelperText>
                  )}
                </View>
              );
            })}
          </View>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={handleSubmit}
        style={styles.submitButton}
        loading={isLoading}
        disabled={isLoading || Object.keys(errors).length > 0}
      >
        Salvar Alterações
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  subtitle: {
    marginBottom: 8,
  },
  divider: {
    marginBottom: 16,
  },
  mdrGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  mdrItem: {
    width: '30%',
    marginBottom: 12,
  },
  mdrInput: {
    height: 56,
  },
  submitButton: {
    marginTop: 16,
    marginBottom: 32,
  },
}); 