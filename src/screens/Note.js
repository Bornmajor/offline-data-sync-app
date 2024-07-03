import { StyleSheet, Text, View,TextInput } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import MyContext from '../context/context';
import Loader from '../components/Loader';
import { useNavigation } from '@react-navigation/native';
import database from '@react-native-firebase/database';

const Note = ({route}) => {
  
  const {id,title,desc} = route.params;
  const {isLoading} = useContext(MyContext);
  const navigation = useNavigation();

  const [textContext,setTextContext] = useState('');

  useEffect(() =>{
  setTextContext(desc);
  },[])

  useEffect(()=>{
    navigation.setOptions({
      title:title
    })
  },[navigation]);

  const updateNote = async (id, updatedDescription) => {
    const noteRef = database().ref(`/notes/${id}`);
    await noteRef.update({ title: title, description: updatedDescription });
   

   
  };

  useEffect(()=>{
  updateNote(id,textContext);
  },[textContext])
  
  
  return (
    <View style={styles.container}>
      {isLoading ? 
      <Loader />
      :
      <TextInput 
      style={styles.textArea}
      value={textContext}
      onChangeText={(t) => setTextContext(t)}
      multiline
      
      />
      }
 
      
      
    </View>
  )
}

export default Note

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'white',
 
  },
  textArea:{
    paddingHorizontal:10,
    marginTop:20,
    textAlignVertical: 'top',
    // flex:1,
    // justifyContent:'flex-start'
  }
})