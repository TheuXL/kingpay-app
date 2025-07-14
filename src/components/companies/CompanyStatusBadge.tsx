import React from 'react';
import { StyleSheet } from 'react-native';
import { Chip } from 'react-native-paper';
import { CompanyStatus } from '../../types/company';

interface CompanyStatusBadgeProps {
  status: CompanyStatus;
  size?: 'small' | 'medium' | 'large';
}

export const CompanyStatusBadge: React.FC<CompanyStatusBadgeProps> = ({ 
  status, 
  size = 'medium' 
}) => {
  const getStatusColor = (status: CompanyStatus) => {
    switch (status) {
      case 'approved':
        return { bg: '#E7F5E8', text: '#1B5E20' };
      case 'pending':
        return { bg: '#FFF9C4', text: '#F57F17' };
      case 'rejected':
        return { bg: '#FFEBEE', text: '#B71C1C' };
      case 'blocked':
        return { bg: '#ECEFF1', text: '#263238' };
      default:
        return { bg: '#E0E0E0', text: '#424242' };
    }
  };

  const getStatusLabel = (status: CompanyStatus) => {
    switch (status) {
      case 'approved':
        return 'Aprovado';
      case 'pending':
        return 'Pendente';
      case 'rejected':
        return 'Rejeitado';
      case 'blocked':
        return 'Bloqueado';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const statusColors = getStatusColor(status);
  const label = getStatusLabel(status);
  
  const sizeStyles = {
    small: { height: 20, fontSize: 10 },
    medium: { height: 24, fontSize: 12 },
    large: { height: 28, fontSize: 14 },
  };

  return (
    <Chip
      mode="flat"
      style={[
        styles.chip,
        { backgroundColor: statusColors.bg, height: sizeStyles[size].height }
      ]}
      textStyle={{ 
        color: statusColors.text, 
        fontSize: sizeStyles[size].fontSize 
      }}
    >
      {label}
    </Chip>
  );
};

const styles = StyleSheet.create({
  chip: {
    alignSelf: 'flex-start',
  },
}); 