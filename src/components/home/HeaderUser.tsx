import { Bell, ChevronRight, Eye } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const HeaderUser = () => {
  return (
    <View style={styles.topBar}>
      <TouchableOpacity style={styles.greetingContainer}>
        <Text style={styles.greetingText}>Olá, Gabriel</Text>
        <ChevronRight color="#1313F2" size={20} />
      </TouchableOpacity>
      <View style={styles.iconsContainer}>
        <TouchableOpacity style={styles.iconWrapper}>
          <Eye color="#00051B" size={28} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconWrapper}>
          <Bell color="#00051B" size={28} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    // gap: 104, //  Handled by space-between
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F9FAFC',
    borderRadius: 56,
    // height: 54, // auto-height
    // width: 162, // auto-width
    gap: 10,
  },
  greetingText: {
    fontFamily: 'Inter',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 24, // 150% de 16px
    letterSpacing: -0.16, // -0.01em
    color: '#00051B',
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrapper: {
    width: 54,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 114.136, // highly rounded
  },
});

export default HeaderUser;
