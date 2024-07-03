import { StyleSheet, Text, View,Pressable } from 'react-native'
import React, { useContext } from 'react'
import MyContext from '../context/context'
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


const NoteCard = ({id,title,desc,confirmDelete}) => {
    const {appTheme} = useContext(MyContext);
    const navigation = useNavigation();

  return (
    <View style={styles.noteContainer} key={id}>
    <View style={[styles.header,{backgroundColor:appTheme}]}>
       <Text style={styles.title} ellipsizeMode='end' numberOfLines={1}>{title}</Text>

       <Pressable onPress={() => confirmDelete(id)} style={styles.btnClose} >
        <AntDesign name="close" size={24} color="black" />
        </Pressable>

        </View>
        <Pressable style={styles.content} onPress={() => navigation.navigate('note',{id:id,title:title,desc:desc})}>
           <Text numberOfLines={4}>{desc}</Text>  
        </Pressable>
     
    </View>
  )
}

export default NoteCard

const styles = StyleSheet.create({
noteContainer:{
marginHorizontal:10,
marginVertical:20,
position:'relative',
width:200

},
header:{
padding:10,

},
title:{
    fontSize:20,
    fontWeight:'600',
    width:130
},
content:{
    paddingHorizontal:10,
    paddingVertical:20,
    backgroundColor:'#f1f1f1'
},
btnClose:{
    position:'absolute',
    right:10,
    top:10
}

})