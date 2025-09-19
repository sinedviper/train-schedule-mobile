import PlaceEdit from '@/components/PlaceEdit';
import { useLocalSearchParams } from 'expo-router';

export default function Place() {
  const { placeId } = useLocalSearchParams();

  return <PlaceEdit mode={'edit'} placeId={+placeId} />;
}
