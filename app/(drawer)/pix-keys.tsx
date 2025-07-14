import PixKeyList from '@/components/PixKeyList';
import { ScreenLayout } from '@/components/layout/ScreenLayout';
import { PixKey } from '@/types/pixKey';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

export default function PixKeysScreen() {
  const router = useRouter();
  const [selectedPixKey, setSelectedPixKey] = useState<PixKey | null>(null);

  const handleSelectPixKey = (pixKey: PixKey) => {
    setSelectedPixKey(pixKey);
    // You could navigate to a details screen here
    // router.push({pathname: '/pix-key-details', params: {id: pixKey.id}});
  };

  const handleAddPixKey = () => {
    // Navigate to add PIX key screen
    // router.push('/add-pix-key');
    console.log('Add PIX key');
  };

  return (
    <ScreenLayout>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Chaves PIX
        </Text>
        <Button 
          mode="contained" 
          onPress={handleAddPixKey}
          icon="plus"
        >
          Nova Chave
        </Button>
      </View>

      <PixKeyList onSelectPixKey={handleSelectPixKey} />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    flex: 1,
  },
}); 