import { View, Text } from 'react-native';
import { Button } from '@/components/ui/Button';
import React from 'react';
import { useRouter } from 'expo-router';

export default function Admin() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
          marginBottom: 30,
          textAlign: 'center',
        }}
      >
        Admin Panel
      </Text>
      <Button
        title="Manage Places"
        onPress={() => router.push('/(app)/admin/place')}
      />
    </View>
  );
}
