import { useUserData } from '@/contexts/UserDataContext';
// import { useHomeData } from '../hooks/useHomeData'; // Comentado temporariamente
import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo } from 'react';
import { RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import HeaderUser from '../../../components/home/HeaderUser';
import QuickActions from '../../../components/home/QuickActions';
import SaldoCard from '../../../components/home/SaldoCard';

const HomeScreen = () => {
  const { userProfile, company } = useUserData();
  /*
  const {
    financialSummary,
    chartData,
    additionalInfo,
    isLoading,
    error,
    refreshData,
  } = useHomeData();
  */
  // Mock data para o design
  const isLoading = false;
  const error = null;
  const refreshData = () => {};


  const userName = useMemo(() => {
    if (userProfile?.fullname) return userProfile.fullname.split(' ')[0];
    if (userProfile?.email) return userProfile.email.split('@')[0];
    return 'Usuário';
  }, [userProfile]);

  /* Comentado para focar no design
  if (isLoading && !financialSummary) {
    return (
      <LinearGradient colors={['#EAF1FB', '#FFFFFF']} style={styles.flexOne}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#1A1AFF" />
        </View>
      </LinearGradient>
    );
  }
  */

  if (error) {
    return (
      <LinearGradient colors={['#EAF1FB', '#FFFFFF']} style={styles.flexOne}>
        <SafeAreaView style={styles.flexOne}>
          <View style={styles.content}>
            <HeaderUser
              userName={userName}
              userPhoto={company?.logo_url || undefined}
            />
            <View style={styles.centered}>
              <Text style={styles.errorText}>
                Ocorreu um erro ao carregar os dados. Tente novamente.
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#EAF1FB', '#FFFFFF']} style={styles.flexOne}>
      <SafeAreaView style={styles.flexOne}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={refreshData} tintColor="#1A1AFF" />
          }
        >
          <HeaderUser
            userName={userName}
            userPhoto={company?.logo_url || undefined}
          />
          
          <SaldoCard balance={138241.15} />
          
          <QuickActions />

          {/* Placeholders for the new cards */}
          <View style={styles.placeholderCard}><Text>JourneyCard</Text></View>
          <View style={styles.placeholderCard}><Text>SalesChartCard</Text></View>

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 24, // Espaçamento do topo
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#FF647C',
    textAlign: 'center',
    padding: 20,
  },
  placeholderCard: {
    height: 150,
    backgroundColor: '#E0E0E0',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
  }
});

export default HomeScreen; 