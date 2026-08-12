import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, TextInput } from 'react-native-paper';
import Loader from '../../../shared/components/Loader';
import PasswordInput from '../../../shared/components/PasswordInput';
import useNotesStore from '../../notes/store/useNotesStore';
import logger from '../../../shared/utils/logger';

/**
 * Registration screen for creating a new account.
 */
const Register = () => {
  const navigation = useNavigation();
  const appTheme = useNotesStore((state) => state.appTheme);
  const showFeedback = useNotesStore((state) => state.showFeedback);
  const isLoading = useNotesStore((state) => state.isLoading);
  const register = useNotesStore((state) => state.register);
  const hasInternet = useNotesStore((state) => state.hasInternet);

  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

  const submitRegistration = async () => {
    if (email === '') {
      showFeedback('Email required');
    } else if (pwd === '') {
      showFeedback('Password required');
    } else if (!passwordRegex.test(pwd)) {
      showFeedback(
        'Password must be at least 8 characters and include a letter, number, and special character',
      );
    } else if (!emailRegex.test(email)) {
      showFeedback('Email not valid');
    } else {
      logger.log('Submitting registration form', { email });
      await register(email, pwd);
      setPwd('');
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Loader msg={hasInternet === false ? 'No internet connection' : 'Creating account...'} />
      ) : (
        <>
          <Image source={require('../../../assets/images/notedly.png')} style={styles.logo} />
          <Text style={styles.title}>CREATE ACCOUNT</Text>

          <View style={{ width: '100%', marginHorizontal: 10 }}>
            <TextInput
              mode="contained"
              label="Email"
              placeholder="Email address"
              activeUnderlineColor={appTheme}
              style={styles.inputText}
              value={email}
              onChangeText={(t) => setEmail(t)}
              autoCapitalize="none"
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
              onPress={submitRegistration}
            >
              REGISTER
            </Button>

            <Pressable onPress={() => navigation.navigate('login')}>
              <Text style={styles.switchText}>Already have an account? Login</Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
};

export default Register;

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
    marginBottom: 10,
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
