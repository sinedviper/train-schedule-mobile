import React, { useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { useSocket } from '@/hooks/useSocket';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppSelector } from '@/hooks/useRedux';

import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { getToken } from '@/store/token/select';

export const AppContent = () => {
  const router = useRouter();
  useSocket();

  const { access, refresh } = useAppSelector(getToken);

  useEffect(() => {
    if (access) {
      router.push('/(app)');
    } else {
      router.dismissAll();
    }
  }, [access, router]);

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
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={!refresh}>
          <Stack.Screen name={'index'} options={{ gestureEnabled: false }} />
          <Stack.Screen name={'register'} options={{ gestureEnabled: false }} />
        </Stack.Protected>
        <Stack.Protected guard={!!refresh}>
          <Stack.Screen name={'(app)'} options={{ gestureEnabled: false }} />
        </Stack.Protected>
      </Stack>
      <Toast />
    </SafeAreaView>
  );
};
