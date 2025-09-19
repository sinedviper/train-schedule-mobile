import { useLocalSearchParams } from 'expo-router';
import { ScheduleEdit } from '@/components/ScheduleEdit';

export default function Edit() {
  const { schedulesId } = useLocalSearchParams();

  return <ScheduleEdit scheduleId={+schedulesId} mode={'edit'} />;
}
