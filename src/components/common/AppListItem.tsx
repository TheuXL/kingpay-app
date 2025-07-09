import React from 'react';
import { List } from 'react-native-paper';

type AppListItemProps = React.ComponentProps<typeof List.Item>;

export function AppListItem(props: AppListItemProps) {
  return <List.Item {...props} />;
}

AppListItem.Icon = List.Icon; 