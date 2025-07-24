import { colors } from '@/theme/colors';
import { Eye, HelpCircle } from 'lucide-react-native';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface HeaderUserProps {
  userName?: string;
  userAvatarUrl?: string;
  onPress?: () => void;
  onToggleVisibility?: () => void;
  onHelpPress?: () => void;
}

const HeaderUser: React.FC<HeaderUserProps> = ({
  userName = 'Usuário',
  userAvatarUrl,
  onPress,
  onToggleVisibility,
  onHelpPress,
}) => {
  const getFirstName = (name: string) => name?.split(' ')[0] || 'Usuário';
  const getInitials = (name: string) => name?.charAt(0).toUpperCase() || 'U';

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.userInfo} onPress={onPress}>
        {userAvatarUrl ? (
          <Image source={{ uri: userAvatarUrl }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarPlaceholderText}>{getInitials(userName)}</Text>
          </View>
        )}
        <Text style={styles.greeting}>
          Olá, <Text style={styles.userName}>{getFirstName(userName)}</Text>!
        </Text>
      </TouchableOpacity>

      <View style={styles.actions}>
        <TouchableOpacity onPress={onToggleVisibility}>
          <Eye color="#52525B" size={26} />
        </TouchableOpacity>
        <TouchableOpacity style={{ marginLeft: 20 }} onPress={onHelpPress}>
          <HelpCircle color="#52525B" size={26} />
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
    paddingHorizontal: 4, // Pequeno padding para não colar nas bordas
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    paddingVertical: 6,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholderText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  greeting: {
    fontSize: 16,
    color: '#3F3F46', // Cinza escuro para o "Olá,"
    marginRight: 12, // Espaço antes do fim do card
  },
  userName: {
    fontWeight: 'bold',
    color: colors.primary,
  },
  actions: {
    flexDirection: 'row',
  },
});

export default HeaderUser; 