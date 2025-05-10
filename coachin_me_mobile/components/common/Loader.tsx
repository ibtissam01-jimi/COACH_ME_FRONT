import React from 'react';
import { ActivityIndicator, StyleSheet, View, Text } from 'react-native';
import Colors from '../../constants/colors';

interface LoaderProps {
  text?: string;
}

const Loader: React.FC<LoaderProps> = ({ text }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary} />
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  text: {
    marginTop: 16,
    color: Colors.text,
    fontSize: 16,
  },
});

export default Loader;