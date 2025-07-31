import { Bell, ChevronRight, Eye } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const HeaderUser = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.userButton}>
        <Text style={styles.greetingText}>
          Olá, <Text style={styles.userName}>Gabriel!</Text>
        </Text>
        <ChevronRight size={20} color="#1A1AFF" />
      </TouchableOpacity>
      <View style={styles.rightSection}>
        <TouchableOpacity style={styles.iconButton}>
          <Eye size={24} color="#6B6B6B" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Bell size={24} color="#6B6B6B" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20
  },
  userButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 4,
  },
  greetingText: {
    fontSize: 16,
    color: '#6B6B6B',
    marginRight: 4,
  },
  userName: {
    fontWeight: 'bold',
    color: '#1A1AFF',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 4,
  },
});

export default HeaderUser;
