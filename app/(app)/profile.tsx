import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Divider, Avatar } from 'react-native-paper';
import { TextInput } from '@/components/ui/TextInput';
import { Button } from '@/components/ui/Button';
import { updateProfileSchema } from '@/utils/validators';
import { useFormik } from 'formik';
import { UpdateProfileDto } from '@/utils/types';
import {
  useGetMeQuery,
  useLogoutMutation,
  useUpdateProfileMutation,
} from '@/store/auth/api';
import { getAuth } from '@/store/auth/select';
import { useAppSelector } from '@/hooks/useRedux';
import { Card } from '@/components/ui/Card';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { useRouter } from 'expo-router';

export default function Profile() {
  const router = useRouter();
  useGetMeQuery();
  const [updateProfile, { isLoading: updating }] = useUpdateProfileMutation();
  const [logout, { isLoading: logouting }] = useLogoutMutation();
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

  const handleLogout = async () => {
    try {
      logout();
      router.dismissAll();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.headerCard}>
        <View style={styles.headerContent}>
          <Avatar.Text
            size={80}
            label={user.name.charAt(0).toUpperCase()}
            style={styles.avatar}
          />
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userLogin}>@{user.login}</Text>
          <Text style={styles.userRole}>{user.role}</Text>
        </View>
      </Card>

      <Card style={styles.formCard}>
        <View style={styles.formContent}>
          <Text style={styles.sectionTitle}>Edit Profile</Text>

          {error && (
            <ErrorBanner message={error} onDismiss={() => setError(null)} />
          )}

          {success && (
            <View
              style={[styles.successBanner, { backgroundColor: '#d4edda' }]}
            >
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

      <Card style={styles.actionsCard}>
        <View style={styles.actionsContent}>
          <Text style={styles.sectionTitle}>Account</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Login:</Text>
            <Text style={styles.infoValue}>{user.login}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Role:</Text>
            <Text style={styles.infoValue}>{user.role}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Member since:</Text>
            <Text style={styles.infoValue}>
              {new Date(user.createdAt).toLocaleDateString()}
            </Text>
          </View>

          <Divider style={styles.divider} />

          <Button
            title="Sign Out"
            onPress={handleLogout}
            mode="outlined"
            loading={logouting}
            style={[styles.logoutButton, { borderColor: '#f44336' }]}
          />
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    backgroundColor: '#f5f5f5',
  },
  headerCard: {
    margin: 16,
    elevation: 2,
  },
  headerContent: {
    padding: 24,
    alignItems: 'center',
  },
  avatar: {
    marginBottom: 16,
    backgroundColor: '#6200EE',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userLogin: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '500',
    textTransform: 'uppercase',
  },
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
  actionsCard: {
    margin: 16,
    marginTop: 0,
    elevation: 2,
  },
  actionsContent: {
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    marginVertical: 16,
  },
  logoutButton: {
    borderWidth: 1,
  },
});
