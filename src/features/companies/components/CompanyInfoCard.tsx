import { Company } from '@/features/companies/services/companyService'; // Supondo que o tipo está aqui
import { colors } from '@/theme/colors';
import { Feather } from '@expo/vector-icons';
import React, { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const InfoRow = ({ icon, label, value }: { icon: ReactNode, label: string, value: string | ReactNode }) => (
    <View style={styles.row}>
        <Feather name={icon} size={18} color={colors.textSecondary} />
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
    </View>
);

interface CompanyInfoCardProps {
    company: Company | null;
}

export const CompanyInfoCard = ({ company }: CompanyInfoCardProps) => {
    if (!company) return null;

    const getStatusStyle = (status) => {
        switch(status) {
            case 'approved': return styles.approved;
            case 'pending': return styles.pending;
            case 'denied': return styles.denied;
            default: return styles.defaultStatus;
        }
    }

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.title}>{company.name}</Text>
                <View style={[styles.statusBadge, getStatusStyle(company.status)]}>
                    <Text style={styles.statusText}>{company.status}</Text>
                </View>
            </View>
            <InfoRow icon="hash" label="CNPJ/CPF" value={company.taxid} />
            <InfoRow icon="globe" label="Website" value={company.website || 'N/A'} />
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        margin: 16,
        marginBottom: 0,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.textPrimary,
        flex: 1,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
    },
    statusText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
    approved: { backgroundColor: colors.success },
    pending: { backgroundColor: colors.warning },
    denied: { backgroundColor: colors.danger },
    defaultStatus: { backgroundColor: colors.textSecondary },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    label: {
        fontSize: 16,
        color: colors.textSecondary,
        marginLeft: 12,
        flex: 1,
    },
    value: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
    },
}); 