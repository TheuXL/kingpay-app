import React, { useState } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { UtmFyTrackerForm } from '../components/UtmFyTrackerForm';
import { UtmFyTrackerList } from '../components/UtmFyTrackerList';
import { useUtmFyStore } from '../stores/utmfyStore';
import { UtmFyTracker } from '../types/utmfy';

interface UtmFyManagementScreenProps {
  isAdmin?: boolean;
}

export const UtmFyManagementScreen: React.FC<UtmFyManagementScreenProps> = ({
  isAdmin = false
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTracker, setSelectedTracker] = useState<UtmFyTracker | null>(null);
  const { fetchTrackers } = useUtmFyStore();

  const handleAddTracker = () => {
    setSelectedTracker(null);
    setModalVisible(true);
  };

  const handleEditTracker = (tracker: UtmFyTracker) => {
    setSelectedTracker(tracker);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedTracker(null);
  };

  const handleSuccess = () => {
    setModalVisible(false);
    setSelectedTracker(null);
    fetchTrackers(); // Recarrega a lista após sucesso
  };

  return (
    <View style={styles.container}>
      <UtmFyTrackerList
        onSelectTracker={isAdmin ? handleEditTracker : undefined}
        onAddTracker={isAdmin ? handleAddTracker : undefined}
        isAdmin={isAdmin}
      />

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <UtmFyTrackerForm
          tracker={selectedTracker}
          onSuccess={handleSuccess}
          onCancel={handleCloseModal}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
}); 