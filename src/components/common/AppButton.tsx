import React from 'react';
import { Button as PaperButton, ButtonProps } from 'react-native-paper';

type AppButtonProps = ButtonProps;
 
export const AppButton = (props: AppButtonProps) => {
  return <PaperButton {...props} />;
}; 