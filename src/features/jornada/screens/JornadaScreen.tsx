import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const JornadaScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Jornada Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default JornadaScreen; 