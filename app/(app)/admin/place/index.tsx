import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, FAB } from 'react-native-paper';
import { Card } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { useGetPlacesQuery } from '@/store/places/api';
import { IPlace } from '@/utils/types';
import { useRouter } from 'expo-router';
import { ButtonBack } from '@/components/ButtonBack';

export default function PlacesListScreen() {
  const router = useRouter();
  const { data: places, isLoading, error, refetch } = useGetPlacesQuery();

  const renderPlaceItem = ({ item }: { item: IPlace }) => (
    <Card
      style={styles.placeCard}
      onPress={() => router.push(`/(app)/admin/place/${item.id}`)}
    >
      <View style={styles.cardContent}>
        <Text style={styles.placeName}>{item.name}</Text>
      </View>
    </Card>
  );

  if (isLoading) {
    return <Loading text="Loading places..." />;
  }

  return (
    <View style={styles.container}>
      <ButtonBack href={'/(app)/admin'} />
      {error && <ErrorBanner message="Failed to load places" />}

      <FlatList
        data={places?.data ?? []}
        renderItem={renderPlaceItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshing={isLoading}
        onRefresh={refetch}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No places found</Text>
        }
      />

      <FAB
        icon="plus"
        color={'white'}
        style={styles.fab}
        onPress={() => router.push('/(app)/admin/place/create')}
      />
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
  placeCard: {
    marginBottom: 12,
    elevation: 2,
  },
  cardContent: {
    padding: 16,
  },
  placeName: {
    fontSize: 18,
    fontWeight: 'bold',
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
