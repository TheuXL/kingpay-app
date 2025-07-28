import { colors } from '@/theme/colors';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface HeaderUserProps {
  userName: string;
  userPhoto?: string;
}

const HeaderUser: React.FC<HeaderUserProps> = ({ userName, userPhoto }) => {
  const getInitials = (name: string) => name?.charAt(0).toUpperCase() || 'U';

  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        {userPhoto ? (
          <Image source={{ uri: userPhoto }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarPlaceholderText}>
              {getInitials(userName)}
            </Text>
          </View>
        )}
        <Text style={styles.userName}>Olá, {userName}!</Text>
      </View>
      <View style={styles.icons}>
        <TouchableOpacity style={styles.iconButton}>
          <Feather name='bell' size={24} color={colors.gray} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Feather name='settings' size={24} color={colors.gray} />
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
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: colors.white,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholderText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 16,
  },
});

export default HeaderUser; 