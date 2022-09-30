import React,{useState, useEffect} from 'react';
import { Text, View, StyleSheet, FlatList, ImageBackground, Image, TouchableOpacity, ScrollView, Share,} from 'react-native';
import {Header, Icon, SearchBar} from 'react-native-elements'
import Constants from 'expo-constants';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';


const NewsDetails = ({navigation, route}) => {
  const {image, title, content} = route.params
  let [fontsLoaded] = useFonts({
    'GothamBold': require('../../assets/fonts/GothamBold.ttf'),
    'GothamLight': require('../../assets/fonts/GothamLight.ttf'),
    'GothamBlack': require('../../assets/fonts/GothamBlack.otf'),
  });

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
    <View style={{flex:1}}>
      <Header
        leftComponent={
          <TouchableOpacity onPress={()=> navigation.goBack()}>
            <Icon name="arrow-back" color="#E0801E" size={40} />
          </TouchableOpacity>
        }
        centerComponent={
          <Text style={styles.titleAppBar}>News</Text>
        }
        containerStyle={{
          backgroundColor:"#fff"
        }}
      />
        <ScrollView style={styles.container}>
          <ImageBackground style={{flex:1,padding:20}} source={require('../../assets/background.jpeg')} imageStyle={{resizeMode: 'cover'}}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.image}>
              <Image source={{uri:"https://www.icore.network/actualities/"+image}} style={{height:170, borderRadius:25}} />
            </View>
            <View style={{flexDirection:"column", marginBottom:"5%"}}>
              <Text style={{textAlign:"center", marginBottom:10, fontFamily:"GothamBold"}}>Partagez via:</Text>
              <View style={{flexDirection:"row", alignItems:"center", justifyContent:"center"}}>
                <TouchableOpacity style={{marginRight:15}} onPress={()=> onShare()}>
                  <MaterialCommunityIcons name="whatsapp" color="#25D366" size={45} />
                </TouchableOpacity>
                <TouchableOpacity style={{marginRight:15}} onPress={()=> onShare()}>
                  <MaterialCommunityIcons name="instagram" color="#C13584" size={45} />
                </TouchableOpacity>
                <TouchableOpacity style={{marginRight:15}} onPress={()=> onShare()}>
                  <MaterialCommunityIcons name="facebook" color="#4267B2" size={45} />
                </TouchableOpacity>
                <TouchableOpacity style={{marginRight:15}} onPress={()=> onShare()}>
                  <MaterialCommunityIcons name="twitter" color="#4267B2" size={45} />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={{fontFamily:"GothamLight", fontSize:19, textAlign:"justify"}}>
              {content}
            </Text>
          </ImageBackground>
        </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:"#fff",
  },
  titleAppBar:{
    color:"#573178",
    fontSize:23,
    fontWeight:"bold",
    position:"absolute",
    top:"15%"
  },
  title:{
    fontWeight:"bold",
    fontSize:23,
    marginBottom:20
  },
  image: {
    flex: 1,
    height:170,
    marginBottom:25,
    borderRadius:25,
    overflow:"hidden"
  },
})

export default NewsDetails