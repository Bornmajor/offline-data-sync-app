import React, { useCallback, useLayoutEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Pressable, Image } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons, Entypo } from '@expo/vector-icons';
import { Button, Modal, Portal, TextInput } from 'react-native-paper';
import NoteCard from '../components/NoteCard';
import Loader from '../../../shared/components/Loader';
import useNotesStore from '../store/useNotesStore';

/**
 * Settings icon used in the home screen header.
 * @param {{ onPress: () => void }} props - Button props.
 */
const SettingsButton = ({ onPress }) => (
  <Pressable style={{ margin: 10 }} onPress={onPress}>
    <Ionicons name="settings" size={30} color="white" />
  </Pressable>
);

/**
 * Builds the right-side header action for the home screen.
 * @param {import('@react-navigation/native').NavigationProp<ReactNavigation.RootParamList>} navigation - Navigation object used to open settings.
 * @returns {React.ReactElement}
 */
const renderSettingsHeaderRight = (navigation) => (
  <SettingsButton onPress={() => navigation.navigate('settings')} />
);

/**
 * Home screen that lists notes and opens the note composer.
 */
const Home = () => {
  const navigation = useNavigation();
  const appTheme = useNotesStore((state) => state.appTheme);
  const hasInternet = useNotesStore((state) => state.hasInternet);
  const usrMail = useNotesStore((state) => state.usrMail);
  const isLoading = useNotesStore((state) => state.isLoading);
  const notes = useNotesStore((state) => state.notes);
  const watchNotes = useNotesStore((state) => state.watchNotes);
  const createNote = useNotesStore((state) => state.createNote);

  const [noteTitle, setNoteTitle] = useState('');
  const [visible, setVisible] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => renderSettingsHeaderRight(navigation),
    });
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      const unsubscribe = watchNotes(usrMail);
      return () => {
        if (typeof unsubscribe === 'function') {
          unsubscribe();
        }
      };
    }, [usrMail, watchNotes]),
  );

  /** Opens the create-note modal. */
  const showModal = () => setVisible(true);
  /** Closes the create-note modal. */
  const hideModal = () => setVisible(false);
  const containerStyle = {
    backgroundColor: 'white',
    paddingVertical: 50,
    paddingHorizontal: 20,
    borderRadius: 10,
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Portal>
            <Modal
              visible={visible}
              onDismiss={hideModal}
              contentContainerStyle={containerStyle}
              style={{ margin: 20, borderRadius: 10 }}
            >
              <View style={{ flexDirection: 'row' }}>
                <Image
                  source={require('../../../assets/images/yellow-dots.png')}
                  style={{ marginHorizontal: 10 }}
                />
                <Text style={{ fontSize: 25, fontWeight: '600', marginBottom: 20 }}>
                  Create title
                </Text>
              </View>

              <TextInput
                mode="outlined"
                activeOutlineColor={appTheme}
                value={noteTitle}
                onChangeText={(t) => setNoteTitle(t)}
              />
              <Button
                mode="contained"
                buttonColor={appTheme}
                textColor="black"
                labelStyle={{ fontSize: 18 }}
                style={{ marginVertical: 30, borderRadius: 8 }}
                onPress={async () => {
                  await createNote(noteTitle, '...');
                  setNoteTitle('');
                  hideModal();
                }}
              >
                ADD
              </Button>
            </Modal>
          </Portal>

          {notes.length !== 0 ? (
            <>
              <View style={{ flexDirection: 'row', alignItems: 'center', margin: 5 }}>
                <Entypo
                  name="dot-single"
                  size={40}
                  color={hasInternet ? 'green' : '#a3a2a2'}
                />
                <Text style={{ fontSize: 20, color: hasInternet ? 'green' : '#a3a2a2' }}>
                  {hasInternet ? 'Online' : 'Offline'}
                </Text>
              </View>

              <FlatList
                contentContainerStyle={styles.container}
                columnWrapperStyle={styles.column}
                data={notes}
                renderItem={({ item }) => (
                  <NoteCard id={item.id} title={item.title} desc={item.description} />
                )}
                keyExtractor={(item) => item.id}
                numColumns={2}
              />
            </>
          ) : (
            <Image
              source={require('../../../assets/images/notes-bro.png')}
              style={styles.coverImg}
            />
          )}

          <Button
            icon="plus"
            mode="contained"
            buttonColor={appTheme}
            style={styles.createNote}
            labelStyle={{ fontSize: 20 }}
            contentStyle={{ fontSize: 18 }}
            onPress={showModal}
          >
            Create Note
          </Button>
        </>
      )}
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingBottom: 40,
  },
  column: {
    justifyContent: 'space-between',
  },
  createNote: {
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    marginHorizontal: 20,
    marginVertical: 50,
  },
  coverImg: {
    width: 300,
    height: 400,
    marginTop: 100,
    marginBottom: 50,
    alignSelf: 'center',
    justifyContent: 'center',
  },
});
