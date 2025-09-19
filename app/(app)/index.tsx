import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, FAB, Chip } from 'react-native-paper';
import { useAppSelector } from '@/hooks/useRedux';
import { getAuth } from '@/store/auth/select';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { useGetSchedulesQuery } from '@/store/schedules/api';
import {
  useAddFavoriteMutation,
  useGetFavoritesQuery,
  useRemoveFavoriteMutation,
} from '@/store/favorites/api';
import { ETrainType, ISchedule, IScheduleFilter } from '@/utils/types';
import { Loading } from '@/components/ui/Loading';
import { useRouter } from 'expo-router';
import CardSchedule from '@/components/CardSchedule';
import { getSchedules } from '@/store/schedules/select';

export default function Index() {
  const router = useRouter();
  const { user } = useAppSelector(getAuth);
  const isAdmin = user?.role === 'ADMIN';

  const [filter, setFilter] = useState<IScheduleFilter>({});

  const { schedules } = useAppSelector(getSchedules);
  const { isLoading, error, refetch } = useGetSchedulesQuery(filter);
  const { data: favorites } = useGetFavoritesQuery();
  const [addFavorite] = useAddFavoriteMutation();
  const [removeFavorite] = useRemoveFavoriteMutation();

  const favoriteScheduleIds = new Set(
    favorites?.map((f) => f.scheduleId) || [],
  );

  const handleFavoriteToggle = async (scheduleId: number) => {
    try {
      if (favoriteScheduleIds.has(scheduleId)) {
        await removeFavorite(scheduleId);
      } else {
        await addFavorite({ scheduleId });
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const renderScheduleItem = ({ item }: { item: ISchedule }) => {
    return (
      <CardSchedule
        schedule={item}
        handleStar={handleFavoriteToggle}
        isFavorite={favoriteScheduleIds.has(item.id)}
        key={item.id}
      />
    );
  };

  if (isLoading) {
    return <Loading text="Loading schedules..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <Chip
          selected={!filter.trainType}
          onPress={() => setFilter({ ...filter, trainType: undefined })}
          style={styles.filterChip}
        >
          All
        </Chip>
        {Object.values(ETrainType).map((type) => (
          <Chip
            key={type}
            selected={filter.trainType === type}
            onPress={() => setFilter({ ...filter, trainType: type })}
            style={styles.filterChip}
          >
            {type}
          </Chip>
        ))}
      </View>

      {error?.message && <ErrorBanner message={error.message} />}

      <FlatList
        data={schedules}
        renderItem={renderScheduleItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshing={isLoading}
        onRefresh={refetch}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No schedules found</Text>
        }
      />

      {isAdmin && (
        <FAB
          icon="plus"
          color={'white'}
          style={styles.fab}
          onPress={() => router.push('/(app)/admin/schedules/create')}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 8,
    flexWrap: 'wrap',
  },
  filterChip: {
    marginRight: 8,
  },
  listContainer: {
    padding: 16,
    paddingTop: 8,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 32,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200EE',
  },
});
