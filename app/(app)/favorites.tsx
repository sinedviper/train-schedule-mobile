import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import {
  useGetFavoritesPaginationMutation,
  useGetFavoritesQuery,
  useRemoveFavoriteMutation,
} from '@/store/favorites/api';
import { IFavoriteSchedule, ISchedule } from '@/utils/types';
import { Loading } from '@/components/ui/Loading';
import { Star } from 'lucide-react-native';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import CardSchedule from '@/components/CardSchedule';
import { useAppSelector } from '@/hooks/useRedux';
import { getFavorites } from '@/store/favorites/select';
import { Button } from '@/components/ui/Button';

export default function FavoritesScreen() {
  const { favorites, total } = useAppSelector(getFavorites);

  const [page, setPage] = React.useState(1);
  const [getFavoritesPag, { isLoading: isLoadingPag }] =
    useGetFavoritesPaginationMutation();
  const { isLoading, error, refetch } = useGetFavoritesQuery();
  const [removeFavorite] = useRemoveFavoriteMutation();

  const handleRemoveFavorite = async (schedule: ISchedule) => {
    try {
      await removeFavorite(schedule.id);
    } catch (err) {
      console.error('Error removing favorite:', err);
    }
  };

  const renderFavoriteItem = ({ item }: { item: IFavoriteSchedule }) => {
    return (
      <CardSchedule
        schedule={item.schedule}
        handleStar={handleRemoveFavorite}
        key={item.id}
        isFavorite={true}
      />
    );
  };

  if (isLoading) {
    return <Loading text="Loading favorites..." />;
  }

  return (
    <View style={styles.container}>
      {error?.message && (
        <ErrorBanner message={error.message || 'Failed to load favorites'} />
      )}

      <FlatList
        data={favorites ?? []}
        renderItem={renderFavoriteItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshing={isLoading}
        onRefresh={() => {
          refetch();
          setPage(1);
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Star size={64} color="#e91e63" />
            <Text style={styles.emptyText}>No favorites yet</Text>
            <Text style={styles.emptySubtext}>
              Tap the heart icon on schedules to add them to favorites
            </Text>
          </View>
        }
      />
      <View
        style={{
          padding: 20,
          display: page === total ? 'none' : isLoading ? 'none' : 'flex',
        }}
      >
        <Button
          title={'More'}
          disabled={isLoadingPag}
          loading={isLoadingPag}
          onPress={() => {
            setPage(page + 1);
            getFavoritesPag({ page: page + 1 });
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
