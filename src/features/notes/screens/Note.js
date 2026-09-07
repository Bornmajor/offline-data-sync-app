import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Loader from '../../../shared/components/Loader';
import useNotesStore from '../../notes/store/useNotesStore';
import useAuthStore from '../../auth/store/useAuthStore';
import useUiStore from '../../../shared/store/useUiStore';

/**
 * Note editor screen.
 * @param {{ route: { params: { id: string, title: string, desc: string } } }} props - React Navigation route params.
 */
const Note = ({ route }) => {
  const { id, title, desc } = route.params;
  const isLoading = useUiStore((state) => state.isLoading);
  const usrId = useAuthStore((state) => state.usrId);
  const editNote = useNotesStore((state) => state.editNote);
  const navigation = useNavigation();
  const [textContext, setTextContext] = useState('');
  const isInitialRender = useRef(true);

  useEffect(() => {
    setTextContext(desc);
  }, [desc]);

  useEffect(() => {
    navigation.setOptions({ title });
  }, [navigation, title]);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    editNote(usrId, id, title, textContext);
  }, [usrId, id, title, textContext, editNote]);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Loader />
      ) : (
        <TextInput
          style={styles.textArea}
          value={textContext}
          onChangeText={(t) => setTextContext(t)}
          multiline
        />
      )}
    </View>
  );
};

export default Note;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  textArea: {
    paddingHorizontal: 10,
    marginTop: 20,
    textAlignVertical: 'top',
  },
});
