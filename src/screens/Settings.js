import { StyleSheet, Text, View,Image } from 'react-native'
import React, { useContext } from 'react'
import { Button } from 'react-native-paper'
import MyContext from '../context/context'
import { FontAwesome6 } from '@expo/vector-icons';

const Settings = () => {
    const {appTheme, removeAuthData,usrMail} = useContext(MyContext);

  return (
    <View styles={styles.container}>
       
       <View style={styles.containerLogout}>

       <Image source={require("../assets/images/logout.png")} style={styles.img}/>
      <View style={{flexDirection:'row',alignSelf:'center'}}>
         <FontAwesome6 name="circle-user" size={24} color="black" />
       <Text style={{textAlign:'center',marginLeft:5}}>{usrMail}</Text> 
      </View>
     

       <Button
        mode='contained'
        buttonColor={appTheme}
        style={styles.btnLogout}
        onPress={()=>  removeAuthData() }
        >
        Logout
        </Button>

        </View>
     
      

    </View>
  )
}

export default Settings

const styles = StyleSheet.create({
    container:{
        flex:1,
        margin:20,
    },
    btnLogout:{
        alignSelf:'center',
       width:100,
        margin:30
    },
    img:{
        width:150,
        height:200,
        alignSelf:'center'
    },
    containerLogout:{
        borderRadius:10,
        borderColor:'white',
        margin:20,
        borderWidth:2
        
       

    }
})