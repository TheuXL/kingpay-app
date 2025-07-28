import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAppContext } from '../../../contexts/AppContext';

// Interfaces simplificadas para o propósito da refatoração
interface SettingsItem {
  id: string;
  title: string;
  subtitle?: string;
  type: 'navigation' | 'switch';
  onPress?: () => void;
  value?: boolean;
  chevron?: boolean;
  color?: string;
}

interface SettingsSection {
  id: string;
  title: string;
  items: SettingsItem[];
}

export default function SettingsScreen() {
      const { user, logout } = useAppContext();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    // O redirecionamento é tratado pelo layout raiz
  };

  const settingsSections: SettingsSection[] = [
    {
      id: 'account',
      title: 'Conta',
      items: [
        {
          id: 'my-data',
          title: 'Meus dados',
          subtitle: user?.email || '',
          type: 'navigation',
          chevron: true,
          onPress: () => Alert.alert('Meus dados', 'Tela de edição de dados em breve.'),
        },
      ],
    },
    {
      id: 'security',
      title: 'Segurança',
      items: [
        {
          id: '2fa',
          title: 'Autenticação de Dois Fatores',
          subtitle: 'Adicione uma camada extra de segurança',
          type: 'navigation',
          chevron: true,
          onPress: () => router.push('/(app)/security'),
        },
      ],
    },
    {
      id: 'support',
      title: 'Suporte',
      items: [
        {
          id: 'help-center',
          title: 'Central de Ajuda',
          subtitle: 'Encontre respostas para suas dúvidas',
          type: 'navigation',
          chevron: true,
          onPress: () => router.push('/(app)/support'),
        },
      ],
    },
    {
      id: 'session',
      title: 'Sessão',
      items: [
        {
          id: 'logout',
          title: 'Sair da Conta',
          type: 'navigation',
          onPress: handleLogout,
          color: '#D92D20',
        },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ajustes</Text>
      </View>
      <ScrollView>
        {settingsSections.map((section) => (
          <View key={section.id} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.items.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.item,
                  index === section.items.length - 1 && styles.itemLast,
                ]}
                onPress={item.onPress}
                disabled={!item.onPress}
              >
                <View style={styles.itemLeft}>
                  <Text style={[styles.itemTitle, { color: item.color || '#101828' }]}>
                    {item.title}
                  </Text>
                  {item.subtitle && (
                    <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
                  )}
                </View>
                {item.type === 'navigation' && item.chevron && (
                  <Ionicons name="chevron-forward" size={20} color="#667085" />
                )}
                {item.type === 'switch' && (
                  <Switch
                    value={item.value}
                    onValueChange={item.onPress}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F4F7',
  },
  header: {
    backgroundColor: 'white',
    padding: 16,
    paddingTop: 50, // SafeArea
    borderBottomWidth: 1,
    borderBottomColor: '#EAECF0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#475467',
    textTransform: 'uppercase',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  item: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EAECF0',
  },
  itemLast: {
    borderBottomWidth: 0,
  },
  itemLeft: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    color: '#101828',
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#475467',
    marginTop: 2,
  },
}); 