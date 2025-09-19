import { IconButton, Text } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import React from 'react';
import { IPlace, ScheduleForm } from '@/utils/types';
import { FormikProps } from 'formik';
import { Button } from '@/components/ui/Button';
import { SearchCity } from '@/components/SearchCity';

interface Props {
  formik: FormikProps<ScheduleForm>;
  index: number;
  places: IPlace[];
}

export const ScheduleCardPoint = ({ formik, index, places }: Props) => {
  const [showDate, setShowDate] = React.useState(false);

  return (
    <View key={index} style={styles.pointContainer}>
      <Text style={styles.pointTitle}>Point {index + 1}</Text>

      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>
          {places.find((v) => v.id === formik.values.points[index].placeId)
            ?.name ?? 'Please select a place'}
        </Text>
        <SearchCity
          value={formik.values.points[index].placeId || 0}
          onChange={(v) => formik.setFieldValue(`points.${index}.placeId`, v)}
        />
      </View>

      <Button
        title={`Arrive date - ${new Date(formik.values.points[index].timeToArrive || new Date()).toLocaleString('ru-RU')}`}
        onPress={() => setShowDate(!showDate)}
      />
      <DateTimePickerModal
        isVisible={showDate}
        mode={'datetime'}
        onConfirm={(v) => {
          formik.setFieldValue(`points.${index}.timeToArrive`, v);
          setShowDate(false);
        }}
        onCancel={() => setShowDate(false)}
        date={new Date(formik.values.points[index].timeToArrive || new Date())}
      />

      {index + 1 > 2 && (
        <IconButton
          icon="delete"
          onPress={() =>
            formik.setFieldValue(
              'points',
              [...formik.values.points].filter((_, key) => key !== index),
            )
          }
          style={styles.deleteButton}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  pickerContainer: {
    marginBottom: 8,
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: '#666',
  },
  picker: {
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  pointContainer: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  pointTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  deleteButton: {
    alignSelf: 'flex-end',
  },
});
