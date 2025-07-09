import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView, Image } from 'react-native';
import { Text, Avatar, ActivityIndicator, Divider } from 'react-native-paper';
import { useRouter } from 'expo-router';

import { AppButton } from '@/components/common/AppButton';
import { AppTextInput } from '@/components/common/AppTextInput';
import { ScreenLayout } from '@/components/layout/ScreenLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/services/supabase';

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  avatar_url: string | null;
  job_title: string;
  department: string;
  created_at: string;
}

export default function ProfileSettingsScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [department, setDepartment] = useState('');

  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    setLoading(true);
    try {
      // Fetch user profile from the database
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
      
      if (error) {
        console.error('Error loading user profile:', error);
        return;
      }
      
      if (data) {
        setProfile(data as UserProfile);
        setFullName(data.full_name || '');
        setPhone(data.phone || '');
        setJobTitle(data.job_title || '');
        setDepartment(data.department || '');
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      Alert.alert('Erro', 'Não foi possível carregar o perfil do usuário.');
    } finally {
      setLoading(false);
    }
  };

  const saveUserProfile = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user?.id,
          full_name: fullName,
          phone,
          job_title: jobTitle,
          department,
          updated_at: new Date().toISOString(),
        });
      
      if (error) {
        console.error('Error saving user profile:', error);
        Alert.alert('Erro', 'Não foi possível salvar o perfil do usuário.');
        return;
      }
      
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso.');
      loadUserProfile(); // Reload profile to get updated data
    } catch (error) {
      console.error('Error saving user profile:', error);
      Alert.alert('Erro', 'Não foi possível salvar o perfil do usuário.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sair', 
          style: 'destructive',
          onPress: async () => {
            await signOut();
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <ScreenLayout>
        <View style={[styles.container, styles.centered]}>
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 16 }}>Carregando perfil...</Text>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          {profile?.avatar_url ? (
            <Avatar.Image 
              size={100} 
              source={{ uri: profile.avatar_url }} 
            />
          ) : (
            <Avatar.Text 
              size={100} 
              label={((profile?.full_name || "Usuário").substring(0, 2)).toUpperCase()} 
              style={{ backgroundColor: "#4A90E2" }}
              color="#FFFFFF"
            />
          )}
          <Text variant="headlineMedium" style={styles.name}>
            {fullName || 'Usuário'}
          </Text>
          <Text variant="bodyMedium" style={styles.email}>
            {user?.email}
          </Text>
          <AppButton 
            mode="outlined"
            onPress={() => Alert.alert('Funcionalidade em desenvolvimento')}
            style={styles.avatarButton}
          >
            Alterar foto
          </AppButton>
        </View>

        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Informações Pessoais
          </Text>
          
          <AppTextInput
            label="Nome Completo"
            value={fullName}
            onChangeText={setFullName}
          />
          
          <AppTextInput
            label="Telefone"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          
          <Divider style={styles.divider} />
          
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Informações Profissionais
          </Text>
          
          <AppTextInput
            label="Cargo"
            value={jobTitle}
            onChangeText={setJobTitle}
          />
          
          <AppTextInput
            label="Departamento"
            value={department}
            onChangeText={setDepartment}
          />
        </View>

        <AppButton 
          mode="contained" 
          onPress={saveUserProfile}
          loading={saving}
          disabled={saving}
          style={styles.saveButton}
        >
          Salvar Alterações
        </AppButton>
        
        <AppButton 
          mode="outlined"
          onPress={handleLogout}
          style={styles.logoutButton}
        >
          Sair
        </AppButton>
        
        <Text variant="bodySmall" style={styles.versionText}>
          Versão 1.0.0
        </Text>
      </ScrollView>
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
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  name: {
    marginTop: 16,
    fontWeight: 'bold',
  },
  email: {
    marginTop: 4,
    color: '#666',
  },
  avatarButton: {
    marginTop: 16,
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
  divider: {
    marginVertical: 16,
  },
  saveButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  logoutButton: {
    marginBottom: 24,
  },
  versionText: {
    textAlign: 'center',
    color: '#999',
    marginBottom: 16,
  },
}); 