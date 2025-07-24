import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';

const ExploreCard = () => {
  return (
    <View style={styles.container}>
        {/* A ImageBackground será usada quando a imagem estiver disponível */}
        <View style={styles.card}>
            <Text style={styles.title}>Explorar outras funcionalidades</Text>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  card: {
    height: 120,
    borderRadius: 16,
    backgroundColor: colors.primary,
    padding: 20,
    justifyContent: 'flex-end',
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ExploreCard; 