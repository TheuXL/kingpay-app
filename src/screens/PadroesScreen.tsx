import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PadroesForm } from '../components/PadroesForm';
import { PadroesView } from '../components/PadroesView';
import { usePermissions } from '../hooks/usePermissions';

export default function PadroesScreen() {
  const insets = useSafeAreaInsets();
  const [isEditing, setIsEditing] = useState(false);
  const { hasPermission } = usePermissions();
  const canEdit = hasPermission('edit_standards');

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {isEditing ? (
        <PadroesForm onCancel={handleCancel} onSave={handleSave} />
      ) : (
        <PadroesView onEdit={canEdit ? handleEdit : undefined} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
}); 