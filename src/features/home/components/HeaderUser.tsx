import { Bell, ChevronRight, Eye, HelpCircle } from 'lucide-react-native';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface HeaderUserProps {
  userName: string;
  userPhoto?: string;
}

const HeaderUser: React.FC<HeaderUserProps> = ({ userName, userPhoto }) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <View style={styles.avatarContainer}>
          {userPhoto ? (
            <Image source={{ uri: userPhoto }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>{userName[0]?.toUpperCase()}</Text>
            </View>
          )}
        </View>
        <Text style={styles.greetingText}>
          Olá, <Text style={styles.userName}>{userName}!</Text>
        </Text>
      </View>
      <View style={styles.rightSection}>
        <TouchableOpacity style={styles.iconButton}>
          <Eye size={20} color="#6B6B6B" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <HelpCircle size={20} color="#6B6B6B" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navigationButton}>
          <ChevronRight size={20} color="#6B6B6B" />
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
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 4,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1A1AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  greetingText: {
    fontSize: 18,
    color: '#6B6B6B',
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
    padding: 8,
  },
  navigationButton: {
    padding: 8,
  },
});

export default HeaderUser; 