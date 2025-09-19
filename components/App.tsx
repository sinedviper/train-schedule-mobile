import React, { useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { useSocket } from '@/hooks/useSocket';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppSelector } from '@/hooks/useRedux';
import { getAuth } from '@/store/auth/select';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export const AppContent = () => {
  const router = useRouter();
  useSocket();

  const { isAuthenticated } = useAppSelector(getAuth);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(app)');
    }
  }, [isAuthenticated, router]);

  return (
    <SafeAreaView
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#f5f5f5',
      }}
      edges={['top', 'right', 'left']}
    >
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} initialRouteName={'index'}>
        <Stack.Screen name="index" options={{ gestureEnabled: false }} />
        <Stack.Screen name={'(app)'} options={{ gestureEnabled: false }} />
      </Stack>
      <Toast />
    </SafeAreaView>
  );
};
