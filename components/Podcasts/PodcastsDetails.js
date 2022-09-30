import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import { Header, Icon } from 'react-native-elements';
import { useFonts } from 'expo-font';
import axios from 'axios';
import { useContext } from 'react';
import PlayerContext from '../Players/PlayerProvider';
import playlistFormatterHelper from '../Players/playlistFormatterHelper';
import AudioListItem from "./AudioListItem"

const PodcastsDetails = ({ navigation, route }) => {
  const { title, image, id } = route.params;
  const [details, setDetails] = useState([]);

  // Context
  const player = useContext(PlayerContext)
  const CATEGROY = title; // Very important

  let [fontsLoaded] = useFonts({
    GothamBold: require('../../assets/fonts/GothamBold.ttf'),
    GothamLight: require('../../assets/fonts/GothamLight.ttf'),
    GothamBlack: require('../../assets/fonts/GothamBlack.otf'),
  });

  const renderItem = ({ item, index }) => (
    <AudioListItem 
      id={item.id}
      title={item.title} 
      image={"https://www.icore.network/podcasts/"+route.params.image}
      player={player}
      index={index}
      category={CATEGROY}
      playbackInstanceRef={player.playbackInstanceRef}
    />
  );

  async function getDetails() {
    let res = await axios.get(
      'https://www.icore.network/client/detailsCategoriePodcasts/' + id
    );
    // console.log(res.data.result.allPodCastInCategorie)
    setDetails(res.data.result.allPodCastInCategorie);
  }

  const showData = (array) => {
    if(array.length < 1){
      return(
        <View style={{flex:1, width:"100%", justifyContent: 'center', alignItems: 'center',}}>
          <Text style={{fontSize: 15, textAlign: 'center', fontFamily: 'GothamBold'}}>Aucun contenu pour cette liste</Text>
        </View>
      )
    }else{
      return(
        <FlatList data={array} renderItem={renderItem} />
      )
    }
  }
  useEffect(() => {
    const playlist = playlistFormatterHelper(details, title, 'https://www.icore.network/podcasts/' + image)
    player.initPlaylist({
      playlist: playlist,
      directMode: false
    })
  }, [details]) 

  useEffect(() => {
    return getDetails();
  }, []);

  return (
    <View style={styles.container}>
      <Header
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" color="#E0801E" size={40} />
          </TouchableOpacity>
        }
        centerComponent={<Text style={styles.titleAppBar}>{title}</Text>}
        containerStyle={{
          backgroundColor: '#fff',
        }}
      />
      <ImageBackground
        source={require('../../assets/background.jpeg')}
        style={{ flex: 1, width: '100%', height: '100%' }}>
        <View style={{flex: 1}}>
          {showData(details)}
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleAppBar: {
    color: '#573178',
    fontSize: 23,
    fontWeight: 'bold',
    position: 'absolute',
    top: '15%',
  },
  item: {
    margin: 8,
    flex: 1,
    flexDirection: 'row',
    padding: 5,
    alignItems: 'center'
  },
  title: {
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'GothamBold',
  },
});

export default PodcastsDetails;
