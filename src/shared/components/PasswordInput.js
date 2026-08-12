import React, { useState } from 'react';
import { TextInput } from 'react-native-paper';

/**
 * Reusable password field with visibility toggle.
 */
const PasswordInput = ({
  value,
  onChangeText,
  activeUnderlineColor,
  style,
  label = 'Password',
  placeholder = 'Password',
}) => {
  const [isHidden, setIsHidden] = useState(true);

  return (
    <TextInput
      mode="contained"
      label={label}
      placeholder={placeholder}
      value={value}
      activeUnderlineColor={activeUnderlineColor}
      secureTextEntry={isHidden}
      onChangeText={onChangeText}
      style={style}
      autoCapitalize="none"
      autoCorrect={false}
      right={
        <TextInput.Icon
          icon={isHidden ? 'eye' : 'eye-off'}
          onPress={() => setIsHidden((prev) => !prev)}
          forceTextInputFocus={false}
        />
      }
    />
  );
};

export default PasswordInput;
