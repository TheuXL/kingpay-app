import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Image, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useBaasStore } from '../../store/baasStore';
import { Baas } from '../../types/baas';

interface BaasListItemProps {
  baas: Baas;
}

const BaasListItem: React.FC<BaasListItemProps> = ({ baas }) => {
  const router = useRouter();
  const { toggleBaasActive, loading } = useBaasStore();

  const handlePress = () => {
    router.push(`/baas/${baas.id}` as any);
  };

  const handleToggleActive = async () => {
    Alert.alert(
      baas.active ? 'Desativar BaaS' : 'Ativar BaaS',
      `Deseja ${baas.active ? 'desativar' : 'ativar'} o BaaS "${baas.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            const success = await toggleBaasActive(baas.id);
            if (success) {
              Alert.alert(
                'Sucesso',
                `BaaS ${baas.active ? 'desativado' : 'ativado'} com sucesso!`
              );
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress} disabled={loading}>
      <View style={styles.infoContainer}>
        <View style={styles.headerRow}>
          {baas.logo_url && (
            <Image source={{ uri: baas.logo_url }} style={styles.logo} />
          )}
          <Text style={styles.name}>{baas.name}</Text>
        </View>
        
        {baas.description && (
          <Text style={styles.description} numberOfLines={2}>
            {baas.description}
          </Text>
        )}
        
        <Text style={styles.date}>
          Criado em: {formatDate(baas.created_at)}
        </Text>
      </View>
      
      <View style={styles.actionsContainer}>
        <View style={styles.statusContainer}>
          <Text style={styles.statusLabel}>
            {baas.active ? 'Ativo' : 'Inativo'}
          </Text>
          <Switch
            value={baas.active}
            onValueChange={handleToggleActive}
            disabled={loading}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={baas.active ? '#f5dd4b' : '#f4f3f4'}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
    color: '#777',
  },
  actionsContainer: {
    marginLeft: 16,
  },
  statusContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 12,
    marginBottom: 4,
    fontWeight: '500',
  },
});

export default BaasListItem; 