import { Card } from '@/components/ui/Card';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { TextInput } from '@/components/ui/TextInput';
import { Button } from '@/components/ui/Button';
import React, { useState } from 'react';
import { useUpdatePasswordMutation } from '@/store/auth/api';
import { UpdatePasswordProfileDto } from '@/utils/types';
import { FormikHelpers, useFormik } from 'formik';
import { updatePasswordProfile } from '@/utils/validators';

export const UpdatePasswordProfile = () => {
  const [updatePassword, { isLoading: updating }] = useUpdatePasswordMutation();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onSubmit = async (
    data: UpdatePasswordProfileDto,
    formik: FormikHelpers<UpdatePasswordProfileDto>,
  ) => {
    try {
      setError(null);
      setSuccess(null);
      await updatePassword(data).unwrap();
      formik.resetForm({ values: { oldPassword: '', newPassword: '' } });
      setSuccess('Password updated successfully');
    } catch (err: any) {
      setError(err?.message || 'Failed to update password');
    }
  };

  const formik = useFormik<UpdatePasswordProfileDto>({
    validationSchema: updatePasswordProfile,
    initialValues: {
      oldPassword: '',
      newPassword: '',
    },
    onSubmit,
  });

  return (
    <Card style={styles.formCard}>
      <View style={styles.formContent}>
        <Text style={styles.sectionTitle}>Security</Text>

        {error && (
          <ErrorBanner message={error} onDismiss={() => setError(null)} />
        )}

        {success && (
          <View style={[styles.successBanner, { backgroundColor: '#d4edda' }]}>
            <Text style={{ color: '#155724' }}>{success}</Text>
          </View>
        )}

        <TextInput
          label="Old password"
          value={formik.values.oldPassword || ''}
          onChangeText={(v) => formik.setFieldValue('oldPassword', v)}
          error={!!formik.errors.oldPassword}
          helperText={formik.errors.oldPassword}
          style={styles.input}
        />

        <TextInput
          label="New password"
          value={formik.values.newPassword || ''}
          onChangeText={(v) => formik.setFieldValue('newPassword', v)}
          error={!!formik.errors.newPassword}
          helperText={formik.errors.newPassword}
          style={styles.input}
        />

        <Button
          title="Update Password"
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
