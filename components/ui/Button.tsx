import React from 'react';
import { Button as PaperButton } from 'react-native-paper';
import { StyleProp, ViewStyle } from 'react-native';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';

interface ButtonProps {
  title: string;
  onPress: () => void;
  mode?: 'text' | 'outlined' | 'contained';
  disabled?: boolean;
  loading?: boolean;
  icon?: IconSource;
  style?: StyleProp<ViewStyle>;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  mode = 'contained',
  disabled = false,
  loading = false,
  icon,
  style,
}) => {
  return (
    <PaperButton
      mode={mode}
      onPress={onPress}
      disabled={disabled}
      loading={loading}
      icon={icon}
      style={style}
    >
      {title}
    </PaperButton>
  );
};
