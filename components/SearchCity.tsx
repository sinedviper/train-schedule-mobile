import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { IPlace } from '@/utils/types';
import { useGetPlacesSearchMutation } from '@/store/places/api';

interface Props {
  value: number;
  onChange: (val?: number) => void;
}

export const SearchCity = ({ value, onChange }: Props) => {
  const [query, setQuery] = useState('');
  const refSearch = useRef<string>('');
  const [places, setPlaces] = useState<IPlace[]>([]);

  const [getPlaces] = useGetPlacesSearchMutation();

  const clearSearch = () => {
    setPlaces([]);
    setQuery('');
    onChange(undefined);
  };

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
    <View style={{ width: '100%', paddingBottom: 10 }}>
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
        <View style={{ maxHeight: 150 }}>
          {places.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.placeItem}
              onPress={() => {
                onChange(item.id);
                setPlaces([]);
                setQuery(item.name);
              }}
            >
              <Text>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <TouchableOpacity
        style={styles.clear}
        onPress={clearSearch}
        activeOpacity={0.8}
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
  clear: {
    textAlign: 'center',
    paddingVertical: 3,
    alignItems: 'center',
    width: '100%',
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
});
