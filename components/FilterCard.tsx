import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { SearchCity } from '@/components/SearchCity';

interface FilterCardProps {
  label: string;
  value: {
    date?: string;
    placeId?: number;
  };
  onChange: (val: { date?: string; placeId?: number }) => void;
}

export const FilterCard = ({ label, value, onChange }: FilterCardProps) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>

      <SearchCity
        value={value.placeId || 0}
        onChange={(v) => onChange({ ...value, placeId: v })}
      />

      <TouchableOpacity
        onPress={() => setDatePickerVisibility(true)}
        style={styles.dateButton}
        activeOpacity={0.8}
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
        style={styles.clear}
        onPress={() => {
          onChange({ ...value, date: undefined });
        }}
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
  label: {
    fontWeight: '600',
    marginBottom: 8,
    fontSize: 16,
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
