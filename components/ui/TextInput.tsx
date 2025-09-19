import React from 'react';
import { Text, TextInput as PaperTextInput } from 'react-native-paper';
import { KeyboardTypeOptions, StyleProp, TextStyle, View } from 'react-native';

interface TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
  numberOfLines?: number;
  style?: StyleProp<TextStyle>;
  disabled?: boolean;
  placeholder?: string;
  helperText?: string;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  value,
  onChangeText,
  error = false,
  secureTextEntry = false,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  style,
  disabled = false,
  placeholder,
  helperText,
}) => {
  return (
    <View style={{ flexDirection: 'column', gap: 10, width: '100%' }}>
      <PaperTextInput
        label={label}
        value={value}
        onChangeText={onChangeText}
        error={error}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
        style={style}
        disabled={disabled}
        mode="outlined"
        placeholder={placeholder}
      />
      {helperText && <Text>{helperText}</Text>}
    </View>
  );
};
