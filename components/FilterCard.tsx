import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useGetPlacesSearchMutation } from '@/store/places/api';
import { IPlace } from '@/utils/types';

interface FilterCardProps {
  label: string;
  value: {
    date?: string;
    placeId?: number;
  };
  onChange: (val: { date?: string; placeId?: number }) => void;
}

export const FilterCard = ({ label, value, onChange }: FilterCardProps) => {
  const [query, setQuery] = useState('');
  const refSearch = useRef<string>('');
  const [places, setPlaces] = useState<IPlace[]>([]);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const [getPlaces] = useGetPlacesSearchMutation();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (refSearch.current.length >= 2) {
        getPlaces({ search: refSearch.current })
          .unwrap()
          .then((res) => {
            setPlaces(res.data);
          });
      } else {
        setPlaces([]);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [refSearch.current]);

  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        value={query}
        onChangeText={(v) => {
          setQuery(v);
          refSearch.current = v;
        }}
        placeholder="Enter place"
        style={styles.input}
      />

      {places.length > 0 && (
        <FlatList
          keyboardShouldPersistTaps="handled"
          data={places}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.placeItem}
              onPress={() => {
                onChange({ ...value, placeId: item.id });
                setPlaces([]);
                setQuery(item.name);
              }}
            >
              <Text>{item.name}</Text>
            </TouchableOpacity>
          )}
          style={{ maxHeight: 150 }}
        />
      )}

      <TouchableOpacity
        onPress={() => setDatePickerVisibility(true)}
        style={styles.dateButton}
      >
        <Text>
          {value.date
            ? new Date(value.date).toLocaleString('ru-RU')
            : 'Choose date'}
        </Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={(date) => {
          setDatePickerVisibility(false);
          onChange({
            ...value,
            date: new Date(
              date.getFullYear(),
              date.getMonth(),
              date.getDate(),
              0,
              0,
            ).toISOString(),
          });
        }}
        onCancel={() => setDatePickerVisibility(false)}
      />
      <TouchableOpacity
        style={styles.placeItem}
        onPress={() => {
          onChange({ ...value, placeId: undefined, date: undefined });
          setPlaces([]);
          setQuery('');
        }}
      >
        <Text>Clear</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontWeight: '600',
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  placeItem: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dateButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
    alignItems: 'center',
  },
});
