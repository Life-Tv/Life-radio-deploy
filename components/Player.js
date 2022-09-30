import * as React from 'react';
import { Text, View, StyleSheet, ImageBackground, Image, TouchableOpacity, Share } from 'react-native';
import {Header, Icon} from 'react-native-elements'
import Constants from 'expo-constants';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import PlayerContext from './Players/PlayerProvider';
import playlistFormatterHelper from './Players/playlistFormatterHelper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
const Player = ({navigation}) => {
  const [logged, setLogged] = React.useState("null")
  const [streamLink, setStremLink] = React.useState("")

  // Context
  const player = React.useContext(PlayerContext)
  const CATEGROY = 'Direct'; // Very important
  const ref = `${CATEGROY}_1`;

  //fonction pour verifier sa voir si on est inscrit
  const getMyStringValue = async () => {
    try {
      const res = await AsyncStorage.getItem('id')
      //const pass = await AsyncStorage.setItem('pass','null')
      setLogged(res)
      console.log(res);
    } catch(e) {
      console.log("une erreur s'est produite");
    }    
  }

  const getStreamLink = async () => {
    const endpoint = 'https://icore.network/client/getLinkStream'
    let res = await axios.get(endpoint)
    console.log(res.data.result.link);
    setStremLink(res.data.result.link)
  }

  React.useEffect(() => {
    _init()
    getMyStringValue()
    getStreamLink()
  }, [])

  const _init = () => {
    const playlist = playlistFormatterHelper(
      [
        {
          id: 1,
          title: 'Life Radio',
          category: CATEGROY,
          audioName: streamLink
        }
      ], 
      CATEGROY, null
    )
    player.initPlaylist({playlist: playlist, directMode: true})
  }

  const _onPlayOrPause = () => {
    if(player.playbackInstanceRef != ref) {
      _init()
    }
    player.onPlayOrPause(0, ref)
  }

  //fonction d'affichage de l'icone des parametres
  const renderIcon = (logged) => {
    //si la hooks logged retourne true alors on affiche l'icone de paramètres
    if(logged != "null"){
      return(
        <TouchableOpacity onPress={()=> navigation.navigate('Settings')}>
          <MaterialCommunityIcons name="account-settings" color="#573178" size={26} />
        </TouchableOpacity>
      )
    }
  }

  let [fontsLoaded] = useFonts({
    'GothamBold': require('../assets/fonts/GothamBold.ttf'),
    'GothamLight': require('../assets/fonts/GothamLight.ttf'),
    'GothamBlack': require('../assets/fonts/GothamBlack.otf'),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  function displayBoutonRadio(){
    return(
      <View>
        {
          (player.isLoading && player.directMode == true) ? (
            <View style={[styles.loading, {opacity: (player.isLoading && player.directMode == true) ? 1 : 0 }]}>
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          ) : <></>
        }
        {
          (!player.isLoading) ? (
            <View style={{opacity: (player.isLoading && player.directMode == true) ? 0 : 1}}>
              <TouchableOpacity onPress={()=> _onPlayOrPause()} style={{justifyContent:"center", alignItems:"center"}}>
                <MaterialCommunityIcons name={(player.isPlaying && player.playbackInstanceRef == ref)? "pause-circle-outline" : "arrow-right-drop-circle-outline"} color="white" size={130} />
              </TouchableOpacity>
            </View>
          ) : <></>
        }
      </View>
    )
  }

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: "Hey, je t'invite a suivre en direct Life radio avec moi en cliquant sur le lien suivant: https://liferadio.ci/" ,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  return(
    <View style={{flex:1, backgroundColor: "#fff",}}>
      <Header
        centerComponent={
          <Text style={styles.titleAppBar}>Direct</Text>
        }
        containerStyle={{
          backgroundColor:"#fff",
          marginBottom:"9%"
        }}
        rightComponent={
          renderIcon(logged)
        }
      />
      <ImageBackground style={styles.container} source={require('../assets/background.jpeg')} imageStyle={{resizeMode: 'cover'}}>
        <View style={{width:"100%", height:"65%"}}>
          <ImageBackground source={require('../assets/cover_live.jpeg')} resizeMode="cover" style={styles.image}>
            {displayBoutonRadio()}
          </ImageBackground>
        </View>
        <View style={{width:"100%"}}>
          <Text style={styles.heure}></Text>
          <View style={{flexDirection:"row",}}>
            <View style={{flexDirection:"column", flex:2.5}}>
              <Text style={styles.title}>Life Radio</Text>
              <Text style={styles.subTitle}>Ta radio comme</Text>
              <Text style={styles.subTitle}>tu l'entends</Text>
            </View>
            <View style={{flexDirection:"row", flex:1, justifyContent:"center", alignItems:"center"}}>
              <TouchableOpacity style={{margin:3}} onPress={()=> navigation.navigate('ListeRooms')}>
                <Icon name="comment" color="#573178" size={25} />
                <Text style={{fontSize:14, fontFamily:"GothamLight"}}>Réagir</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{margin:3}} onPress={()=> onShare()}>
                <Icon name="share" color="#573178" size={25} />
                <Text style={{fontSize:14, fontFamily:"GothamLight"}}>Partagez</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems:"center",
    backgroundColor: '#fff',
    paddingTop: Constants.statusBarHeight,
    padding:16
  },
  image: {
    flex: 1,
    justifyContent: "center"
  },
  heure:{
    color:"#E0801E",
    marginTop:25,
    fontSize:20,
    fontFamily:"GothamBold",
  },
  title:{
    color:"#573178",
    fontSize:28,
    fontFamily:"GothamBlack"
  },
  subTitle:{
    fontSize:16,
    fontFamily:'GothamBold'
  },
  titleAppBar:{
    color:"#573178",
    fontSize:23,
    fontWeight:"bold",
    position:"absolute",
    top:"15%"
  },
  loading: {
    width: 106,
    height: 106,
    borderRadius: 200,
    borderWidth: 11,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  loadingText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center'
  }
});

export default Player