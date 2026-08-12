import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import useNotesStore from '../../features/notes/store/useNotesStore';

/**
 * Shared loading state used across screens.
 * @param {{ msg?: string, fallbackMsg?: string }} props - Optional message and fallback text shown below the spinner.
 */
const Loader = ({ msg, fallbackMsg = 'Loading...' }) => {
  const appTheme = useNotesStore((state) => state.appTheme);
  const normalized = typeof msg === 'string' ? msg.trim() : '';
  const displayMsg = normalized.length > 0 ? normalized : fallbackMsg;

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/notedly.png')} style={styles.logo} />
      <ActivityIndicator animating={true} color={appTheme} />
      {displayMsg ? (
        <Text style={{ fontSize: 18, fontWeight: '500', marginTop: 10, textAlign: 'center' }}>
          {displayMsg}
        </Text>
      ) : null}
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    alignContent: 'center',
  },
  logo: {
    width: 180,
    height: 150,
  },
});
