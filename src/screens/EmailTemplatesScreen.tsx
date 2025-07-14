import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { EmailTemplatesList } from '../components/EmailTemplatesList';
import { EmailTemplateForm } from '../components/EmailTemplateForm';
import { AceitarTermosButton } from '../components/AceitarTermosButton';
import { useEmailTemplatesStore } from '../store/emailTemplatesStore';
import { EmailTemplate } from '../types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';

export const EmailTemplatesScreen = () => {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleSelectTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedTemplate(null);
  };

  const handleSaveTemplate = () => {
    setIsEditing(false);
    setSelectedTemplate(null);
  };

  const handleTermosAceitos = () => {
    // Recarregar dados ou atualizar interface conforme necessário
  };

  const renderContent = () => {
    if (isEditing && selectedTemplate) {
      return (
        <EmailTemplateForm
          template={selectedTemplate}
          onCancel={handleCancelEdit}
          onSave={handleSaveTemplate}
        />
      );
    }

    return (
      <View style={styles.container}>
        <EmailTemplatesList onSelectTemplate={handleSelectTemplate} />
        <View style={styles.aceitarTermosContainer}>
          <AceitarTermosButton onSuccess={handleTermosAceitos} />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: isEditing ? 'Editar Template' : 'Templates de Email',
          headerBackTitle: 'Voltar',
        }}
      />
      {renderContent()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  container: {
    flex: 1,
  },
  aceitarTermosContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
}); 