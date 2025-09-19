import { View } from 'react-native';
import { Button } from '@/components/ui/Button';
import React from 'react';
import { Href, useRouter } from 'expo-router';

interface Props {
  href: Href;
}

export const ButtonBack = ({ href }: Props) => {
  const router = useRouter();

  return (
    <View
      style={{ width: '100%', alignItems: 'flex-start', paddingBottom: 20 }}
    >
      <Button
        mode={'text'}
        title={'Back'}
        icon={'arrow-left'}
        onPress={() => router.push(href)}
      />
    </View>
  );
};
