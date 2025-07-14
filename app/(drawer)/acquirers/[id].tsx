import { ScreenLayout } from '@/components/layout/ScreenLayout';
import { useAcquirersStore } from '@/store/acquirersStore';
import { UpdateAcquirerActivePayload, UpdateAcquirerFeePayload } from '@/types/acquirers';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Card, Divider, HelperText, Switch, Text, TextInput } from 'react-native-paper';

export default function AcquirerDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { 
    currentAcquirer, 
    acquirerFees, 
    isLoading, 
    error, 
    fetchAcquirerById, 
    fetchAcquirerFees,
    updateAcquirerActive,
    updateAcquirerFees
  } = useAcquirersStore();

  const [activePayload, setActivePayload] = useState<UpdateAcquirerActivePayload>({
    acquirers_pix: false,
    acquirers_boleto: false,
    acquirers_card: false,
  });

  const [feePayload, setFeePayload] = useState<UpdateAcquirerFeePayload>({});
  const [isEditingFees, setIsEditingFees] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (id) {
      fetchAcquirerById(id);
      fetchAcquirerFees(id);
    }
  }, [id, fetchAcquirerById, fetchAcquirerFees]);

  useEffect(() => {
    if (currentAcquirer) {
      setActivePayload({
        acquirers_pix: currentAcquirer.acquirers_pix,
        acquirers_boleto: currentAcquirer.acquirers_boleto,
        acquirers_card: currentAcquirer.acquirers_card,
      });
    }
  }, [currentAcquirer]);

  useEffect(() => {
    if (acquirerFees.length > 0) {
      const fee = acquirerFees[0];
      setFeePayload({
        mdr_1x_adquirente: fee.mdr_1x_adquirente,
        mdr_2x_adquirente: fee.mdr_2x_adquirente,
        mdr_3x_adquirente: fee.mdr_3x_adquirente,
        mdr_4x_adquirente: fee.mdr_4x_adquirente,
        mdr_5x_adquirente: fee.mdr_5x_adquirente,
        mdr_6x_adquirente: fee.mdr_6x_adquirente,
        mdr_7x_adquirente: fee.mdr_7x_adquirente,
        mdr_8x_adquirente: fee.mdr_8x_adquirente,
        mdr_9x_adquirente: fee.mdr_9x_adquirente,
        mdr_10x_adquirente: fee.mdr_10x_adquirente,
        mdr_11x_adquirente: fee.mdr_11x_adquirente,
        mdr_12x_adquirente: fee.mdr_12x_adquirente,
        pix_fee_percentage: fee.pix_fee_percentage,
        pix_fee_fixed: fee.pix_fee_fixed,
        card_fee_percentage: fee.card_fee_percentage,
        card_fee_fixed: fee.card_fee_fixed,
        fee_type_boleto: fee.fee_type_boleto,
        fee_type_pix: fee.fee_type_pix,
        fee_type_card: fee.fee_type_card,
        boleto_fee_percentage: fee.boleto_fee_percentage,
        boleto_fee_fixed: fee.boleto_fee_fixed,
      });
    }
  }, [acquirerFees]);

  const handleGoBack = () => {
    router.back();
  };

  const handleRefresh = () => {
    if (id) {
      fetchAcquirerById(id);
      fetchAcquirerFees(id);
    }
  };

  const handleTogglePaymentMethod = (method: keyof UpdateAcquirerActivePayload) => {
    setActivePayload((prev: UpdateAcquirerActivePayload) => ({
      ...prev,
      [method]: !prev[method],
    }));
  };

  const handleSaveActiveStatus = async () => {
    if (id) {
      await updateAcquirerActive(id, activePayload);
    }
  };

  const handleFeeChange = (field: string, value: string) => {
    const numValue = parseFloat(value);
    
    if (value === '' || isNaN(numValue)) {
      setFeePayload((prev: UpdateAcquirerFeePayload) => ({ ...prev, [field]: undefined }));
      return;
    }

    // Validate numeric fields
    if (
      field.includes('mdr_') || 
      field.includes('_fee_percentage') || 
      field.includes('_fee_fixed')
    ) {
      if (numValue < 0) {
        setFormErrors((prev: Record<string, string>) => ({ ...prev, [field]: 'O valor não pode ser negativo' }));
      } else {
        setFormErrors((prev: Record<string, string>) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    }

    setFeePayload((prev: UpdateAcquirerFeePayload) => ({ ...prev, [field]: numValue }));
  };

  const handleFeeTypeChange = (field: 'fee_type_boleto' | 'fee_type_pix' | 'fee_type_card', value: string) => {
    setFeePayload((prev: UpdateAcquirerFeePayload) => ({ ...prev, [field]: value }));
  };

  const handleSaveFees = async () => {
    if (id && Object.keys(formErrors).length === 0) {
      await updateAcquirerFees(id, feePayload);
      setIsEditingFees(false);
    }
  };

  if (isLoading && !currentAcquirer) {
    return (
      <ScreenLayout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      </ScreenLayout>
    );
  }

  if (error || !currentAcquirer) {
    return (
      <ScreenLayout>
        <View style={styles.errorContainer}>
          <Text variant="bodyLarge" style={styles.errorText}>
            {error || 'Não foi possível carregar os dados da adquirente.'}
          </Text>
          <Button mode="contained" onPress={handleRefresh} style={styles.retryButton}>
            Tentar Novamente
          </Button>
          <Button mode="outlined" onPress={handleGoBack} style={styles.backButton}>
            Voltar
          </Button>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text variant="headlineMedium">{currentAcquirer.name}</Text>
          <Button mode="outlined" onPress={handleGoBack}>
            Voltar
          </Button>
        </View>

        {currentAcquirer.description && (
          <Text variant="bodyMedium" style={styles.description}>
            {currentAcquirer.description}
          </Text>
        )}

        {/* Payment Methods Section */}
        <Card style={styles.card}>
          <Card.Title title="Métodos de Pagamento" />
          <Card.Content>
            <View style={styles.switchRow}>
              <Text>PIX</Text>
              <Switch
                value={activePayload.acquirers_pix}
                onValueChange={() => handleTogglePaymentMethod('acquirers_pix')}
              />
            </View>
            <View style={styles.switchRow}>
              <Text>Boleto</Text>
              <Switch
                value={activePayload.acquirers_boleto}
                onValueChange={() => handleTogglePaymentMethod('acquirers_boleto')}
              />
            </View>
            <View style={styles.switchRow}>
              <Text>Cartão</Text>
              <Switch
                value={activePayload.acquirers_card}
                onValueChange={() => handleTogglePaymentMethod('acquirers_card')}
              />
            </View>
            <Button 
              mode="contained" 
              onPress={handleSaveActiveStatus} 
              style={styles.saveButton}
              loading={isLoading}
              disabled={isLoading}
            >
              Salvar Alterações
            </Button>
          </Card.Content>
        </Card>

        {/* Fees Section */}
        <Card style={styles.card}>
          <Card.Title 
            title="Taxas" 
            right={(props) => (
              <Button 
                {...props} 
                onPress={() => setIsEditingFees(!isEditingFees)}
              >
                {isEditingFees ? 'Cancelar' : 'Editar'}
              </Button>
            )}
          />
          <Card.Content>
            {isLoading && acquirerFees.length === 0 ? (
              <ActivityIndicator style={styles.feesLoading} />
            ) : acquirerFees.length === 0 ? (
              <Text>Nenhuma taxa configurada.</Text>
            ) : (
              <>
                <Text variant="titleMedium" style={styles.sectionTitle}>Taxas de Cartão (MDR)</Text>
                <View style={styles.feesGrid}>
                  {[...Array(12)].map((_, idx) => {
                    const installment = idx + 1;
                    const fieldName = `mdr_${installment}x_adquirente` as keyof UpdateAcquirerFeePayload;
                    const value = feePayload[fieldName] as number | undefined;
                    
                    return (
                      <View key={fieldName} style={styles.feeItem}>
                        <Text variant="bodySmall">{installment}x</Text>
                        {isEditingFees ? (
                          <>
                            <TextInput
                              mode="outlined"
                              value={value?.toString() || ''}
                              onChangeText={(text) => handleFeeChange(fieldName, text)}
                              keyboardType="numeric"
                              style={styles.feeInput}
                              dense
                              error={!!formErrors[fieldName]}
                            />
                            {formErrors[fieldName] && (
                              <HelperText type="error">{formErrors[fieldName]}</HelperText>
                            )}
                          </>
                        ) : (
                          <Text>{value?.toFixed(2)}%</Text>
                        )}
                      </View>
                    );
                  })}
                </View>

                <Divider style={styles.divider} />

                <Text variant="titleMedium" style={styles.sectionTitle}>Taxas PIX</Text>
                <View style={styles.feeRow}>
                  <Text>Tipo de Taxa:</Text>
                  {isEditingFees ? (
                    <TextInput
                      mode="outlined"
                      value={feePayload.fee_type_pix || ''}
                      onChangeText={(text) => handleFeeTypeChange('fee_type_pix', text)}
                      style={styles.feeTypeInput}
                      dense
                    />
                  ) : (
                    <Text>{acquirerFees[0].fee_type_pix}</Text>
                  )}
                </View>
                <View style={styles.feeRow}>
                  <Text>Percentual:</Text>
                  {isEditingFees ? (
                    <TextInput
                      mode="outlined"
                      value={feePayload.pix_fee_percentage?.toString() || ''}
                      onChangeText={(text) => handleFeeChange('pix_fee_percentage', text)}
                      keyboardType="numeric"
                      style={styles.feeInput}
                      dense
                      error={!!formErrors.pix_fee_percentage}
                    />
                  ) : (
                    <Text>{acquirerFees[0].pix_fee_percentage?.toFixed(2)}%</Text>
                  )}
                </View>
                <View style={styles.feeRow}>
                  <Text>Fixo:</Text>
                  {isEditingFees ? (
                    <TextInput
                      mode="outlined"
                      value={feePayload.pix_fee_fixed?.toString() || ''}
                      onChangeText={(text) => handleFeeChange('pix_fee_fixed', text)}
                      keyboardType="numeric"
                      style={styles.feeInput}
                      dense
                      error={!!formErrors.pix_fee_fixed}
                    />
                  ) : (
                    <Text>R$ {acquirerFees[0].pix_fee_fixed?.toFixed(2)}</Text>
                  )}
                </View>

                <Divider style={styles.divider} />

                <Text variant="titleMedium" style={styles.sectionTitle}>Taxas Boleto</Text>
                <View style={styles.feeRow}>
                  <Text>Tipo de Taxa:</Text>
                  {isEditingFees ? (
                    <TextInput
                      mode="outlined"
                      value={feePayload.fee_type_boleto || ''}
                      onChangeText={(text) => handleFeeTypeChange('fee_type_boleto', text)}
                      style={styles.feeTypeInput}
                      dense
                    />
                  ) : (
                    <Text>{acquirerFees[0].fee_type_boleto}</Text>
                  )}
                </View>
                <View style={styles.feeRow}>
                  <Text>Percentual:</Text>
                  {isEditingFees ? (
                    <TextInput
                      mode="outlined"
                      value={feePayload.boleto_fee_percentage?.toString() || ''}
                      onChangeText={(text) => handleFeeChange('boleto_fee_percentage', text)}
                      keyboardType="numeric"
                      style={styles.feeInput}
                      dense
                      error={!!formErrors.boleto_fee_percentage}
                    />
                  ) : (
                    <Text>{acquirerFees[0].boleto_fee_percentage?.toFixed(2)}%</Text>
                  )}
                </View>
                <View style={styles.feeRow}>
                  <Text>Fixo:</Text>
                  {isEditingFees ? (
                    <TextInput
                      mode="outlined"
                      value={feePayload.boleto_fee_fixed?.toString() || ''}
                      onChangeText={(text) => handleFeeChange('boleto_fee_fixed', text)}
                      keyboardType="numeric"
                      style={styles.feeInput}
                      dense
                      error={!!formErrors.boleto_fee_fixed}
                    />
                  ) : (
                    <Text>R$ {acquirerFees[0].boleto_fee_fixed?.toFixed(2)}</Text>
                  )}
                </View>

                <Divider style={styles.divider} />

                <Text variant="titleMedium" style={styles.sectionTitle}>Taxas Cartão</Text>
                <View style={styles.feeRow}>
                  <Text>Tipo de Taxa:</Text>
                  {isEditingFees ? (
                    <TextInput
                      mode="outlined"
                      value={feePayload.fee_type_card || ''}
                      onChangeText={(text) => handleFeeTypeChange('fee_type_card', text)}
                      style={styles.feeTypeInput}
                      dense
                    />
                  ) : (
                    <Text>{acquirerFees[0].fee_type_card}</Text>
                  )}
                </View>
                <View style={styles.feeRow}>
                  <Text>Percentual:</Text>
                  {isEditingFees ? (
                    <TextInput
                      mode="outlined"
                      value={feePayload.card_fee_percentage?.toString() || ''}
                      onChangeText={(text) => handleFeeChange('card_fee_percentage', text)}
                      keyboardType="numeric"
                      style={styles.feeInput}
                      dense
                      error={!!formErrors.card_fee_percentage}
                    />
                  ) : (
                    <Text>{acquirerFees[0].card_fee_percentage?.toFixed(2)}%</Text>
                  )}
                </View>
                <View style={styles.feeRow}>
                  <Text>Fixo:</Text>
                  {isEditingFees ? (
                    <TextInput
                      mode="outlined"
                      value={feePayload.card_fee_fixed?.toString() || ''}
                      onChangeText={(text) => handleFeeChange('card_fee_fixed', text)}
                      keyboardType="numeric"
                      style={styles.feeInput}
                      dense
                      error={!!formErrors.card_fee_fixed}
                    />
                  ) : (
                    <Text>R$ {acquirerFees[0].card_fee_fixed?.toFixed(2)}</Text>
                  )}
                </View>

                {isEditingFees && (
                  <Button 
                    mode="contained" 
                    onPress={handleSaveFees} 
                    style={styles.saveButton}
                    loading={isLoading}
                    disabled={isLoading || Object.keys(formErrors).length > 0}
                  >
                    Salvar Taxas
                  </Button>
                )}
              </>
            )}
          </Card.Content>
        </Card>
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  description: {
    marginBottom: 16,
    color: '#666',
  },
  card: {
    marginBottom: 16,
    borderRadius: 8,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  saveButton: {
    marginTop: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 16,
    color: '#B00020',
  },
  retryButton: {
    marginBottom: 8,
  },
  backButton: {
    marginTop: 8,
  },
  feesLoading: {
    marginVertical: 16,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  feesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  feeItem: {
    width: '30%',
    marginBottom: 12,
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  feeInput: {
    height: 40,
  },
  feeTypeInput: {
    width: '60%',
    height: 40,
  },
  divider: {
    marginVertical: 16,
  },
}); 