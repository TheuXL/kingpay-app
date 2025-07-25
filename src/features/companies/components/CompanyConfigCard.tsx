import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '@/theme/colors';

const ConfigSection = ({ title, icon, children }) => (
    <View style={styles.section}>
        <View style={styles.sectionHeader}>
            <Feather name={icon} size={20} color={colors.textPrimary} />
            <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        <View style={styles.sectionContent}>
            {children}
        </View>
    </View>
);

const DetailRow = ({ label, value }) => (
    <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
    </View>
)

export const CompanyConfigCard = ({ config, reserve, documents }) => {
    if (!config || !reserve || !documents) return null;

    return (
        <View style={styles.card}>
            <ConfigSection title="Reserva Financeira" icon="shield">
                <DetailRow label="Percentual Pix" value={`${reserve.reservepercentagepix}%`} />
                <DetailRow label="Dias Pix" value={`${reserve.reservedayspix} dias`} />
            </ConfigSection>

            <ConfigSection title="Documentos" icon="file-text">
                <DetailRow label="Status" value={documents.status} />
                <DetailRow label="Selfie Enviada" value={documents.selfie_url ? 'Sim' : 'Não'} />
            </ConfigSection>

            <ConfigSection title="Permissões" icon="toggle-right">
                <DetailRow label="Transferência Automática" value={config.autotransfer ? 'Ativo' : 'Inativo'} />
                <DetailRow label="Saque Habilitado" value={config.transferenabled ? 'Sim' : 'Não'} />
            </ConfigSection>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        margin: 16,
    },
    section: {
        marginBottom: 15,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginLeft: 10,
    },
    sectionContent: {
        paddingLeft: 10,
        borderLeftWidth: 2,
        borderLeftColor: colors.background,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5,
    },
    detailLabel: {
        color: colors.textSecondary,
    },
    detailValue: {
        fontWeight: '600',
        color: colors.textPrimary,
    }
}); 