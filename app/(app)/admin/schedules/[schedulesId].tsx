import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Chip } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { getAuth } from '@/store/auth/select';
import { useGetScheduleQuery } from '@/store/schedules/api';
import {
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
} from '@/store/favorites/api';
import { Loading } from '@/components/ui/Loading';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatDateTime } from '@/utils/date';
import { ButtonBack } from '@/components/ButtonBack';
import { Star } from 'lucide-react-native';

export default function ScheduleDetailsScreen() {
  const router = useRouter();
  const { schedulesId } = useLocalSearchParams();

  const { user } = useSelector(getAuth);
  const isAdmin = user?.role === 'ADMIN';

  const {
    data: schedule,
    isLoading,
    error,
  } = useGetScheduleQuery(+schedulesId);
  const [addFavorite] = useAddFavoriteMutation();
  const [removeFavorite] = useRemoveFavoriteMutation();

  const handleFavoriteToggle = async () => {
    try {
      if (schedule?.isFavorite) {
        await removeFavorite(+schedulesId);
      } else {
        await addFavorite({ scheduleId: +schedulesId });
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  if (isLoading) {
    return <Loading text="Loading schedule details..." />;
  }

  if (error || !schedule) {
    return (
      <View style={styles.container}>
        <ErrorBanner message="Failed to load schedule details" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.headerCard}>
        <View style={styles.headerContent}>
          <ButtonBack href={'/(app)'} />
          <View style={styles.titleRow}>
            <Chip style={styles.typeChip}>{schedule.type}</Chip>
            <Star
              color={schedule.isFavorite ? '#e91e63' : '#ccc'}
              onPress={handleFavoriteToggle}
            />
          </View>

          {isAdmin && (
            <Button
              title="Edit Schedule"
              onPress={() =>
                router.push(`/(app)/admin/schedules/edit/${schedule.id}`)
              }
              icon="pencil"
              style={styles.editButton}
            />
          )}
        </View>
      </Card>

      <Card style={styles.routeCard}>
        <View style={styles.routeContent}>
          <Text style={styles.sectionTitle}>Route Details</Text>

          {[...schedule.points]
            ?.sort(
              (a, b) =>
                new Date(a.timeToArrive).getTime() -
                new Date(b.timeToArrive).getTime(),
            )
            .map((point, index) => (
              <View key={point.id} style={styles.pointContainer}>
                <View style={styles.timelineContainer}>
                  <View
                    style={[
                      styles.timelineDot,
                      index === 0 && styles.firstDot,
                      index === schedule.points.length - 1 && styles.lastDot,
                    ]}
                  />
                  {index < schedule.points.length - 1 && (
                    <View style={styles.timelineLine} />
                  )}
                </View>

                <View style={styles.pointDetails}>
                  <Text style={styles.pointTime}>
                    {formatDateTime(point.timeToArrive)}
                  </Text>
                  <Text style={styles.pointPlace}>{point.place.name}</Text>
                </View>
              </View>
            ))}
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerCard: {
    margin: 16,
    elevation: 2,
  },
  headerContent: {
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  trainName: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  typeChip: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  editButton: {
    marginTop: 8,
  },
  routeCard: {
    margin: 16,
    marginTop: 0,
    elevation: 2,
  },
  routeContent: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  pointContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineContainer: {
    alignItems: 'center',
    marginRight: 16,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2196F3',
    marginBottom: 8,
  },
  firstDot: {
    backgroundColor: '#4CAF50',
  },
  lastDot: {
    backgroundColor: '#f44336',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#ddd',
    marginTop: -8,
  },
  pointDetails: {
    flex: 1,
  },
  pointTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 4,
  },
  pointPlace: {
    fontSize: 16,
    color: '#333',
  },
});
