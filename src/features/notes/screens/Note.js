import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Loader from '../../../shared/components/Loader';
import useNotesStore from '../../notes/store/useNotesStore';

/**
 * Note editor screen.
 * @param {{ route: { params: { id: string, title: string, desc: string } } }} props - React Navigation route params.
 */
const Note = ({ route }) => {
  const { id, title, desc } = route.params;
  const isLoading = useNotesStore((state) => state.isLoading);
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

    editNote(id, title, textContext);
  }, [id, title, textContext, editNote]);

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
