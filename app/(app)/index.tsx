import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, FAB, Chip } from 'react-native-paper';
import { useAppSelector } from '@/hooks/useRedux';
import { getAuth } from '@/store/auth/select';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import {
  useGetSchedulesPaginationMutation,
  useGetSchedulesQuery,
} from '@/store/schedules/api';
import {
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
} from '@/store/favorites/api';
import { ETrainType, ISchedule, IScheduleFilter } from '@/utils/types';
import { Loading } from '@/components/ui/Loading';
import { useRouter } from 'expo-router';
import CardSchedule from '@/components/CardSchedule';
import { getSchedules } from '@/store/schedules/select';
import { Button } from '@/components/ui/Button';
import { FilterCard } from '@/components/FilterCard';

export default function Index() {
  const router = useRouter();
  const { user } = useAppSelector(getAuth);
  const isAdmin = user?.role === 'ADMIN';

  const [filter, setFilter] = useState<IScheduleFilter>({ page: 1 });

  const { schedules, total } = useAppSelector(getSchedules);
  const { isLoading, error, refetch } = useGetSchedulesQuery(filter, {
    refetchOnMountOrArgChange: true,
  });

  const [getSchedulesPagination, { isLoading: isLoadingPag }] =
    useGetSchedulesPaginationMutation();
  const [addFavorite] = useAddFavoriteMutation();
  const [removeFavorite] = useRemoveFavoriteMutation();

  const handleFavoriteToggle = async (schedule: ISchedule) => {
    try {
      if (schedule.isFavorite) {
        await removeFavorite(schedule.id);
      } else {
        await addFavorite({ scheduleId: schedule.id });
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
        isFavorite={item.isFavorite}
        key={item.id}
      />
    );
  };

  if (isLoading) {
    return <Loading text="Loading schedules..." />;
  }

  return (
    <View style={styles.container}>
      <View
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
          paddingBottom: 10,
        }}
      >
        <FilterCard
          value={{ date: filter.startDate, placeId: filter.startPlaceId }}
          onChange={(start) =>
            setFilter({
              ...filter,
              startDate: start.date,
              startPlaceId: start.placeId,
            })
          }
          label={'From'}
        />
        <FilterCard
          value={{ date: filter.endDate, placeId: filter.endPlaceId }}
          onChange={(end) =>
            setFilter({ ...filter, endDate: end.date, endPlaceId: end.placeId })
          }
          label={'To'}
        />
      </View>
      <View style={styles.filterContainer}>
        <Chip
          selected={!filter.type}
          onPress={() => setFilter({ ...filter, type: undefined })}
          style={styles.filterChip}
        >
          All
        </Chip>
        {Object.values(ETrainType).map((type) => (
          <Chip
            key={type}
            selected={filter.type === type}
            onPress={() => setFilter({ ...filter, type: type })}
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
        onRefresh={() => {
          refetch();
          setFilter({ ...filter, page: 1 });
        }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No schedules found</Text>
        }
      />

      <View
        style={{
          padding: 20,
          display: filter.page === total ? 'none' : isLoading ? 'none' : 'flex',
        }}
      >
        <Button
          title={'More'}
          disabled={isLoadingPag}
          loading={isLoadingPag}
          onPress={() => {
            setFilter({ ...filter, page: filter.page + 1 });
            getSchedulesPagination({ ...filter, page: filter.page + 1 });
          }}
        />
      </View>

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
    flex: 1,
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
