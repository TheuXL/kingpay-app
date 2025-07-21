import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '../../../components/common/Button';
import { FormInput } from '../../../components/common/FormInput';

interface AuthFormProps {
  onSubmit: (data: { email: string, password: string, name?: string }) => void;
  buttonText: string;
  isSignUp?: boolean;
}

export const AuthForm = ({ onSubmit, buttonText, isSignUp = false }: AuthFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = () => {
    onSubmit({ email, password, name });
  };

  return (
    <View style={styles.container}>
      {isSignUp && (
        <FormInput
          label="Nome Completo"
          value={name}
          onChangeText={setName}
          placeholder="Seu nome completo"
          autoCapitalize="words"
        />
      )}
      <FormInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="seuemail@exemplo.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <FormInput
        label="Senha"
        value={password}
        onChangeText={setPassword}
        placeholder="Sua senha"
        secureTextEntry
      />
      <Button title={buttonText} onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
}); 