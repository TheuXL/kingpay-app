import { colors } from '@/theme/colors';
import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { usePixKeys } from '../hooks/usePixKeys';
import { PixKey, createPixKey } from '../services/pixKeyService';

const PixKeyItem = ({ item }: { item: PixKey }) => (
    <View style={styles.item}>
        <Feather name="key" size={20} color={colors.primary} />
        <View style={styles.itemDetails}>
            <Text style={styles.keyType}>{item.key_type}</Text>
            <Text style={styles.keyValue}>{item.key_value}</Text>
        </View>
        <Text style={styles.keyStatus}>{item.status}</Text>
    </View>
);

export const PixKeysList = () => {
    const { keys, isLoading, error, refetch } = usePixKeys();
    const [modalVisible, setModalVisible] = useState(false);
    const [keyType, setKeyType] = useState<'cpf'|'cnpj'|'email'|'telefone'|'aleatoria'>('cpf');
    const [keyValue, setKeyValue] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddPixKey = async () => {
        if (!keyValue) {
            Alert.alert('Erro', 'Preencha o valor da chave Pix.');
            return;
        }
        setIsSubmitting(true);
        try {
            const response = await createPixKey({ key_type: keyType, key_value: keyValue });
            if (response.success) {
                setModalVisible(false);
                setKeyValue('');
                refetch();
                Alert.alert('Sucesso', 'Chave Pix criada com sucesso!');
            } else {
                Alert.alert('Erro', response.error || 'Erro ao criar chave Pix.');
            }
        } catch (e: any) {
            Alert.alert('Erro', e.message || 'Erro ao criar chave Pix.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <ActivityIndicator style={{ marginTop: 20 }} />;
    }
    if (error) {
        return <Text style={styles.errorText}>{error}</Text>;
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={keys}
                renderItem={({ item }) => <PixKeyItem item={item} />}
                keyExtractor={item => item.id}
                ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma chave Pix cadastrada.</Text>}
            />
            <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                <Feather name="plus" size={24} color="#fff" />
                <Text style={styles.addButtonText}>Adicionar Chave Pix</Text>
            </TouchableOpacity>

            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Nova Chave Pix</Text>
                        <View style={styles.typeSelector}>
                            {['cpf','cnpj','email','telefone','aleatoria'].map(type => (
                                <TouchableOpacity
                                    key={type}
                                    style={[styles.typeOption, keyType === type && styles.typeOptionSelected]}
                                    onPress={() => setKeyType(type as any)}
                                >
                                    <Text style={keyType === type ? styles.typeOptionTextSelected : styles.typeOptionText}>{type.toUpperCase()}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Valor da chave"
                            value={keyValue}
                            onChangeText={setKeyValue}
                            autoCapitalize="none"
                        />
                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)} disabled={isSubmitting}>
                                <Text style={styles.cancelButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.saveButton} onPress={handleAddPixKey} disabled={isSubmitting}>
                                <Text style={styles.saveButtonText}>{isSubmitting ? 'Salvando...' : 'Salvar'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, marginTop: 16 },
    item: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
    itemDetails: { flex: 1, marginLeft: 12 },
    keyType: { textTransform: 'capitalize', color: colors.textSecondary, fontSize: 12 },
    keyValue: { fontSize: 16, color: colors.textPrimary, fontWeight: '600' },
    keyStatus: { color: colors.warning, fontWeight: 'bold' },
    errorText: { textAlign: 'center', color: 'red', marginTop: 20 },
    emptyText: { textAlign: 'center', color: '#666', marginTop: 20 },
    addButton: { flexDirection: 'row', backgroundColor: colors.primary, padding: 16, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 16 },
    addButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { backgroundColor: '#fff', borderRadius: 16, padding: 24, width: '90%' },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
    typeSelector: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
    typeOption: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, backgroundColor: '#eee', marginHorizontal: 2 },
    typeOptionSelected: { backgroundColor: colors.primary },
    typeOptionText: { color: '#333', fontWeight: 'bold' },
    typeOptionTextSelected: { color: '#fff', fontWeight: 'bold' },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16 },
    modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
    cancelButton: { padding: 12 },
    cancelButtonText: { color: colors.danger, fontWeight: 'bold' },
    saveButton: { backgroundColor: colors.primary, borderRadius: 8, padding: 12, paddingHorizontal: 24 },
    saveButtonText: { color: '#fff', fontWeight: 'bold' },
}); 