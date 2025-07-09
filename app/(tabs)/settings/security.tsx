import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Text, Switch, Divider, ActivityIndicator } from 'react-native-paper';
import { useRouter } from 'expo-router';

import { ScreenLayout } from '@/components/layout/ScreenLayout';
import { AppButton } from '@/components/common/AppButton';
import { FinancialPasswordModal } from '@/components/common/FinancialPasswordModal';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/services/supabase';

interface SecuritySettings {
  twoFactorEnabled: boolean;
  financialPasswordEnabled: boolean;
  sessionTimeout: number; // in minutes
  biometricEnabled: boolean;
}

export default function SecuritySettingsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    financialPasswordEnabled: false,
    sessionTimeout: 30,
    biometricEnabled: false,
  });
  
  const [showFinancialPasswordModal, setShowFinancialPasswordModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadSecuritySettings();
    }
  }, [user]);

  const loadSecuritySettings = async () => {
    setLoading(true);
    try {
      // Fetch security settings from the database
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user?.id)
        .single();
      
      if (error) {
        console.error('Error loading security settings:', error);
        return;
      }
      
      if (data) {
        setSettings({
          twoFactorEnabled: data.two_factor_enabled || false,
          financialPasswordEnabled: data.financial_password_enabled || false,
          sessionTimeout: data.session_timeout || 30,
          biometricEnabled: data.biometric_enabled || false,
        });
      }
    } catch (error) {
      console.error('Error loading security settings:', error);
      Alert.alert('Erro', 'Não foi possível carregar as configurações de segurança.');
    } finally {
      setLoading(false);
    }
  };

  const saveSecuritySettings = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user?.id,
          two_factor_enabled: settings.twoFactorEnabled,
          financial_password_enabled: settings.financialPasswordEnabled,
          session_timeout: settings.sessionTimeout,
          biometric_enabled: settings.biometricEnabled,
          updated_at: new Date().toISOString(),
        });
      
      if (error) {
        console.error('Error saving security settings:', error);
        Alert.alert('Erro', 'Não foi possível salvar as configurações de segurança.');
        return;
      }
      
      Alert.alert('Sucesso', 'Configurações de segurança atualizadas com sucesso.');
    } catch (error) {
      console.error('Error saving security settings:', error);
      Alert.alert('Erro', 'Não foi possível salvar as configurações de segurança.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = (setting: keyof SecuritySettings) => {
    // For sensitive security settings, require financial password
    if (
      (setting === 'twoFactorEnabled' || setting === 'financialPasswordEnabled') && 
      settings.financialPasswordEnabled
    ) {
      setPendingAction(setting);
      setShowFinancialPasswordModal(true);
    } else {
      // For non-sensitive settings or when financial password is not enabled
      setSettings(prev => ({
        ...prev,
        [setting]: !prev[setting],
      }));
    }
  };

  const handleFinancialPasswordConfirm = async (password: string) => {
    // Here you would validate the financial password against the backend
    try {
      // Simulate password validation
      await new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          // For demo purposes, any password is valid
          resolve();
          // In production, you would validate against the backend
          // if (password !== 'correct-password') reject(new Error('Invalid password'));
          // else resolve();
        }, 1000);
      });
      
      // If we get here, the password is valid
      if (pendingAction) {
        setSettings(prev => ({
          ...prev,
          [pendingAction]: !prev[pendingAction as keyof SecuritySettings],
        }));
      }
      
      setPendingAction(null);
    } catch (error) {
      // Password validation failed
      Alert.alert('Erro', 'Senha financeira incorreta.');
    }
  };

  const handleSetupTwoFactor = () => {
    router.push({
      pathname: '/(auth)/security-code' as any,
      params: { action: 'generate' }
    });
  };

  const handleChangePassword = () => {
    router.push('/(auth)/change-password' as any);
  };

  const handleSetFinancialPassword = () => {
    router.push('/(auth)/set-financial-password' as any);
  };

  if (loading) {
    return (
      <ScreenLayout>
        <View style={[styles.container, styles.centered]}>
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 16 }}>Carregando configurações...</Text>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <ScrollView style={styles.container}>
        <Text variant="headlineMedium" style={styles.title}>
          Configurações de Segurança
        </Text>

        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Autenticação
          </Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <Text variant="bodyLarge">Verificação em duas etapas</Text>
              <Text variant="bodySmall">
                Requer um código adicional ao fazer login
              </Text>
            </View>
            <Switch
              value={settings.twoFactorEnabled}
              onValueChange={() => handleToggle('twoFactorEnabled')}
            />
          </View>
          
          {settings.twoFactorEnabled && (
            <AppButton 
              onPress={handleSetupTwoFactor}
              style={styles.actionButton}
            >
              Configurar verificação em duas etapas
            </AppButton>
          )}
          
          <Divider style={styles.divider} />
          
          <View style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <Text variant="bodyLarge">Senha financeira</Text>
              <Text variant="bodySmall">
                Requer uma senha adicional para operações financeiras
              </Text>
            </View>
            <Switch
              value={settings.financialPasswordEnabled}
              onValueChange={() => handleToggle('financialPasswordEnabled')}
            />
          </View>
          
          {settings.financialPasswordEnabled && (
            <AppButton 
              onPress={handleSetFinancialPassword}
              style={styles.actionButton}
            >
              Alterar senha financeira
            </AppButton>
          )}
          
          <Divider style={styles.divider} />
          
          <View style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <Text variant="bodyLarge">Autenticação biométrica</Text>
              <Text variant="bodySmall">
                Use sua impressão digital ou Face ID para autenticar
              </Text>
            </View>
            <Switch
              value={settings.biometricEnabled}
              onValueChange={() => handleToggle('biometricEnabled')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Senhas
          </Text>
          
          <AppButton 
            onPress={handleChangePassword}
            style={styles.actionButton}
          >
            Alterar senha de acesso
          </AppButton>
        </View>

        <AppButton 
          mode="contained" 
          onPress={saveSecuritySettings}
          loading={saving}
          disabled={saving}
          style={styles.saveButton}
        >
          Salvar Alterações
        </AppButton>
      </ScrollView>
      
      <FinancialPasswordModal
        visible={showFinancialPasswordModal}
        onClose={() => {
          setShowFinancialPasswordModal(false);
          setPendingAction(null);
        }}
        onConfirm={handleFinancialPasswordConfirm}
        title="Confirmar Alteração"
        message="Esta alteração requer sua senha financeira para confirmar."
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  settingTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  divider: {
    marginVertical: 16,
  },
  actionButton: {
    marginBottom: 16,
  },
  saveButton: {
    marginTop: 8,
    marginBottom: 24,
  },
}); 