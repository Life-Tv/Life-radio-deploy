import React,{useEffect, useState} from 'react'
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Header, Icon } from 'react-native-elements';
import {Button} from 'react-native-paper'
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Settings = ({navigation}) => {
  const [username, setusername] = useState("")
  const [numero, setnumero] = useState("")

  let [fontsLoaded] = useFonts({
    'GothamBold': require('../assets/fonts/GothamBold.ttf'),
    'GothamLight': require('../assets/fonts/GothamLight.ttf'),
    'GothamBlack': require('../assets/fonts/GothamBlack.otf'),
  });

  const deleteData = async() => {
    try {
      await AsyncStorage.setItem("null")
      await AsyncStorage.removeItem('password')
    } catch (error) {
      console.log('erreur lors de la suppression des data')
    }
  }

  const showwAlert = () =>
    Alert.alert(
      'Informations',
      "Votre compte a bien été supprimé ☺️, vous ne pourrez plus participer au live.",
      [{
        text: 'Compris !',
        onPress: () => navigation.navigate('Tabs'),
      }, ], {
        cancelable: true,
        onDismiss: () =>
          navigation.navigate('Tabs'),
      }
    );

  const deleteAccount = async() => {
    const userId = await AsyncStorage.getItem('id')
    const password = await AsyncStorage.getItem('password')
    const url = "https://icore.network/client/deleteAccount"
        return fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "idUser": userId,
            "password": password,
          })
        }).then((response) => response.json()).then((responseData)=>{
            console.log(responseData);
            if (responseData.etat == true) {
              try {
                deleteData()
                showwAlert()
              } catch (error) {
                console.log(error)
              }
            } else {
                Alert.alert('Oups', "Votre compte a déjà été supprimé",{
                  text:"D'accord !",
                  onPress: ()=> console.log('Cancel Pressed'),
                  style:'cancel'
                })
            }
        })
  }

  const showAlert =() => {
    Alert.alert("Attention", "Vous êtes sur le point de supprimer votre compte Life Radio",[
      {
        text: 'Annuler',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { text: 'Oui, je sais !',
        onPress: () => deleteAccount()
      },
    ])
  }

  const showNumberAndUsername = () => {
    if(number =! ""){
      return (
        <View View style = {
          {
            marginBottom: "3%"
          }
        }>
          <View View style = {{marginBottom: "3%"}}>
            <Text style = {{ textAlign: "center", fontSize: 19, fontFamily: "GothamBlack", marginBottom: 6 }}> Votre nom  d'utilisateur</Text>
            <Text style = {{
                textAlign: "center",
                fontFamily: "GothamLight", fontSize: 17
              }
            }> {
              username
            } </Text>
          </View>
          <View>
            <Text style={{textAlign:"center", fontSize:19, fontFamily:"GothamBlack", marginBottom:6}}>Votre numéro de téléphone</Text>
            <Text style={{textAlign:"center", fontFamily:"GothamLight", fontSize: 17}}>{numero}</Text>
          </View>
        </View>
      )
    }
  }

  const checkNumber = async() => {
    const phone = await AsyncStorage.getItem('phone')
    setnumero(phone)
  }

  const checkUsername = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('key')
      if (jsonValue != null) {
        const userdata = JSON.parse(jsonValue)
        setusername(userdata.firstname)
      } else {
        console.log(null)
      }
    } catch (e) {
      console.log('Something went wrong', e)
    }
  }

  useEffect(() => {
    checkNumber()
    checkUsername()
  }, [])

  return (
    <View style={{flex:1, backgroundColor: "#fff",}}>
        <Header
            leftComponent={
              <TouchableOpacity onPress={()=> navigation.goBack()}>
                <Icon name="arrow-back" color="#573178" size={26} />
              </TouchableOpacity>
            }
            centerComponent={
                <Text style={styles.titleAppBar}>Paramètres</Text>
            }
            containerStyle={{
            backgroundColor:"#fff",
            marginBottom:"9%"
            }}
        />
        <View style={styles.container}>
        <Text style={{fontFamily:"GothamBold", fontSize:21, marginBottom:"8%", textAlign:"center"}}>Gérer les paramètres de votre compte Life Radio</Text>
        <Image source={require('../assets/settings.png')} style={{width:320, height:220}} />
        {
          showNumberAndUsername()
        }
        <Button icon="delete" mode='contained' labelStyle={{fontFamily:"GothamBlack"}} style={{margin:10, backgroundColor: "#573178"}} onPress={()=> showAlert()}>Supprimez votre compte</Button>
        </View>
    </View>
  )
}

export default Settings

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        padding:10
    },
    titleAppBar:{
      color:"#573178",
      fontSize:23,
      fontWeight:"bold",
      position:"absolute",
      top:"15%"
    },
})