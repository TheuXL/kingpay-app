import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SecurityCodeVerification, TicketCreation } from '@/components';
import { useAuth } from '@/contexts/AuthContext';

enum TestSection {
  NONE,
  SECURITY_CODE,
  TICKET,
}

export const ApiTestScreen: React.FC = () => {
  const [activeSection, setActiveSection] = useState<TestSection>(TestSection.NONE);
  const { user } = useAuth();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>API Integration Tests</Text>
      
      {user ? (
        <Text style={styles.userInfo}>
          Logged in as: {user.email}
        </Text>
      ) : (
        <Text style={styles.userInfo}>
          Not logged in
        </Text>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.sectionButton,
            activeSection === TestSection.SECURITY_CODE && styles.activeButton
          ]}
          onPress={() => setActiveSection(
            activeSection === TestSection.SECURITY_CODE 
              ? TestSection.NONE 
              : TestSection.SECURITY_CODE
          )}
        >
          <Text style={styles.buttonText}>Security Code Test</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.sectionButton,
            activeSection === TestSection.TICKET && styles.activeButton
          ]}
          onPress={() => setActiveSection(
            activeSection === TestSection.TICKET 
              ? TestSection.NONE 
              : TestSection.TICKET
          )}
        >
          <Text style={styles.buttonText}>Ticket Creation Test</Text>
        </TouchableOpacity>
      </View>

      {activeSection === TestSection.SECURITY_CODE && (
        <View style={styles.sectionContainer}>
          <SecurityCodeVerification
            onVerificationComplete={() => {
              console.log('Verification completed successfully');
            }}
          />
        </View>
      )}

      {activeSection === TestSection.TICKET && (
        <View style={styles.sectionContainer}>
          <TicketCreation
            onTicketCreated={(data) => {
              console.log('Ticket created:', data);
            }}
          />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  userInfo: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  sectionButton: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 150,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  sectionContainer: {
    marginTop: 8,
  },
}); 