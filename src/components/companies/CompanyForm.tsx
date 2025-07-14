import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, HelperText, TextInput } from 'react-native-paper';
import { Company, CompanyAddress, CompanyLegalRepresentative, CreateCompanyPayload } from '../../types/company';

// Custom interface for the form data
interface CompanyFormData {
  name: string;
  tax_id: string;
  email: string;
  phone: string;
  website: string;
  logo_url: string;
  address: CompanyAddress;
  legal_representative: CompanyLegalRepresentative;
}

interface CompanyFormProps {
  initialData?: Partial<Company>;
  onSubmit: (data: CreateCompanyPayload) => void;
  isLoading: boolean;
}

export const CompanyForm: React.FC<CompanyFormProps> = ({
  initialData = {},
  onSubmit,
  isLoading,
}) => {
  const [formData, setFormData] = useState<CompanyFormData>({
    name: initialData.name || '',
    tax_id: initialData.tax_id || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    website: initialData.website || '',
    logo_url: initialData.logo_url || '',
    address: initialData.address || {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'Brasil',
    },
    legal_representative: initialData.legal_representative || {
      name: '',
      email: '',
      phone: '',
      tax_id: '',
      birth_date: '',
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error when field is updated
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleAddressChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address!,
        [field]: value,
      },
    }));
    
    // Clear error when field is updated
    const errorKey = `address.${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const handleRepresentativeChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      legal_representative: {
        ...prev.legal_representative!,
        [field]: value,
      },
    }));
    
    // Clear error when field is updated
    const errorKey = `legal_representative.${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Required fields validation
    if (!formData.name?.trim()) {
      newErrors.name = 'Nome da empresa é obrigatório';
    }
    
    if (!formData.tax_id?.trim()) {
      newErrors.tax_id = 'CNPJ/CPF é obrigatório';
    } else if (!/^\d{11}$|^\d{14}$/.test(formData.tax_id.replace(/[^\d]/g, ''))) {
      newErrors.tax_id = 'CNPJ/CPF inválido';
    }
    
    if (!formData.email?.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Convert formData to CreateCompanyPayload format
      const payload: CreateCompanyPayload = {
        name: formData.name,
        cnpj: formData.tax_id,
        email: formData.email,
        phone: formData.phone,
        // Convert address object to string or handle as needed by your API
        address: JSON.stringify(formData.address),
        city: formData.address.city,
        state: formData.address.state,
        postal_code: formData.address.postal_code,
        logo: formData.logo_url,
      };
      
      onSubmit(payload);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Informações Básicas" />
        <Card.Content>
          <TextInput
            label="Nome da Empresa *"
            value={formData.name}
            onChangeText={(value) => handleChange('name', value)}
            style={styles.input}
            error={!!errors.name}
          />
          {errors.name && <HelperText type="error">{errors.name}</HelperText>}

          <TextInput
            label="CNPJ/CPF *"
            value={formData.tax_id}
            onChangeText={(value) => handleChange('tax_id', value)}
            style={styles.input}
            error={!!errors.tax_id}
            keyboardType="numeric"
          />
          {errors.tax_id && <HelperText type="error">{errors.tax_id}</HelperText>}

          <TextInput
            label="E-mail *"
            value={formData.email}
            onChangeText={(value) => handleChange('email', value)}
            style={styles.input}
            error={!!errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email && <HelperText type="error">{errors.email}</HelperText>}

          <TextInput
            label="Telefone"
            value={formData.phone}
            onChangeText={(value) => handleChange('phone', value)}
            style={styles.input}
            keyboardType="phone-pad"
          />

          <TextInput
            label="Website"
            value={formData.website}
            onChangeText={(value) => handleChange('website', value)}
            style={styles.input}
            keyboardType="url"
            autoCapitalize="none"
          />

          <TextInput
            label="URL do Logo"
            value={formData.logo_url}
            onChangeText={(value) => handleChange('logo_url', value)}
            style={styles.input}
            keyboardType="url"
            autoCapitalize="none"
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Endereço" />
        <Card.Content>
          <TextInput
            label="Rua"
            value={formData.address?.street}
            onChangeText={(value) => handleAddressChange('street', value)}
            style={styles.input}
          />

          <View style={styles.row}>
            <TextInput
              label="Número"
              value={formData.address?.number}
              onChangeText={(value) => handleAddressChange('number', value)}
              style={[styles.input, styles.halfInput]}
              keyboardType="numeric"
            />
            <TextInput
              label="Complemento"
              value={formData.address?.complement}
              onChangeText={(value) => handleAddressChange('complement', value)}
              style={[styles.input, styles.halfInput]}
            />
          </View>

          <TextInput
            label="Bairro"
            value={formData.address?.neighborhood}
            onChangeText={(value) => handleAddressChange('neighborhood', value)}
            style={styles.input}
          />

          <View style={styles.row}>
            <TextInput
              label="Cidade"
              value={formData.address?.city}
              onChangeText={(value) => handleAddressChange('city', value)}
              style={[styles.input, styles.halfInput]}
            />
            <TextInput
              label="Estado"
              value={formData.address?.state}
              onChangeText={(value) => handleAddressChange('state', value)}
              style={[styles.input, styles.halfInput]}
            />
          </View>

          <TextInput
            label="CEP"
            value={formData.address?.postal_code}
            onChangeText={(value) => handleAddressChange('postal_code', value)}
            style={styles.input}
            keyboardType="numeric"
          />

          <TextInput
            label="País"
            value={formData.address?.country}
            onChangeText={(value) => handleAddressChange('country', value)}
            style={styles.input}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Representante Legal" />
        <Card.Content>
          <TextInput
            label="Nome"
            value={formData.legal_representative?.name}
            onChangeText={(value) => handleRepresentativeChange('name', value)}
            style={styles.input}
          />

          <TextInput
            label="E-mail"
            value={formData.legal_representative?.email}
            onChangeText={(value) => handleRepresentativeChange('email', value)}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            label="Telefone"
            value={formData.legal_representative?.phone}
            onChangeText={(value) => handleRepresentativeChange('phone', value)}
            style={styles.input}
            keyboardType="phone-pad"
          />

          <TextInput
            label="CPF"
            value={formData.legal_representative?.tax_id}
            onChangeText={(value) => handleRepresentativeChange('tax_id', value)}
            style={styles.input}
            keyboardType="numeric"
          />

          <TextInput
            label="Data de Nascimento"
            value={formData.legal_representative?.birth_date}
            onChangeText={(value) => handleRepresentativeChange('birth_date', value)}
            style={styles.input}
            placeholder="YYYY-MM-DD"
          />
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={handleSubmit}
        style={styles.submitButton}
        loading={isLoading}
        disabled={isLoading}
      >
        {initialData.id ? 'Atualizar' : 'Criar'} Empresa
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  submitButton: {
    marginTop: 16,
    marginBottom: 32,
  },
}); 