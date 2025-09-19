import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Text } from 'react-native-paper';
import { ArrowLeft, Star } from 'lucide-react-native';
import { formatTime } from '@/utils/date';
import React from 'react';
import { ISchedule } from '@/utils/types';
import { useRouter } from 'expo-router';

interface Props {
  schedule: ISchedule;
  handleStar: (id: number) => void;
  isFavorite?: boolean;
}

export default function CardSchedule({
  schedule,
  handleStar,
  isFavorite,
}: Props) {
  const router = useRouter();
  const firstPoint = schedule.points[0];
  const lastPoint = schedule.points[schedule.points.length - 1];

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => router.push(`/(app)/admin/schedules/${schedule.id}`)}
      key={schedule.id}
    >
      <Card style={styles.favoriteCard}>
        <View style={styles.cardContent}>
          <View style={styles.headerRow}>
            <Text style={styles.trainName}>{schedule.type}</Text>
            <Star
              size={24}
              color={isFavorite ? '#e91e63' : '#ccc'}
              onPress={() => handleStar(schedule.id)}
            />
          </View>

          <View style={styles.routeInfo}>
            <View style={styles.pointInfo}>
              <Text style={styles.pointTime}>
                {formatTime(firstPoint.timeToArrive)}
              </Text>
              <Text style={styles.pointName}>{firstPoint.place.name}</Text>
            </View>

            <ArrowLeft size={20} color="#666" />

            <View style={styles.pointInfo}>
              <Text style={styles.pointTime}>
                {formatTime(lastPoint.timeToArrive)}
              </Text>
              <Text style={styles.pointName}>{lastPoint.place.name}</Text>
            </View>
          </View>

          <Text style={styles.pointsCount}>{schedule.points.length} stops</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  favoriteCard: {
    marginBottom: 12,
    elevation: 2,
  },
  cardContent: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
    gap: 20,
  },
  trainName: {
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: '#6200EE30',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    color: '#6200EE',
  },
  trainType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  routeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  pointInfo: {
    flex: 1,
    alignItems: 'center',
  },
  pointTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  pointName: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  pointsCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});
