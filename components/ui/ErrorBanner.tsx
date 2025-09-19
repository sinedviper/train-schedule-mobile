import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, IconButton, useTheme } from 'react-native-paper';

interface ErrorBannerProps {
  message: string;
  onDismiss?: () => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({
  message,
  onDismiss,
}) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.errorContainer },
      ]}
    >
      <Text style={[styles.message, { color: theme.colors.onErrorContainer }]}>
        {message}
      </Text>
      {onDismiss && (
        <IconButton
          icon="close"
          onPress={onDismiss}
          iconColor={theme.colors.onErrorContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    margin: 8,
    borderRadius: 8,
  },
  message: {
    flex: 1,
    fontSize: 14,
  },
});
