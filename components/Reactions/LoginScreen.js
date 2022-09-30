import React,{useEffect, useState} from 'react';
import { View, StyleSheet,Text, Dimensions, StatusBar,TouchableOpacity, ImageBackground, Image, ActivityIndicator, Alert } from 'react-native';
import {Header, Icon, Input, SearchBar} from 'react-native-elements'
import {Button} from 'react-native-paper'
import { useFonts } from 'expo-font';
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Facebook from 'expo-facebook'

const LoginScreen = ({navigation}) => {
    const [number, setNumber] = useState('')
    const [user_id, setId] = useState(null)
    const [password, setPassword] = useState('')
    const [isLoggedin, setLoggedinStatus] = useState(null)
    const [userData, setUserData] = useState(null)
    const [isImageLoading, setImageStatus] = useState(false)

    const facebookLogin = async() => {
      try {
        await Facebook.initializeAsync({
          appId:'2207500246098559',
        })
        const {
          type,token,expirationDate, permissions, declinedPermissions } = await Facebook.logInWithReadPermissionsAsync({
          permissions: ['public_profile'],
        })
        if(type === 'success'){
          const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`)
          const data = await response.json()
          const password = data.id
          const user_phone = String(password).slice(6)
          const url = "https://icore.network/client/login"
          return fetch(url, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              "contact": user_phone,
              "password": password
            })
          }).then((response) => response.json()).then(async (responseData) => {
            switch (responseData.etat) {
              case true:
                const user = String(responseData.result.id)
                await AsyncStorage.setItem('id', user)
                await AsyncStorage.setItem('phone', "facebook")
                setObjectValue(responseData.result)
                navigation.navigate('ListeRooms')
                break;
              case false:
                return Alert.alert('Attention', "Le compte est introuvable ! Inscrivez-vous pour debuter.",
                  [{
                    text: 'Compris !',
                    style: 'cancel',
                  },{
                    text: 'Continuer ➡️',
                    onPress: () => navigation.navigate('RegisterScreen'),
                    }],
                )
                break;
              default:
                break;
            }
          })
        }else{
          //type === 'cancel'
          Alert.alert('une erreur de connexion avec facebook')
        }
      } catch ({message}) {
        Alert.alert(`Une erreur s'est produite pendant la connexion avec Facebook`, [
          {
            text: "Compris !",
            style:"cancel"
          }
        ])
        console.log(message);
      }
    }

    const logout = async() => {
      setLoggedinStatus(false);
      setUserData(null)
      setImageStatus(false)
    }

    let [fontsLoaded] = useFonts({
        'GothamBold': require('../../assets/fonts/GothamBold.ttf'),
        'GothamLight': require('../../assets/fonts/GothamLight.ttf'),
        'GothamBlack': require('../../assets/fonts/GothamBlack.otf'),
    });

    const setObjectValue = async (value) => {
      try {
        const jsonValue = JSON.stringify(value)
        await AsyncStorage.setItem('key', jsonValue)
      } catch(e) {
        console.log(e)
      }
      console.log('Donées sauvegardées.')
    }

    async function login(){
      const url = "https://icore.network/client/login"
      return fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "contact": number,
          "password": password
        })
      }).then((response) => response.json()).then(async(responseData)=>{
        if (responseData.etat == true) {
          const user = String(responseData.result.id)
          await AsyncStorage.setItem('id', user)
          await AsyncStorage.setItem('password', password)
          await AsyncStorage.setItem('phone', number)
          setObjectValue(responseData.result)
          console.log(responseData)
          navigation.navigate('ListeRooms')
        }else{
          if(responseData.error[0] == "Vérifier le contact"){
            return Alert.alert('Attention',"Le numéro est introuvable ! Inscrivez-vous pour debuter.")
          }
        }
      })
    }

    const redirect = async() => {
      if(number == "" || password == "") {
        return Alert.alert('Attention',"Vous n'avez pas saisi un champ")
      } else {
        login()
      }
    }

  return (
    <View style={{flex:1}}>
      <Header
        leftComponent={
          <TouchableOpacity style={{backgroundColor:"#fff"}} onPress={()=>navigation.goBack()}>
            <Icon name="arrow-back" color="#E0801E" size={40} />
          </TouchableOpacity>
        }
        centerComponent={
          <Text style={styles.titleAppBar}>Connexion</Text>
        }
        containerStyle={{
          backgroundColor:"#fff"
        }}
      />
      <View style={styles.container}>
        <Image
              source={require('../../assets/begin_chat.png')}
              style={styles.logo}
        />
        <Text style={{fontSize:19, color:"#000", textAlign:"center", fontFamily:"GothamBold"}}>Connectez-vous pour continuer !</Text>
        <View style={styles.forms}>
            <View style={{paddingTop:5}}>
                <Input
                style={styles.InputStyle}
                    placeholder="Entrez votre numéro de téléphone"
                    keyboardType='number-pad'
                    leftIcon={
                        <Icon
                        name='phone'
                        size={24}
                        color='#573178'
                        />
                    }
                    onChangeText={text => setNumber(text)} 
                    value={number}
                />
            </View>

                <View style={{paddingTop:10}}>
                <Input
                    style={styles.InputStyle}
                        placeholder="Entrez votre mot de passe"
                        leftIcon={
                            <Icon
                            name='lock'
                            size={24}
                            color='#573178'
                            />
                        }
                        onChangeText={text => setPassword(text)} 
                        value={password}
                        secureTextEntry={true}
                    />
                </View>

                {/* <Text style={{textDecorationLine:"underline", textAlign:"right", marginTop:5, color:"#000", fontFamily:"GothamLight"}} onPress={()=> console.log("ok ok")}>Mot de passe oublié ?</Text> */}

                <Button icon="login" style={styles.boutonLogin} mode="contained" onPress={()=>redirect()}>
                    Connexion
                </Button>
                <View style={{borderWidth:1, width:"70%", alignSelf:"center", margin:10, borderColor:"#CDCDCD"}}></View>
                <Text style={{textAlign:"center",fontFamily:"GothamLight", fontWeight:"bold"}}>OU CONNECTEZ-VOUS VIA</Text>
                <Button icon="facebook" style={styles.boutonLogin2} mode="contained" onPress={()=>facebookLogin()}>
                    Facebook
                </Button>

                <Text style={{textAlign:"center", color:"#000", fontFamily:"GothamLight", textDecorationLine:"underline"}}  onPress={() => navigation.navigate('RegisterScreen')}>Vous n'avez pas de compte ? Inscrivez-vous</Text>

            </View>
      </View>
    </View>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
    titleAppBar:{
        color:"#573178",
        fontSize:23,
        fontWeight:"bold",
        position:"absolute",
        top:"15%"
      },
      button:{
        width:300,
        margin:10
      },
      container:{
        flex: 1,
        backgroundColor: '#fff',
        justifyContent:"center",
        padding:15,
      },
      logo:{
        width:160,
        height:130,
        marginBottom:30,
        marginTop:30,
        alignSelf: 'center',
    },
    textinput:{
        height: 40,
        width:"100%",
        borderColor: 'gray', 
        borderWidth: 1,
        borderRadius:4,
        margin:10,
        paddingLeft:5,
        paddingRight:5,
    },
    boutonLogin:{
        width:150,
        alignSelf:"center",
        marginTop:5,
        marginBottom:2,
        backgroundColor:"#573178"
    },
    boutonLogin2:{
      width:150,
      alignSelf:"center",
      marginTop:5,
      marginBottom:20,
      backgroundColor:"#3b5998"
  },
    itemStyle:{
        marginTop:5
    },
    InputStyle:{
        color:"black",
        marginBottom:1,
        marginLeft:5,
        fontSize:14,
        fontFamily:"GothamBlack"
    },
    forms:{
        marginTop:"10%",
        paddingRight:10
    },
})