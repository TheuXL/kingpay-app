import React from 'react';
import { Card as PaperCard } from 'react-native-paper';
import { StyleSheet } from 'react-native';

type AppCardProps = React.ComponentProps<typeof PaperCard>;

export function AppCard(props: AppCardProps) {
  return <PaperCard style={styles.card} {...props} />;
}

AppCard.Title = PaperCard.Title;
AppCard.Content = PaperCard.Content;
AppCard.Cover = PaperCard.Cover;
AppCard.Actions = PaperCard.Actions;

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
}); 