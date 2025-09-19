import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Text } from 'react-native-paper';
import {
  useCreatePlaceMutation,
  useDeletePlaceMutation,
  useGetPlaceQuery,
  useUpdatePlaceMutation,
} from '@/store/places/api';
import { FormikHelpers, useFormik } from 'formik';
import { CreatePlaceDto } from '@/utils/types';
import { placeSchema } from '@/utils/validators';
import { useRouter } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { Button } from '@/components/ui/Button';
import { TextInput } from '@/components/ui/TextInput';
import { ButtonBack } from '@/components/ButtonBack';

interface Props {
  mode?: 'create' | 'edit';
  placeId?: number;
}

export default function PlaceEdit({ mode = 'create', placeId }: Props) {
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);

  const { data: place } = useGetPlaceQuery(placeId!, {
    skip: mode === 'create',
  });

  const [createPlace, { isLoading: creating }] = useCreatePlaceMutation();
  const [updatePlace, { isLoading: updating }] = useUpdatePlaceMutation();
  const [deletePlace, { isLoading: deleting }] = useDeletePlaceMutation();

  const onSubmit = async (
    data: CreatePlaceDto,
    formikHelpers: FormikHelpers<CreatePlaceDto>,
  ) => {
    try {
      setError(null);

      if (mode === 'create') {
        await createPlace(data).unwrap();
      } else if (placeId) {
        await updatePlace({ id: placeId, data }).unwrap();
      }

      formikHelpers.resetForm({ values: { name: '' } });

      router.back();
    } catch (err: any) {
      setError(err.data?.message || `Failed to ${mode} place`);
    }
  };

  const formik = useFormik<CreatePlaceDto>({
    validationSchema: placeSchema,
    initialValues: {
      name: '',
    },
    onSubmit,
  });

  useEffect(() => {
    if (mode === 'edit' && place) {
      formik.resetForm({
        values: {
          name: place?.name,
        },
      });
    }
  }, [place, mode]);

  const handleDelete = () => {
    Alert.alert('Delete Place', 'Are you sure you want to delete this place?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            if (placeId) {
              await deletePlace(placeId).unwrap();
              router.back();
            }
          } catch (err: any) {
            setError(err.data?.message || 'Failed to delete place');
          }
        },
      },
    ]);
  };

  const isLoading = creating || updating || deleting;

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <View style={styles.cardContent}>
          <ButtonBack href={'/(app)/admin/place'} />
          <Text style={styles.title}>
            {mode === 'create' ? 'Create Place' : 'Edit Place'}
          </Text>

          {error && (
            <ErrorBanner message={error} onDismiss={() => setError(null)} />
          )}

          <View style={styles.form}>
            <TextInput
              label="Place Name"
              value={formik.values.name}
              onChangeText={(v) => formik.setFieldValue('name', v)}
              error={!!formik.errors.name}
              helperText={formik.errors.name}
              style={styles.input}
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
                  style={[styles.deleteButton, { borderColor: '#f44336' }]}
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
  input: {
    marginBottom: 8,
  },
  buttonContainer: {
    gap: 12,
    marginTop: 16,
  },
  primaryButton: {
    backgroundColor: '#6200EE',
  },
  deleteButton: {
    borderWidth: 1,
  },
});
