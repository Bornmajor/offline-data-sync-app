import { StyleSheet, Text, View,Image } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { TextInput, IconButton,Button } from 'react-native-paper';
import MyContext from '../context/context';
import Loader from '../components/Loader';

const Login = () => {

    const {appTheme,showFeedback,isLoading,setIsLoading,storeAuthData,hasInternet} = useContext(MyContext);
    const [email,setEmail] = useState('');
    const [pwd,setPwd] = useState('');
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    useEffect(()=>{
      if(!hasInternet){
          setIsLoading(true);
          console.log('No internet for auth');
      }else{
        setIsLoading(false);
      }
  
    },[hasInternet]);

    const submitFormData = async() =>{
      if(email == ''){
        //email is empty
        showFeedback('Email required');
        
    }else if(pwd == ''){
        //pwd is empty
        showFeedback('Password required');
       
    }else if(!emailRegex.test(email)){
        showFeedback('Email not valid');
    }else if(email == ' ' || pwd == ' '){
        showFeedback('__spaces not allowed');
    }
    else{

       // console.log(email);
       
       console.log(email,pwd);
       //store data
       storeAuthData(email,pwd);

       //clear fields
       setEmail('');
       setPwd('');


    }
    }
  return (
    <View style={styles.container}>
      {isLoading ? 
      <Loader msg="Internet required" />
      
      :
       <>
         <Image source={require('../assets/images/notedly.png')} style={styles.logo} />
      <Text style={styles.title}>NOTEDLY APP</Text>

        <View style={{width:'100%',marginHorizontal:10}}>
        <TextInput
        mode="contained"
        label="Email"
        placeholder="Email address"
        activeUnderlineColor={appTheme}
        style={styles.inputText}
        value={email}
        onChangeText={(t) => setEmail(t)}
        />
        <TextInput
        mode="contained"
        label="Password"
        placeholder="Password"
        value={pwd}
        activeUnderlineColor={appTheme}
        secureTextEntry
        onChangeText={(t) => setPwd(t)}
        right={
            <IconButton
            icon="eye"
            iconColor={appTheme}
            size={20}
            onPress={() => console.log('Pressed')}
          />
        }
        style={styles.inputText}
        />
        <Button mode='contained' style={styles.loginBtn}
         buttonColor={appTheme}
         labelStyle={{fontSize:20}} 
         onPress={submitFormData}
         >
          LOGIN
          </Button>


        </View>
       </>
       
       
       }
       
   


    </View>
  )
}

export default Login

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'white'
    },
    logo:{
     width:280,
    //  height:200,
     
    },
    title:{
        fontSize:20,
        fontWeight:'600'
    },
    inputText:{
    margin:10
    },
    loginBtn:{
      marginHorizontal:10,
      marginVertical:20,
      borderRadius:8
    }
})