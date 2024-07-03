import { StyleSheet, Text, View,ScrollView,FlatList,Pressable,Image } from 'react-native'
import React, { useContext, useEffect,useState,useCallback } from 'react'
import NoteCard from '../components/NoteCard'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons';
import firebase from '@react-native-firebase/app';
import database from '@react-native-firebase/database';
import { Button,TextInput  } from 'react-native-paper';
import MyContext from '../context/context';
import { Portal,Modal } from 'react-native-paper';
import { Entypo } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import Loader from '../components/Loader';


const Home = () => {

  const navigation = useNavigation();
  const [users, setUsers] = useState([]);
  const {appTheme,hasInternet,confirmDelete,usrMail,isLogin,isLoading,setIsLoading} = useContext(MyContext);
  const [noteTitle,setNoteTitle] = useState('');
  const [notes, setNotes] = useState([]);
  const [n,setN] = useState("");
  const [fetchTrigger, setFetchTrigger] = useState(false); // New state to control fetch

  useEffect(() => {
    // Enable offline persistence


    if(isLogin){
        database().setPersistenceEnabled(true); 
      }
     

    const usersRef = database().ref('/users');
    const onUsersValueChange = usersRef.on('value', snapshot => {
      const data = snapshot.val();
      if (data) {
        const usersList = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setUsers(usersList);
      } else {
        setUsers([]);
      }
    });

    const notesRef = database().ref('/notes');

    const notesQuery = notesRef.orderByChild('email').equalTo(usrMail);
    const onNotesValueChange = notesQuery.on('value', snapshot => {
      const data = snapshot.val();
      if (data) {
        const notesList = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setNotes(notesList);
        console.log(notesList);
      } else {
        setNotes([]);
      }
    });
    return () => {
      usersRef.off('value', onUsersValueChange);
      notesRef.off('value', onNotesValueChange);
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      
      
      fetchNotes(usrMail);
      console.log('focused home')
    

      return () => {
        console.log('Cleanup or cancel operations if needed');
        fetchNotes(usrMail);
      };

    }, [usrMail]));

 



  // const fetchNotes = async (email) => {
  //   const notesRef = database().ref('/notes');
  //   const snapshot = await notesRef.orderByChild('email').equalTo(email).once('value');
  //   const data = snapshot.val();
  //   if (data) {
  //     const notesList = Object.keys(data).map(key => ({ id: key, ...data[key] }));
  //     setNotes(notesList);
  //     console.log(notesList);
  //     setN('ok');
      
  //   } else {
  //     setNotes([]);
  //     console.log('No notes');
  //   }
  // };


  const fetchNotes = (email) => {
    const notesRef = database().ref('/notes');
    notesRef.orderByChild('email').equalTo(email).on('value', snapshot => {
      const data = snapshot.val();
      if (data) {
        const notesList = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setNotes(notesList);
        console.log(notesList);
      
      } 
      else {
        setNotes([]);
        console.log('No notes');
      }
       
    });
   
  };

  // const fetchNotes = async () => {
  //   const notesRef = database().ref('/notes');
  //   const snapshot = await notesRef.once('value');
  //   const data = snapshot.val();
  //   if (data) {
  //     const notesList = Object.keys(data).map(key => ({ id: key, ...data[key] }));
  //     setNotes(notesList);
  //   } else {
  //     setNotes([]);
  //   }
  // };



  useEffect(()=>{
  navigation.setOptions({
    headerRight:()=>(
      <>
    
      <Pressable style={{margin:10}} onPress={() => navigation.navigate('settings')}>
      <Ionicons name="settings" size={30} color="white" />
      </Pressable>
      </>
      
   )
  })
  },[])

  const addNote = async (title, description,email) => {
    const notesRef = database().ref('/notes');
    const newNoteRef = notesRef.push();
    await newNoteRef.set({ title, description,email });
    setNoteTitle('');
    // alert('Note added successfully.');

    // Fetch and log all data in /notes after adding a new note
 
    fetchNotes(usrMail);
  };

//dummy data
  const data = [
    { id:'1', title: 'Note 1', desc: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s' },
    { id:'2',title: 'Note 2', desc: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s' },
    { id:'3',title: 'Note 3', desc: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s' },
    { id:'4',title: 'Note 4', desc: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s' },
    { id:'5',title: 'Note 5', desc: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s' },
    { id:'6',title: 'Note 4', desc: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s' },
    { id:'7',title: 'Note 5', desc: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s' },
    { id:'8',title: 'Note 4', desc: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s' },
    { id:'9',title: 'Note 5', desc: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s' },
    { id:'10',title: 'Note 4', desc: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s' },
    { id:'11',title: 'Note 5', desc: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s' },
   
  ];

  const renderItem = ({ item }) => (
    <NoteCard id={item.id} title={item.title} desc={item.description} confirmDelete={confirmDelete} />
  );

  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = {backgroundColor: 'white', paddingVertical: 50,paddingHorizontal:20,borderRadius:10};


  return (
    <View style={{flex:1,backgroundColor:'white'}}>
      {isLoading ? 
      <Loader />
      :
      <>
       <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle} style={{margin:20,borderRadius:10}}>
          <View style={{flexDirection:'row'}} >
          <Image source={require('../assets/images/yellow-dots.png')} style={{marginHorizontal:10}} />
           <Text style={{fontSize:25,fontWeight:'600',marginBottom:20}}>Create title</Text> 
          </View>
          

          <TextInput
          mode='outlined'
          activeOutlineColor={appTheme}
          value={noteTitle}
          onChangeText={(t) => setNoteTitle(t)}
          
          />
          <Button mode='contained'
           buttonColor={appTheme}
           textColor='black' 
           labelStyle={{fontSize:18}}
          style={{marginVertical:30,borderRadius:8}}
          onPress={
            () => {addNote(noteTitle,'...',usrMail)
              hideModal();
            }}
          >
            ADD</Button>
          
        </Modal>
      </Portal>

   
    
    { notes.length !== 0 ? 
    <>
       <View style={{flexDirection:'row',alignItems:'center',margin:5}}>
      <Entypo name="dot-single" size={40} color={hasInternet ? 'green' :"#a3a2a2"} />    
     <Text style={{fontSize:20,color:hasInternet ? 'green' :'#a3a2a2'}}>{hasInternet ? 'Online' :'Offline'}</Text>
      </View>

        <FlatList 
    contentContainerStyle={styles.container}
    data={notes}
    renderItem={renderItem}
    keyExtractor={(item) => item.id}
    numColumns={2}
    
    /> 
   
    </>
 
  : 
 
  <>
  <Image source={require('../assets/images/notes-bro.png')} style={styles.coverImg}/>
 
  </>
  }
     <Button  icon="plus" mode='contained' buttonColor={appTheme}
     style={styles.createNote}
     labelStyle={{fontSize:20}}
     contentStyle={{fontSize:18}}
     onPress={showModal}
     >

    Create Note
    </Button>

      </>
      
      }
      
  
   

    </View>
   
  )
}

export default Home

const styles = StyleSheet.create({
  container:{
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginBottom:40,
  
  },
  createNote:{
    justifyContent:'flex-end',
    alignSelf:'flex-end',
    marginHorizontal:20,
    marginVertical:50
  },
  coverImg:{
    width:300,
    height:400,
    marginTop:100,
    marginBottom:50,
    alignSelf:'center',
    justifyContent:'center'
  }
})