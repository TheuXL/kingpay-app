import React from 'react';
import { StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle, useColorScheme } from 'react-native';
import { customTheme } from '../../theme/theme';

// Definição de tipos para os subcomponentes
interface AppCardTitleProps {
  children: React.ReactNode;
  style?: TextStyle;
}

interface AppCardContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

// Interface principal com subcomponentes
export interface AppCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  elevation?: number;
}

// Extendendo a interface do componente principal para incluir os subcomponentes
export interface AppCardComponent extends React.FC<AppCardProps> {
  Title: React.FC<AppCardTitleProps>;
  Content: React.FC<AppCardContentProps>;
}

export const AppCard = (({
  children,
  style,
  onPress,
  elevation = 2,
}: AppCardProps) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const cardStyles = [
    styles.card,
    {
      backgroundColor: isDark ? customTheme.colors.card.dark : customTheme.colors.card.light,
      shadowOpacity: isDark ? 0.3 : 0.1,
      elevation: elevation,
    },
    style,
  ];
  
  if (onPress) {
    return (
      <TouchableOpacity style={cardStyles} onPress={onPress} activeOpacity={0.7}>
        {children}
      </TouchableOpacity>
    );
  }
  
  return <View style={cardStyles}>{children}</View>;
}) as unknown as AppCardComponent;

// Add Title sub-component
AppCard.Title = ({ children, style }: AppCardTitleProps) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  return (
    <Text
      style={[
        styles.title,
        {
          color: isDark ? customTheme.colors.text.primary.dark : customTheme.colors.text.primary.light,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

// Add Content sub-component
AppCard.Content = ({ children, style }: AppCardContentProps) => {
  return (
    <View style={[styles.content, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8,
  },
  content: {
    marginTop: 4,
  },
}); 