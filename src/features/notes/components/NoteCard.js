import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import useNotesStore from '../store/useNotesStore';
import useAuthStore from '../../auth/store/useAuthStore';
import useUiStore from '../../../shared/store/useUiStore';
import { confirmAction } from '../../../shared/feedback/confirmDialog';

/**
 * Compact note preview card.
 * @param {{ id: string, title: string, desc: string }} props - Note data for the card.
 */
const NoteCard = ({ id, title, desc }) => {
  const appTheme = useUiStore((state) => state.appTheme);
  const usrId = useAuthStore((state) => state.usrId);
  const removeNote = useNotesStore((state) => state.removeNote);
  const navigation = useNavigation();

  /** Asks the user to confirm, then deletes the note. */
  const handleDelete = async () => {
    const confirmed = await confirmAction({
      title: 'Delete Confirmation',
      message: 'Are you sure you want to delete this item?',
      confirmLabel: 'Delete',
      destructive: true,
    });

    if (confirmed) {
      await removeNote(usrId, id);
    }
  };

  return (
    <View style={styles.noteContainer}>
      <View style={[styles.header, { backgroundColor: appTheme }]}> 
        <Text style={styles.title} ellipsizeMode="end" numberOfLines={1}>
          {title}
        </Text>

        <Pressable onPress={handleDelete} style={styles.btnClose}>
          <AntDesign name="close" size={24} color="black" />
        </Pressable>
      </View>
      <Pressable style={styles.content} onPress={() => navigation.navigate('note', { id, title, desc })}>
        <Text numberOfLines={4}>{desc}</Text>
      </Pressable>
    </View>
  );
};

export default NoteCard;

const styles = StyleSheet.create({
  noteContainer: {
    width: '48%',
    marginVertical: 10,
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
  },
  header: {
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    paddingRight: 34,
    flexShrink: 1,
  },
  content: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    backgroundColor: '#f1f1f1',
  },
  btnClose: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
});
