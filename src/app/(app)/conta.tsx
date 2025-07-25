import { LoggedButton } from '@/components/common/Button';
import { useAuthentication } from '@/features/authentication/hooks/useAuthentication';
import { CompanyConfigCard } from '@/features/companies/components/CompanyConfigCard';
import { CompanyInfoCard } from '@/features/companies/components/CompanyInfoCard';
import { TaxesCard } from '@/features/companies/components/TaxesCard';
import { useCompanyData } from '@/features/companies/hooks/useCompanyData';
import { colors } from '@/theme/colors';
import React from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function AccountScreen() {
    const { company, config, reserve, documents, isLoading, error } = useCompanyData();
    const { logout, loading: isLoggingOut } = useAuthentication();

    const handleLogout = async () => {
        await logout();
    };

    const renderContent = () => {
        if (isLoading) {
            return <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />;
        }
        if (error) {
            return <Text style={styles.errorText}>{error}</Text>;
        }
        return (
            <>
                <CompanyInfoCard company={company} />
                <TaxesCard />
                <CompanyConfigCard config={config} reserve={reserve} documents={documents} />
                <View style={styles.logoutButton}>
                    <LoggedButton
                        title="Sair (Logout)"
                        onPress={handleLogout}
                        primary={false} // Para dar um estilo diferente
                        disabled={isLoggingOut}
                        loading={isLoggingOut}
                        logLabel="Botão de Logout da Conta"
                    />
                </View>
            </>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
             <View style={styles.header}>
                <Text style={styles.title}>Minha Conta</Text>
            </View>
            <ScrollView>
                {renderContent()}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        padding: 20,
        paddingBottom: 0,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.textPrimary,
        textAlign: 'center',
    },
    errorText: {
        textAlign: 'center',
        color: colors.danger,
        marginTop: 20,
        fontSize: 16,
    },
    logoutButton: {
        margin: 16,
        marginTop: 24,
    }
}); 