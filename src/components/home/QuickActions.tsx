import { Landmark, Link, Repeat, Wallet } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ActionButton = ({ icon: Icon, label, width }: { icon: React.ElementType, label: string, width?: number }) => (
    <TouchableOpacity style={[styles.actionItem, {width: width || 76}]}>
        <View style={styles.iconContainer}>
            <Icon color="#1313F2" size={32} />
        </View>
        <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
);


const QuickActions = () => {
  return (
    <View style={styles.container}>
        <ActionButton icon={Wallet} label="Carteira" />
        <ActionButton icon={Repeat} label="Transações" width={78} />
        <ActionButton icon={Link} label="Link de Pagamento" />
        <ActionButton icon={Landmark} label="Área Pix" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'flex-start',
  },
  actionItem: {
    alignItems: 'center',
    gap: 10,
  },
  iconContainer: {
    width: 76,
    height: 76,
    borderRadius: 109.25,
    backgroundColor: '#F9FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontFamily: 'Inter',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 21,
    color: '#00051B',
    textAlign: 'center',
  },
});

export default QuickActions;
