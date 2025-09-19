import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';

import { TextInput } from '@/components/ui/TextInput';
import { Button } from '@/components/ui/Button';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { registerSchema } from '@/utils/validators';
import { IAuthRegistration } from '@/utils/types';
import { useRegistrationMutation } from '@/store/auth/api';
import { useFormik } from 'formik';
import { useRouter } from 'expo-router';

export default function Register() {
  const router = useRouter();
  const theme = useTheme();
  const [registerUser, { isLoading }] = useRegistrationMutation();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: IAuthRegistration) => {
    try {
      setError(null);
      await registerUser(data).unwrap();
      router.push('/(app)');
    } catch (err: any) {
      setError(err?.message || 'Registration failed');
    }
  };

  const formik = useFormik<IAuthRegistration>({
    validationSchema: registerSchema,
    initialValues: {
      name: '',
      login: '',
      password: '',
      role: 'USER',
    },
    onSubmit,
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.primary }]}>
          Create Account
        </Text>
        <Text style={styles.subtitle}>Sign up to get started</Text>

        {error && (
          <ErrorBanner message={error} onDismiss={() => setError(null)} />
        )}

        <View style={styles.form}>
          <TextInput
            label="Full Name"
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

          <TextInput
            label="Password"
            value={formik.values.password || ''}
            onChangeText={(v) => formik.setFieldValue('password', v)}
            error={!!formik.errors.password}
            helperText={formik.errors.password}
            style={styles.input}
          />

          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Role</Text>
            <Picker
              selectedValue={formik.values.role}
              onValueChange={(v) => formik.setFieldValue('role', v)}
              style={styles.picker}
            >
              <Picker.Item label="User" value="USER" />
              <Picker.Item label="Admin" value="ADMIN" />
            </Picker>
          </View>

          <Button
            title="Sign Up"
            onPress={formik.submitForm}
            loading={isLoading}
            style={styles.button}
          />

          <Button
            title="Already have an account? Sign In"
            onPress={() => router.push('/')}
            mode="text"
            style={styles.linkButton}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    color: '#666',
  },
  form: {
    gap: 16,
  },
  input: {
    marginBottom: 8,
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
  button: {
    marginTop: 16,
  },
  linkButton: {
    marginTop: 8,
  },
});
