import React,{useEffect, useState} from 'react';
import { View, StyleSheet,Text, Dimensions, StatusBar,TouchableOpacity, ImageBackground, Image, ActivityIndicator, Alert } from 'react-native';
import {Header, Icon, SearchBar, Input} from 'react-native-elements'
import {Button} from 'react-native-paper'
import Timeline from 'react-native-timeline-flatlist'
import { useFonts } from 'expo-font';
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Facebook from 'expo-facebook'

const RegisterScreen = ({navigation}) => {
    const [number, setNumber] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    let [fontsLoaded] = useFonts({
        'GothamBold': require('../../assets/fonts/GothamBold.ttf'),
        'GothamLight': require('../../assets/fonts/GothamLight.ttf'),
        'GothamBlack': require('../../assets/fonts/GothamBlack.otf'),
    });
    
  const showAlert = () =>
    Alert.alert(
      'Informations',
      "Votre inscription s'est bien déroulée ☺️, connectez vous maintenant vous participer au live",
      [{
        text: 'Compris !',
        onPress: () => navigation.navigate('Tabs'),
        style: 'cancel',
      }, {
        text: 'Continuer ➡️',
        onPress: () => navigation.navigate('LoginScreen'),
      },
      ], {
        cancelable: true,
        onDismiss: () =>
          navigation.navigate('Tabs'),
      }
    );
  
    function registration(){
        const url = "https://www.icore.network/client/signup"
        return fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "firstname": name,
            "password": password,
            "sexe": "sex",
            "address": "address",
            "contact": number
          })
        }).then((response) => response.json()).then((responseData)=>{
            console.log(responseData);
            if (responseData.etat == true) {
              showAlert()
            } else if(responseData.etat == false){
              if(responseData.error[0] == "Veillez entrer un nom & prénom correct"){
                Alert.alert("Attention !", "Veuillez entrer un nom & prénoms correct")
              }
              if (responseData.error[0] == "ce contact appartient déjà à un utilisateur ") {
                Alert.alert("Attention !", "Ce numéro de téléphone a déjà été utilisé")
              }
            }else {
              Alert.alert('Oups', "Une erreur s'est produite")
          } 
            
        })
    }
  
    const facebookRegister = async () => {
      try {
        await Facebook.initializeAsync({
          appId: '2207500246098559',
        })
        const {
          type,
          token,
          expirationDate,
          permissions,
          declinedPermissions
        } = await Facebook.logInWithReadPermissionsAsync({
          permissions: ['public_profile'],
        })
        if (type === 'success') {
          const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`)
          const data = await response.json()
          const password = data.id
          const user_phone = String(password).slice(6)
          const username = data.name
          const url = "https://www.icore.network/client/signup"
          return fetch(url, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              "firstname":username,
              "password": password,
              "sexe": "facebook",
              "address": "facebook",
              "contact": user_phone,
            })
          }).then((response) => response.json()).then(async (responseData) => {
            console.log(responseData)
            if (responseData.etat == true) {
              showAlert()
            } else if (responseData.etat = false) {
              if (responseData.error[0] == "Veillez entrer un nom & prénom correct") {
                Alert.alert("Attention !", "Veuillez entrer un nom & prénoms correct")
              }
              if (responseData.error[0] == "ce contact appartient déjà à un utilisateur ") {
                Alert.alert("Attention !", "Ce numéro de téléphone a déjà été utilisé")
              }
            } else {
              Alert.alert('Oups', "Une erreur s'est produite, ce compte existre déjà", [
                 {
                   text: "Annuler",
                   style: "cancel"
                 }
                ,{
                  text: "Connectez-vous",
                  onPress: () => navigation.navigate('LoginScreen')
                }
              ])
            }
          })
        } else {
          //type === 'cancel'
          Alert.alert(`une erreur d'inscription avec facebook`)
        }
      } catch ({
        message
      }) {
        Alert.alert(`Une erreur s'est produite pendant la connexion avec Facebook`)
        console.log(message);
      }
    }

    function redirect(){
        if (name == "" || password == "" || number == "") {
            Alert.alert('Attention', "Tous les champs sont obligatoires")
        }else {
            registration()
        }
    }

  return (
    <View style={{flex:1}}>
      <Header
        leftComponent={
          <TouchableOpacity onPress={()=> navigation.goBack()}>
            <Icon name="arrow-back" color="#E0801E" size={40} />
          </TouchableOpacity>
        }
        centerComponent={
          <Text style={styles.titleAppBar}>Inscription</Text>
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
        <Text style={{fontSize:19, color:'#000', textAlign:"center", fontFamily:"GothamBlack"}}>Inscrivez-vous pour commencer !</Text>
            <View style={styles.forms}>
                <View>
                <Input
                    style={styles.InputStyle}
                        placeholder="Entrez votre nom et prenoms"
                        leftIcon={
                            <Icon
                            name='badge'
                            size={24}
                            color='#573178'
                            />
                        }
                        onChangeText={name => setName(name)} 
                        value={name}
                    />
                </View>
                <View>
                <Input
                    style={styles.InputStyle}
                        placeholder="Entrez votre numero de téléphone"
                        leftIcon={
                            <Icon
                            name='phone'
                            size={24}
                            color='#573178'
                            />
                        }
                        onChangeText={tel => setNumber(tel)} 
                        value={number}
                        keyboardType="numeric"
                    />
                </View>

                <View>
                    <Input
                        style={styles.InputStyle}
                        placeholder="Saisissez un mot de passe"
                        leftIcon={
                            <Icon
                            name='lock'
                            size={24}
                            color='#573178'
                            />
                        }
                        onChangeText={password => setPassword(password)} 
                        value={password}
                        secureTextEntry={true}
                    />
                </View>

                <Button icon="login" style={styles.boutonLogin} mode="contained" onPress={()=> redirect()}>
                    INSCRIPTION
                </Button>
                <View style={{borderWidth:1, width:"70%", alignSelf:"center", margin:10, borderColor:"#CDCDCD"}}></View>
                <Text style={{textAlign:"center",fontFamily:"GothamLight", fontWeight:"bold"}}>OU CONNECTEZ-VOUS VIA</Text>
                <Button Button icon = "facebook"
                style = {
                  styles.boutonLogin2
                }
                mode = "contained"
                onPress = {() => facebookRegister()}>
                    Facebook
                </Button>

                <Text style={{textAlign:"center", marginTop:"3%", color:'#000', textDecorationLine:"underline", fontFamily:"GothamLight"}} onPress={()=> navigation.navigate('LoginScreen')}>Vous avez un compte ? Connectez-vous</Text>

            </View>
      </View>
    </View>
  )
}

export default RegisterScreen

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
      forms:{
        marginTop:"7%",
        paddingRight:10
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
    textinput:{
        height: 40,
        width:"100%",
        borderColor: 'gray', 
        borderWidth: 1,
        borderRadius:4,
        margin:5,
        paddingLeft:5,
        paddingRight:5,
    },
    boutonLogin:{
        width:160,
        alignSelf:"center",
        marginTop:10,
        marginBottom:15,
        backgroundColor:"#573178"
    },
    logo:{
        marginBottom:20,
        marginTop:15,
        alignSelf:"center",
        width:255,
        height:200
  },
    boutonLogin2: {
      width: 150,
      alignSelf: "center",
      marginTop: 5,
      marginBottom: 20,
      backgroundColor: "#3b5998"
    },
})