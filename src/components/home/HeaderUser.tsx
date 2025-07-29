import { Eye, HelpCircle } from 'lucide-react-native';
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
            {/* O design não especifica iniciais, então deixamos o placeholder azul */}
          </View>
        )}
        <View>
          <Text style={styles.greetingText}>
            Olá, <Text style={styles.userName}>{userName}!</Text>
          </Text>
        </View>
      </View>
      <View style={styles.icons}>
        <TouchableOpacity style={styles.iconButton}>
          <Eye size={24} color="#333333" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <HelpCircle size={24} color="#333333" />
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12, // Cantos arredondados
    marginBottom: 24, // Espaçamento inferior
    // Sombra
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 5,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22, // Circular
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    backgroundColor: '#1A1AFF', // Placeholder azul
  },
  greetingText: {
    fontSize: 16,
    color: '#6B6B6B', // Cinza escuro
  },
  userName: {
    fontWeight: 'bold',
    color: '#1A1AFF', // Azul vibrante
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 20,
  },
});

export default HeaderUser; 