// app/(drawer)/anticipations.tsx
import { AnticipationListItem } from '@/components/anticipations/AnticipationListItem';
import { EmptyState } from '@/components/common/EmptyState';
import { useAnticipationStore } from '@/store/anticipationStore';
import { theme } from '@/theme/theme';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const AnticipationsScreen = () => {
  const { anticipations, loading, error, fetchAnticipations, approveAnticipation, denyAnticipation } = useAnticipationStore();
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedAnticipationId, setSelectedAnticipationId] = useState<string | null>(null);
  const [denialReason, setDenialReason] = useState('');

  useEffect(() => {
    fetchAnticipations();
  }, [fetchAnticipations]);

  const handleApprove = async (id: string) => {
    Alert.alert(
      "Confirmar Aprovação",
      "Tem certeza que deseja aprovar esta antecipação?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Aprovar", onPress: async () => {
          const success = await approveAnticipation({ 
            anticipation_id: id,
            financial_password: '123456' // Add proper password handling
          });
          if (success) {
            Alert.alert("Sucesso", "Antecipação aprovada com sucesso.");
          }
        }}
      ]
    );
  };

  const handleDeny = (id: string) => {
    setSelectedAnticipationId(id);
    setModalVisible(true);
  };

  const confirmDeny = async () => {
    if (!selectedAnticipationId || !denialReason) return;
    
    const success = await denyAnticipation({
      anticipation_id: selectedAnticipationId,
      reason: denialReason,
    });
    
    if (success) {
      Alert.alert("Sucesso", "Antecipação negada com sucesso.");
    }
    
    setModalVisible(false);
    setDenialReason('');
    setSelectedAnticipationId(null);
  };

  if (loading && anticipations.length === 0) {
    return <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loader} />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={anticipations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AnticipationListItem 
            item={item}
            onApprove={handleApprove}
            onDeny={handleDeny}
          />
        )}
        ListEmptyComponent={
          !loading ? (
            <EmptyState
              icon="file-question-outline"
              title="Nenhuma Antecipação Encontrada"
              description="Não há antecipações para exibir no momento."
            />
          ) : null
        }
        contentContainerStyle={styles.listContent}
      />
      
      <Modal
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Motivo da Recusa</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite o motivo aqui..."
              value={denialReason}
              onChangeText={setDenialReason}
              multiline
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                <Text>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.confirmButton]} onPress={confirmDeny}>
                <Text style={styles.confirmButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: theme.colors.error,
    textAlign: 'center',
    marginTop: 20,
  },
  listContent: {
    padding: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  modalButton: {
    padding: 10,
    marginLeft: 10,
  },
  confirmButton: {
    backgroundColor: theme.colors.error,
    borderRadius: 5,
  },
  confirmButtonText: {
    color: 'white',
  },
});

export default AnticipationsScreen; 