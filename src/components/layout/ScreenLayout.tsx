import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  ViewStyle,
  useColorScheme
} from 'react-native';
import { customTheme } from '../../theme/theme';

interface ScreenLayoutProps {
  children: React.ReactNode;
  style?: ViewStyle;
  scrollable?: boolean;
  keyboardAvoiding?: boolean;
  padding?: boolean;
  safeArea?: boolean;
}

export const ScreenLayout: React.FC<ScreenLayoutProps> = ({
  children,
  style,
  scrollable = false,
  keyboardAvoiding = true,
  padding = true,
  safeArea = true,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const content = (
    <View
      style={[
        styles.container,
        padding && styles.padding,
        style,
      ]}
    >
      {children}
    </View>
  );

  const wrappedContent = scrollable ? (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={!padding ? null : styles.scrollViewContent}
      keyboardShouldPersistTaps="handled"
    >
      {content}
    </ScrollView>
  ) : content;

  const keyboardAvoidingWrappedContent = keyboardAvoiding ? (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      {wrappedContent}
    </KeyboardAvoidingView>
  ) : wrappedContent;

  const backgroundStyle = {
    backgroundColor: isDark ? customTheme.colors.background.dark : customTheme.colors.background.light,
  };

  if (safeArea) {
    return (
      <SafeAreaView style={[styles.safeArea, backgroundStyle]}>
        <StatusBar
          barStyle={isDark ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        {keyboardAvoidingWrappedContent}
      </SafeAreaView>
    );
  }

  return (
    <View style={[styles.safeArea, backgroundStyle]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      {keyboardAvoidingWrappedContent}
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  padding: {
    padding: customTheme.spacing.md,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
}); 