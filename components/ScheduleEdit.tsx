import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Text } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';

import { useRouter } from 'expo-router';
import { useGetPlacesQuery } from '@/store/places/api';
import {
  useCreateScheduleMutation,
  useDeleteScheduleMutation,
  useGetScheduleQuery,
  useUpdateScheduleMutation,
} from '@/store/schedules/api';
import { FormikHelpers, useFormik } from 'formik';
import { scheduleSchema } from '@/utils/validators';
import { CreateScheduleDto, ETrainType, ScheduleForm } from '@/utils/types';
import { Loading } from '@/components/ui/Loading';
import { Card } from '@/components/ui/Card';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { Button } from '@/components/ui/Button';
import { ScheduleCardPoint } from '@/components/ScheduleCardPoint';
import { ButtonBack } from '@/components/ButtonBack';

interface Props {
  mode?: 'create' | 'edit';
  scheduleId?: number;
}

export function ScheduleEdit({ mode = 'create', scheduleId }: Props) {
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);

  const { data: places, isLoading: placesLoading } = useGetPlacesQuery();
  const { data: schedule, isLoading: scheduleLoading } = useGetScheduleQuery(
    scheduleId!,
    { skip: mode === 'create' },
  );

  const [createSchedule, { isLoading: creating }] = useCreateScheduleMutation();
  const [updateSchedule, { isLoading: updating }] = useUpdateScheduleMutation();
  const [deleteSchedule, { isLoading: deleting }] = useDeleteScheduleMutation();

  const onSubmit = async (
    data: ScheduleForm,
    formikHelper: FormikHelpers<ScheduleForm>,
  ) => {
    try {
      setError(null);

      const formattedData: CreateScheduleDto = {
        type: data.type,
        points: data.points.map((point) => ({
          placeId: point.placeId,
          timeToArrive: point.timeToArrive.toISOString(),
        })),
      };

      if (mode === 'create') {
        await createSchedule(formattedData).unwrap();
      } else if (scheduleId) {
        await updateSchedule({ id: scheduleId, data: formattedData }).unwrap();
      }

      formikHelper.resetForm({
        values: {
          type: 'EXPRESS',
          points: [
            { placeId: 0, timeToArrive: new Date() },
            { placeId: 0, timeToArrive: new Date() },
          ],
        },
      });

      router.back();
    } catch (err: any) {
      setError(err?.message || `Failed to ${mode} schedule`);
    }
  };

  const formik = useFormik<ScheduleForm>({
    validationSchema: scheduleSchema,
    initialValues: {
      type: 'EXPRESS',
      points: [
        { placeId: 0, timeToArrive: new Date() },
        { placeId: 0, timeToArrive: new Date() },
      ],
    },
    onSubmit,
  });

  useEffect(() => {
    if (mode === 'edit' && schedule) {
      formik.resetForm({
        values: {
          type: schedule.type,
          points: [...schedule.points]
            .sort(
              (a, b) =>
                new Date(a.timeToArrive).getTime() -
                new Date(b.timeToArrive).getTime(),
            )
            .map((point) => ({
              placeId: point.placeId,
              timeToArrive: new Date(point.timeToArrive),
            })),
        },
      });
    }
  }, [schedule, mode]);

  const handleDelete = () => {
    Alert.alert(
      'Delete Schedule',
      'Are you sure you want to delete this schedule?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              if (scheduleId) {
                await deleteSchedule(scheduleId).unwrap();
                router.back();
              }
            } catch (err: any) {
              setError(err.data?.message || 'Failed to delete schedule');
            }
          },
        },
      ],
    );
  };

  if (placesLoading || (mode === 'edit' && scheduleLoading)) {
    return <Loading text="Loading..." />;
  }

  const isLoading = creating || updating || deleting;

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <View style={styles.cardContent}>
          <ButtonBack href={'/(app)'} />

          <Text style={styles.title}>
            {mode === 'create' ? 'Create Schedule' : 'Edit Schedule'}
          </Text>

          {error && (
            <ErrorBanner message={error} onDismiss={() => setError(null)} />
          )}

          <View style={styles.form}>
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Train</Text>
              <Picker
                selectedValue={formik.values.type}
                onValueChange={(v) => formik.setFieldValue('type', v)}
                style={styles.picker}
              >
                <Picker.Item label="Select a train" value={0} />
                {Object.values(ETrainType).map((train) => (
                  <Picker.Item key={train} label={train} value={train} />
                ))}
              </Picker>
              {formik.errors.type && (
                <Text style={styles.errorText}>{formik.errors.type}</Text>
              )}
            </View>

            <Text style={styles.sectionTitle}>Route Points</Text>

            {formik.values.points.map((_, index) => (
              <ScheduleCardPoint
                key={index}
                formik={formik}
                index={index}
                places={places ?? []}
              />
            ))}

            <Button
              title="Add Point"
              onPress={() =>
                formik.setFieldValue('points', [
                  ...formik.values.points,
                  { place: '', timeToArrive: '' },
                ])
              }
              mode="outlined"
              style={styles.addButton}
            />

            <View style={styles.buttonContainer}>
              <Button
                title={mode === 'create' ? 'Create' : 'Update'}
                onPress={formik.submitForm}
                loading={isLoading}
                style={styles.primaryButton}
              />

              {mode === 'edit' && (
                <Button
                  title="Delete"
                  onPress={handleDelete}
                  mode="outlined"
                  loading={isLoading}
                  style={[
                    styles.deleteScheduleButton,
                    { borderColor: '#f44336' },
                  ]}
                />
              )}
            </View>
          </View>
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
  card: {
    margin: 16,
    elevation: 2,
  },
  cardContent: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  form: {
    gap: 16,
  },
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
  errorText: {
    color: '#f44336',
    fontSize: 12,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  addButton: {
    marginTop: 8,
  },
  buttonContainer: {
    gap: 12,
    marginTop: 16,
  },
  primaryButton: {
    backgroundColor: '#6200EE',
  },
  deleteScheduleButton: {
    borderWidth: 1,
  },
});
