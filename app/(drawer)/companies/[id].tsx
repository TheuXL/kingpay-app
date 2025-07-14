import { CompanyStatusBadge } from '@/components/companies/CompanyStatusBadge';
import { ScreenLayout } from '@/components/layout/ScreenLayout';
import { useCompanyStore } from '@/store/companyStore';
import { UpdateCompanyStatusPayload } from '@/types/company';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Avatar, Button, Card, Dialog, Divider, Menu, Text, TextInput } from 'react-native-paper';

export default function CompanyDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    currentCompany,
    companyTaxes,
    companyConfig,
    companyReserve,
    companyDocs,
    companyAcquirers,
    companyFinancialInfo,
    isLoading,
    error,
    fetchCompanyById,
    fetchCompanyTaxes,
    fetchCompanyConfig,
    fetchCompanyReserve,
    fetchCompanyDocs,
    fetchCompanyAcquirers,
    fetchCompanyFinancialInfo,
    updateStatus,
  } = useCompanyStore();

  const [menuVisible, setMenuVisible] = useState(false);
  const [statusDialogVisible, setStatusDialogVisible] = useState(false);
  const [statusPayload, setStatusPayload] = useState<UpdateCompanyStatusPayload>({
    status: 'approved',
    reason: '',
  });

  useEffect(() => {
    if (id) {
      fetchCompanyById(id);
      fetchCompanyTaxes(id);
      fetchCompanyConfig(id);
      fetchCompanyReserve(id);
      fetchCompanyDocs(id);
      fetchCompanyAcquirers(id);
      fetchCompanyFinancialInfo(id);
    }
  }, [
    id,
    fetchCompanyById,
    fetchCompanyTaxes,
    fetchCompanyConfig,
    fetchCompanyReserve,
    fetchCompanyDocs,
    fetchCompanyAcquirers,
    fetchCompanyFinancialInfo,
  ]);

  const handleGoBack = () => {
    router.back();
  };

  const handleRefresh = () => {
    if (id) {
      fetchCompanyById(id);
      fetchCompanyTaxes(id);
      fetchCompanyConfig(id);
      fetchCompanyReserve(id);
      fetchCompanyDocs(id);
      fetchCompanyAcquirers(id);
      fetchCompanyFinancialInfo(id);
    }
  };

  const handleEditCompany = () => {
    // Navigate to edit company screen
    setMenuVisible(false);
  };

  const handleEditTaxes = () => {
    if (id) {
      router.navigate(`/companies/taxes/${id}` as any);
    }
    setMenuVisible(false);
  };

  const openStatusDialog = (status: 'approved' | 'rejected' | 'blocked') => {
    setStatusPayload({ status, reason: '' });
    setStatusDialogVisible(true);
    setMenuVisible(false);
  };

  const handleStatusChange = async () => {
    if (id) {
      await updateStatus(id, statusPayload);
      setStatusDialogVisible(false);
    }
  };

  if (isLoading && !currentCompany) {
    return (
      <ScreenLayout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      </ScreenLayout>
    );
  }

  if (error || !currentCompany) {
    return (
      <ScreenLayout>
        <View style={styles.errorContainer}>
          <Text variant="bodyLarge" style={styles.errorText}>
            {error || 'Não foi possível carregar os dados da empresa.'}
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
          <Button mode="outlined" onPress={handleGoBack} style={styles.backButton}>
            Voltar
          </Button>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <Button mode="contained" onPress={() => setMenuVisible(true)}>
                Ações
              </Button>
            }
          >
            <Menu.Item onPress={handleEditCompany} title="Editar Empresa" />
            <Menu.Item onPress={handleEditTaxes} title="Editar Taxas" />
            <Divider />
            <Menu.Item
              onPress={() => openStatusDialog('approved')}
              title="Aprovar Empresa"
              disabled={currentCompany.status === 'approved'}
            />
            <Menu.Item
              onPress={() => openStatusDialog('rejected')}
              title="Rejeitar Empresa"
              disabled={currentCompany.status === 'rejected'}
            />
            <Menu.Item
              onPress={() => openStatusDialog('blocked')}
              title="Bloquear Empresa"
              disabled={currentCompany.status === 'blocked'}
            />
          </Menu>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.companyHeader}>
              {currentCompany.logo_url ? (
                <Avatar.Image size={64} source={{ uri: currentCompany.logo_url }} style={styles.avatar} />
              ) : (
                <Avatar.Text
                  size={64}
                  label={currentCompany.name.substring(0, 2)}
                  style={styles.avatar}
                />
              )}
              <View style={styles.companyInfo}>
                <Text variant="headlineSmall">{currentCompany.name}</Text>
                <Text variant="bodyMedium">{currentCompany.tax_id}</Text>
                <View style={styles.statusContainer}>
                  <CompanyStatusBadge status={currentCompany.status} size="medium" />
                </View>
              </View>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.infoSection}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Informações de Contato
              </Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Email:</Text>
                <Text style={styles.infoValue}>{currentCompany.email}</Text>
              </View>
              {currentCompany.phone && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Telefone:</Text>
                  <Text style={styles.infoValue}>{currentCompany.phone}</Text>
                </View>
              )}
              {currentCompany.website && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Website:</Text>
                  <Text style={styles.infoValue}>{currentCompany.website}</Text>
                </View>
              )}
            </View>

            {currentCompany.address && (
              <View style={styles.infoSection}>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Endereço
                </Text>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Rua:</Text>
                  <Text style={styles.infoValue}>
                    {currentCompany.address.street}, {currentCompany.address.number}
                    {currentCompany.address.complement ? `, ${currentCompany.address.complement}` : ''}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Bairro:</Text>
                  <Text style={styles.infoValue}>{currentCompany.address.neighborhood}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Cidade/Estado:</Text>
                  <Text style={styles.infoValue}>
                    {currentCompany.address.city} - {currentCompany.address.state}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>CEP:</Text>
                  <Text style={styles.infoValue}>{currentCompany.address.postal_code}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>País:</Text>
                  <Text style={styles.infoValue}>{currentCompany.address.country}</Text>
                </View>
              </View>
            )}

            {currentCompany.legal_representative && (
              <View style={styles.infoSection}>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Representante Legal
                </Text>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Nome:</Text>
                  <Text style={styles.infoValue}>{currentCompany.legal_representative.name}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Email:</Text>
                  <Text style={styles.infoValue}>{currentCompany.legal_representative.email}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Telefone:</Text>
                  <Text style={styles.infoValue}>{currentCompany.legal_representative.phone}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>CPF:</Text>
                  <Text style={styles.infoValue}>{currentCompany.legal_representative.tax_id}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Data de Nascimento:</Text>
                  <Text style={styles.infoValue}>{currentCompany.legal_representative.birth_date}</Text>
                </View>
              </View>
            )}
          </Card.Content>
        </Card>

        {companyTaxes && (
          <Card style={styles.card}>
            <Card.Title title="Taxas" right={(props) => <Button {...props} onPress={handleEditTaxes}>Editar</Button>} />
            <Card.Content>
              <View style={styles.infoSection}>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  PIX
                </Text>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Taxa Percentual:</Text>
                  <Text style={styles.infoValue}>{companyTaxes.pix_fee_percentage}%</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Taxa Fixa:</Text>
                  <Text style={styles.infoValue}>R$ {companyTaxes.pix_fee_fixed.toFixed(2)}</Text>
                </View>
              </View>

              <View style={styles.infoSection}>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Boleto
                </Text>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Taxa Percentual:</Text>
                  <Text style={styles.infoValue}>{companyTaxes.boleto_fee_percentage}%</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Taxa Fixa:</Text>
                  <Text style={styles.infoValue}>R$ {companyTaxes.boleto_fee_fixed.toFixed(2)}</Text>
                </View>
              </View>

              <View style={styles.infoSection}>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Cartão
                </Text>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Taxa Percentual:</Text>
                  <Text style={styles.infoValue}>{companyTaxes.card_fee_percentage}%</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Taxa Fixa:</Text>
                  <Text style={styles.infoValue}>R$ {companyTaxes.card_fee_fixed.toFixed(2)}</Text>
                </View>
              </View>

              <View style={styles.infoSection}>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  MDR (Cartão de Crédito)
                </Text>
                <View style={styles.mdrGrid}>
                  {[...Array(12)].map((_, idx) => {
                    const installment = idx + 1;
                    const fieldName = `mdr_${installment}x` as keyof typeof companyTaxes;
                    
                    return (
                      <View key={fieldName} style={styles.mdrItem}>
                        <Text style={styles.mdrLabel}>{installment}x:</Text>
                        <Text style={styles.mdrValue}>{companyTaxes[fieldName]}%</Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            </Card.Content>
          </Card>
        )}

        {companyConfig && (
          <Card style={styles.card}>
            <Card.Title title="Configurações" />
            <Card.Content>
              <View style={styles.configGrid}>
                <View style={styles.configItem}>
                  <Text style={styles.configLabel}>PIX:</Text>
                  <Text style={styles.configValue}>{companyConfig.allow_pix ? 'Ativo' : 'Inativo'}</Text>
                </View>
                <View style={styles.configItem}>
                  <Text style={styles.configLabel}>Boleto:</Text>
                  <Text style={styles.configValue}>{companyConfig.allow_boleto ? 'Ativo' : 'Inativo'}</Text>
                </View>
                <View style={styles.configItem}>
                  <Text style={styles.configLabel}>Cartão de Crédito:</Text>
                  <Text style={styles.configValue}>{companyConfig.allow_credit_card ? 'Ativo' : 'Inativo'}</Text>
                </View>
                <View style={styles.configItem}>
                  <Text style={styles.configLabel}>Split:</Text>
                  <Text style={styles.configValue}>{companyConfig.allow_split ? 'Ativo' : 'Inativo'}</Text>
                </View>
                <View style={styles.configItem}>
                  <Text style={styles.configLabel}>Marketplace:</Text>
                  <Text style={styles.configValue}>{companyConfig.allow_marketplace ? 'Ativo' : 'Inativo'}</Text>
                </View>
                <View style={styles.configItem}>
                  <Text style={styles.configLabel}>Assinatura:</Text>
                  <Text style={styles.configValue}>{companyConfig.allow_subscription ? 'Ativo' : 'Inativo'}</Text>
                </View>
                <View style={styles.configItem}>
                  <Text style={styles.configLabel}>Link de Pagamento:</Text>
                  <Text style={styles.configValue}>{companyConfig.allow_link_payment ? 'Ativo' : 'Inativo'}</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        )}

        {companyReserve && (
          <Card style={styles.card}>
            <Card.Title title="Reserva" />
            <Card.Content>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Percentual de Reserva:</Text>
                <Text style={styles.infoValue}>{companyReserve.reserve_percentage}%</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Dias de Reserva:</Text>
                <Text style={styles.infoValue}>{companyReserve.reserve_days} dias</Text>
              </View>
            </Card.Content>
          </Card>
        )}

        {companyFinancialInfo && (
          <Card style={styles.card}>
            <Card.Title title="Informações Financeiras" />
            <Card.Content>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Banco:</Text>
                <Text style={styles.infoValue}>
                  {companyFinancialInfo.bank_code} - {companyFinancialInfo.bank_name}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Agência:</Text>
                <Text style={styles.infoValue}>{companyFinancialInfo.agency}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Conta:</Text>
                <Text style={styles.infoValue}>{companyFinancialInfo.account}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Tipo de Conta:</Text>
                <Text style={styles.infoValue}>{companyFinancialInfo.account_type}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Titular:</Text>
                <Text style={styles.infoValue}>{companyFinancialInfo.account_holder_name}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>CPF/CNPJ do Titular:</Text>
                <Text style={styles.infoValue}>{companyFinancialInfo.account_holder_tax_id}</Text>
              </View>
            </Card.Content>
          </Card>
        )}

        {companyAcquirers && companyAcquirers.length > 0 && (
          <Card style={styles.card}>
            <Card.Title title="Adquirentes" />
            <Card.Content>
              {companyAcquirers.map((acquirer) => (
                <View key={acquirer.id} style={styles.infoSection}>
                  <Text variant="titleMedium" style={styles.sectionTitle}>
                    {acquirer.acquirer_name}
                  </Text>
                  <View style={styles.configGrid}>
                    <View style={styles.configItem}>
                      <Text style={styles.configLabel}>PIX:</Text>
                      <Text style={styles.configValue}>{acquirer.acquirers_pix ? 'Ativo' : 'Inativo'}</Text>
                    </View>
                    <View style={styles.configItem}>
                      <Text style={styles.configLabel}>Boleto:</Text>
                      <Text style={styles.configValue}>{acquirer.acquirers_boleto ? 'Ativo' : 'Inativo'}</Text>
                    </View>
                    <View style={styles.configItem}>
                      <Text style={styles.configLabel}>Cartão:</Text>
                      <Text style={styles.configValue}>{acquirer.acquirers_card ? 'Ativo' : 'Inativo'}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      <Dialog visible={statusDialogVisible} onDismiss={() => setStatusDialogVisible(false)}>
        <Dialog.Title>
          {statusPayload.status === 'approved'
            ? 'Aprovar Empresa'
            : statusPayload.status === 'rejected'
            ? 'Rejeitar Empresa'
            : 'Bloquear Empresa'}
        </Dialog.Title>
        <Dialog.Content>
          <TextInput
            label="Motivo"
            value={statusPayload.reason}
            onChangeText={(text) => setStatusPayload((prev: UpdateCompanyStatusPayload) => ({ ...prev, reason: text }))}
            multiline
            numberOfLines={4}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setStatusDialogVisible(false)}>Cancelar</Button>
          <Button onPress={handleStatusChange} mode="contained">
            Confirmar
          </Button>
        </Dialog.Actions>
      </Dialog>
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
  backButton: {
    marginRight: 8,
  },
  card: {
    marginBottom: 16,
  },
  companyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    marginRight: 16,
  },
  companyInfo: {
    flex: 1,
  },
  statusContainer: {
    marginTop: 8,
  },
  divider: {
    marginVertical: 16,
  },
  infoSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 8,
    fontWeight: '500',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  infoLabel: {
    flex: 2,
    fontWeight: '500',
    color: '#666',
  },
  infoValue: {
    flex: 3,
  },
  mdrGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  mdrItem: {
    width: '33%',
    flexDirection: 'row',
    marginBottom: 8,
  },
  mdrLabel: {
    marginRight: 8,
    fontWeight: '500',
    color: '#666',
  },
  mdrValue: {},
  configGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  configItem: {
    width: '50%',
    flexDirection: 'row',
    marginBottom: 8,
  },
  configLabel: {
    marginRight: 8,
    fontWeight: '500',
    color: '#666',
  },
  configValue: {},
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
}); 