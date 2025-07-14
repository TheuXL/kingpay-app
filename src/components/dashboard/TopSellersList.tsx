import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Avatar, Card, Divider, Text, useTheme } from 'react-native-paper';
import { TopSeller } from '../../types';

interface TopSellersListProps {
  sellers: TopSeller[];
  isLoading: boolean;
}

export const TopSellersList: React.FC<TopSellersListProps> = ({
  sellers,
  isLoading,
}) => {
  const theme = useTheme();

  const renderItem = ({ item, index }: { item: TopSeller; index: number }) => {
    // Gerar uma cor com base no índice para os avatares
    const colors = [theme.colors.primary, '#00C853', '#FF6D00', '#2979FF', '#AA00FF'];
    const color = colors[index % colors.length];
    
    // Obter as iniciais do nome para o avatar
    const initials = item.nome
      .split(' ')
      .map((n: string) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

    return (
      <View style={styles.itemContainer}>
        <View style={styles.rankContainer}>
          <Text style={[styles.rankText, { color }]}>{index + 1}</Text>
        </View>
        <Avatar.Text 
          size={40} 
          label={initials} 
          style={[styles.avatar, { backgroundColor: color }]} 
        />
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{item.nome}</Text>
          <Text style={styles.email}>{item.email}</Text>
        </View>
        <View style={styles.statsContainer}>
          <Text style={styles.totalValue}>
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(item.total_vendas)}
          </Text>
          <Text style={styles.totalCount}>
            {item.quantidade_vendas} vendas
          </Text>
        </View>
      </View>
    );
  };

  const renderLoadingItem = ({ index }: { index: number }) => {
    return (
      <View style={styles.itemContainer}>
        <View style={styles.rankContainer}>
          <Text style={styles.rankText}>{index + 1}</Text>
        </View>
        <View style={[styles.avatar, styles.loadingAvatar]} />
        <View style={styles.infoContainer}>
          <View style={[styles.loadingText, { width: '80%' }]} />
          <View style={[styles.loadingText, { width: '60%' }]} />
        </View>
        <View style={styles.statsContainer}>
          <View style={[styles.loadingText, { width: '70%' }]} />
          <View style={[styles.loadingText, { width: '50%' }]} />
        </View>
      </View>
    );
  };

  return (
    <Card style={styles.card}>
      <Card.Title title="Top Vendedores" />
      <Card.Content style={styles.content}>
        {isLoading ? (
          <FlatList
            data={Array(5).fill(0)}
            keyExtractor={(_, index) => `loading-${index}`}
            renderItem={renderLoadingItem}
            ItemSeparatorComponent={() => <Divider style={styles.divider} />}
            scrollEnabled={false}
          />
        ) : (
          <FlatList
            data={sellers.slice(0, 5)}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <Divider style={styles.divider} />}
            ListEmptyComponent={() => (
              <Text style={styles.emptyText}>Nenhum vendedor encontrado</Text>
            )}
            scrollEnabled={false}
          />
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
  },
  content: {
    paddingHorizontal: 0,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  rankContainer: {
    width: 24,
    alignItems: 'center',
    marginRight: 8,
  },
  rankText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  avatar: {
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
  },
  email: {
    fontSize: 12,
    opacity: 0.7,
  },
  statsContainer: {
    alignItems: 'flex-end',
  },
  totalValue: {
    fontWeight: 'bold',
  },
  totalCount: {
    fontSize: 12,
    opacity: 0.7,
  },
  divider: {
    marginHorizontal: 16,
  },
  emptyText: {
    textAlign: 'center',
    padding: 16,
    opacity: 0.7,
  },
  loadingAvatar: {
    backgroundColor: '#e0e0e0',
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  loadingText: {
    height: 14,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginVertical: 4,
  },
}); 