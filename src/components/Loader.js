import { StyleSheet, Text, View,Image } from 'react-native'
import React, { useContext } from 'react'
import { ActivityIndicator, MD2Colors } from 'react-native-paper';
import MyContext from '../context/context';

const Loader = ({msg}) => {
    const {appTheme} = useContext(MyContext);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/notedly.png')} style={styles.logo} /> 
     <ActivityIndicator animating={true} color={appTheme} />
     {msg && (
       <Text style={{fontSize:18,fontWeight:'500',marginTop:10,textAlign:'center'}}>{msg}</Text>
     )}
    
    </View>
  )
}

export default Loader

const styles = StyleSheet.create({
    container:{
      alignSelf:'center',
      alignContent:'center'
    },
    logo:{
        width:180,
        height:150
    }
})