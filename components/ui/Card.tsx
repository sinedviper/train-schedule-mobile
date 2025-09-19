import React from 'react';
import { Card as PaperCard } from 'react-native-paper';
import { StyleProp, ViewStyle } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  elevation?: number;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  elevation = 2,
}) => {
  const CardComponent = onPress ? PaperCard : PaperCard;

  return (
    <CardComponent style={style} onPress={onPress} elevation={elevation as any}>
      {children}
    </CardComponent>
  );
};
