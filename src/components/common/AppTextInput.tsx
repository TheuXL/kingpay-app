import React from 'react';
import { TextInput as PaperTextInput } from 'react-native-paper';
import { StyleSheet } from 'react-native';

type AppTextInputProps = React.ComponentProps<typeof PaperTextInput>;

export function AppTextInput(props: AppTextInputProps) {
  return <PaperTextInput mode="outlined" {...props} />;
}

AppTextInput.Icon = PaperTextInput.Icon;

const styles = StyleSheet.create({
  input: {
    marginBottom: 16,
  },
}); 