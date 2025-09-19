import { Card } from '@/components/ui/Card';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { TextInput } from '@/components/ui/TextInput';
import { Button } from '@/components/ui/Button';
import React, { useEffect, useState } from 'react';
import { useUpdateProfileMutation } from '@/store/auth/api';
import { useAppSelector } from '@/hooks/useRedux';
import { getAuth } from '@/store/auth/select';
import { UpdateProfileDto } from '@/utils/types';
import { useFormik } from 'formik';
import { updateProfileSchema } from '@/utils/validators';

export const UpdateProfile = () => {
  const [updateProfile, { isLoading: updating }] = useUpdateProfileMutation();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { user } = useAppSelector(getAuth);

  const onSubmit = async (data: UpdateProfileDto) => {
    try {
      setError(null);
      setSuccess(null);
      await updateProfile(data).unwrap();
      setSuccess('Profile updated successfully');
    } catch (err: any) {
      setError(err?.message || 'Failed to update profile');
    }
  };

  const formik = useFormik<UpdateProfileDto>({
    validationSchema: updateProfileSchema,
    initialValues: {
      name: user?.name || '',
      login: user?.login || '',
    },
    onSubmit,
  });

  useEffect(() => {
    if (user) {
      formik.resetForm({ values: { name: user.name, login: user.login } });
    }
  }, [user]);

  return (
    <Card style={styles.formCard}>
      <View style={styles.formContent}>
        <Text style={styles.sectionTitle}>Edit Profile</Text>

        {error && (
          <ErrorBanner message={error} onDismiss={() => setError(null)} />
        )}

        {success && (
          <View style={[styles.successBanner, { backgroundColor: '#d4edda' }]}>
            <Text style={{ color: '#155724' }}>{success}</Text>
          </View>
        )}

        <TextInput
          label="Name"
          value={formik.values.name || ''}
          onChangeText={(v) => formik.setFieldValue('name', v)}
          error={!!formik.errors.name}
          helperText={formik.errors.name}
          style={styles.input}
        />

        <TextInput
          label="Login"
          value={formik.values.login || ''}
          onChangeText={(v) => formik.setFieldValue('login', v)}
          error={!!formik.errors.login}
          helperText={formik.errors.login}
          style={styles.input}
        />

        <Button
          title="Update Profile"
          onPress={formik.submitForm}
          loading={updating}
          style={styles.updateButton}
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  formCard: {
    margin: 16,
    marginTop: 0,
    elevation: 2,
  },
  formContent: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  successBanner: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  updateButton: {
    backgroundColor: '#6200EE',
  },
});
