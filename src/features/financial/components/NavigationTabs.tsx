import { colors } from '@/theme/colors';
import { FileText, Key, Package, Send } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const TABS = [
  { id: 'extrato', label: 'Extrato', icon: <FileText size={18} /> },
  { id: 'antecipacoes', label: 'Antecipações', icon: <Package size={18} /> },
  { id: 'transferencias', label: 'Transferências', icon: <Send size={18} /> },
  { id: 'chaves_pix', label: 'Chaves Pix', icon: <Key size={18} /> },
];

interface NavigationTabsProps {
  activeTab: string;
  onTabPress: (tabId: string) => void;
}

const NavigationTabs: React.FC<NavigationTabsProps> = ({ activeTab, onTabPress }) => {
  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = React.cloneElement(tab.icon, {
            color: isActive ? colors.white : colors.primary,
          });

          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, isActive ? styles.activeTab : styles.inactiveTab]}
              onPress={() => onTabPress(tab.id)}
            >
              {Icon}
              <Text style={[styles.tabText, isActive ? styles.activeTabText : styles.inactiveTabText]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  inactiveTab: {
    backgroundColor: '#EEF2FF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  activeTabText: {
    color: colors.white,
  },
  inactiveTabText: {
    color: colors.primary,
  },
});

export default NavigationTabs; 