import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import Colors from '../../constants/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  type?: 'primary' | 'secondary' | 'outline' | 'text';
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  type = 'primary',
  style,
  textStyle,
  disabled = false,
  loading = false,
}) => {
  const getButtonStyle = () => {
    switch (type) {
      case 'primary':
        return [
          styles.button,
          styles.primaryButton,
          disabled && styles.disabledButton,
          style,
        ];
      case 'secondary':
        return [
          styles.button,
          styles.secondaryButton,
          disabled && styles.disabledButton,
          style,
        ];
      case 'outline':
        return [
          styles.button,
          styles.outlineButton,
          disabled && styles.disabledOutlineButton,
          style,
        ];
      case 'text':
        return [styles.textButton, disabled && styles.disabledTextButton, style];
      default:
        return [
          styles.button,
          styles.primaryButton,
          disabled && styles.disabledButton,
          style,
        ];
    }
  };

  const getTextStyle = () => {
    switch (type) {
      case 'primary':
        return [styles.buttonText, styles.primaryButtonText, textStyle];
      case 'secondary':
        return [styles.buttonText, styles.secondaryButtonText, textStyle];
      case 'outline':
        return [styles.buttonText, styles.outlineButtonText, textStyle];
      case 'text':
        return [styles.buttonText, styles.textButtonText, textStyle];
      default:
        return [styles.buttonText, styles.primaryButtonText, textStyle];
    }
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={type === 'outline' || type === 'text' ? Colors.primary : Colors.white}
          size="small"
        />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: Colors.primary,
  },
  secondaryButton: {
    backgroundColor: Colors.secondary,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  textButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
  },
  disabledButton: {
    backgroundColor: Colors.textTertiary,
  },
  disabledOutlineButton: {
    borderColor: Colors.textTertiary,
  },
  disabledTextButton: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  primaryButtonText: {
    color: Colors.white,
  },
  secondaryButtonText: {
    color: Colors.white,
  },
  outlineButtonText: {
    color: Colors.primary,
  },
  textButtonText: {
    color: Colors.primary,
  },
});

export default Button;