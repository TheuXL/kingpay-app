import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Card, Divider, Text, useTheme } from 'react-native-paper';
import { TopProduto } from '../../types';

interface TopProdutosListProps {
  produtos: TopProduto[];
  isLoading: boolean;
}

export const TopProdutosList: React.FC<TopProdutosListProps> = ({
  produtos,
  isLoading,
}) => {
  const theme = useTheme();

  const renderItem = ({ item, index }: { item: TopProduto; index: number }) => {
    // Gerar uma cor com base no índice
    const colors = [theme.colors.primary, '#00C853', '#FF6D00', '#2979FF', '#AA00FF'];
    const color = colors[index % colors.length];

    return (
      <View style={styles.itemContainer}>
        <View style={styles.rankContainer}>
          <Text style={[styles.rankText, { color }]}>{index + 1}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{item.nome}</Text>
          <Text style={styles.price}>
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(item.preco)}
          </Text>
        </View>
        <View style={styles.statsContainer}>
          <Text style={styles.totalValue}>
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(item.total_vendido)}
          </Text>
          <Text style={styles.totalCount}>
            {item.quantidade_vendida} vendas
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
        <View style={styles.infoContainer}>
          <View style={[styles.loadingText, { width: '80%' }]} />
          <View style={[styles.loadingText, { width: '40%' }]} />
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
      <Card.Title title="Top Produtos" />
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
            data={produtos.slice(0, 5)}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <Divider style={styles.divider} />}
            ListEmptyComponent={() => (
              <Text style={styles.emptyText}>Nenhum produto encontrado</Text>
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
  infoContainer: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
  },
  price: {
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
  loadingText: {
    height: 14,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginVertical: 4,
  },
}); 