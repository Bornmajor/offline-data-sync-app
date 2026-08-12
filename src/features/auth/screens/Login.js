import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, TextInput } from 'react-native-paper';
import Loader from '../../../shared/components/Loader';
import PasswordInput from '../../../shared/components/PasswordInput';
import useNotesStore from '../../notes/store/useNotesStore';
import logger from '../../../shared/utils/logger';

/**
 * Login screen for existing users.
 */
const Login = () => {
  const navigation = useNavigation();
  const appTheme = useNotesStore((state) => state.appTheme);
  const showFeedback = useNotesStore((state) => state.showFeedback);
  const isLoading = useNotesStore((state) => state.isLoading);
  const setIsLoading = useNotesStore((state) => state.setIsLoading);
  const login = useNotesStore((state) => state.login);
  const hasInternet = useNotesStore((state) => state.hasInternet);

  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  useEffect(() => {
    if (hasInternet === false) {
      setIsLoading(true);
      return;
    }

    setIsLoading(false);
  }, [hasInternet, setIsLoading]);

  /**
   * Validates the form and submits login request.
   */
  const submitFormData = async () => {
    if (email === '') {
      showFeedback('Email required');
    } else if (pwd === '') {
      showFeedback('Password required');
    } else if (!emailRegex.test(email)) {
      showFeedback('Email not valid');
    } else {
      logger.log('Submitting login form', { email });
      await login(email, pwd);
      setPwd('');
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Loader msg={hasInternet === false ? 'No internet connection' : 'Signing in...'} />
      ) : (
        <>
          <Image source={require('../../../assets/images/notedly.png')} style={styles.logo} />
          <Text style={styles.title}>NOTEDLY APP</Text>

          <View style={{ width: '100%', marginHorizontal: 10 }}>
            <TextInput
              mode="contained"
              label="Email"
              placeholder="Email address"
              activeUnderlineColor={appTheme}
              style={styles.inputText}
              value={email}
              autoCapitalize="none"
              onChangeText={(t) => setEmail(t)}
            />
            <PasswordInput
              value={pwd}
              onChangeText={(t) => setPwd(t)}
              activeUnderlineColor={appTheme}
              style={styles.inputText}
            />
            <Button
              mode="contained"
              style={styles.actionBtn}
              buttonColor={appTheme}
              labelStyle={{ fontSize: 20 }}
              onPress={submitFormData}
            >
              LOGIN
            </Button>

            <Pressable onPress={() => navigation.navigate('register')}>
              <Text style={styles.switchText}>No account? Register</Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  logo: {
    width: 280,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  inputText: {
    margin: 10,
  },
  actionBtn: {
    marginHorizontal: 10,
    marginVertical: 20,
    borderRadius: 8,
  },
  switchText: {
    textAlign: 'center',
    color: '#333',
    fontWeight: '500',
  },
});
