// src/components/layout/ScreenContainer.tsx
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';

type ScreenContainerProps = {
  children: React.ReactNode;
  style?: ViewStyle;
  scrollable?: boolean;
};

export const ScreenContainer = ({ children, style, scrollable = false }: ScreenContainerProps) => {
  const Container = scrollable ? ScrollView : View;
  const contentContainerStyle = scrollable ? styles.scrollContent : {};

  return (
    <SafeAreaView style={styles.safeArea}>
      <Container style={[styles.container, style]} contentContainerStyle={contentContainerStyle}>
        {children}
      </Container>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  scrollContent: {
    paddingBottom: 40,
  },
});
