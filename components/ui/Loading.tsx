import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';

interface LoadingProps {
  text?: string;
  size?: 'small' | 'large';
}

export const Loading: React.FC<LoadingProps> = ({
  text = 'Loading...',
  size = 'large',
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} />
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    marginTop: 10,
    textAlign: 'center',
  },
});
