import React, { useState, useEffect, useContext } from 'react';
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
import playlistFormatterHelper from '../Players/playlistFormatterHelper';
import AudioListItem from './AudioListItem';
import PlayerContext from '../Players/PlayerProvider';

// https://www.icore.network/replays/"+url


const ReplaysDetails = ({ navigation, route }) => {
  const { title, id, audioName } = route.params;
  const cover = 'https://www.icore.network/replays/' + route.params.cover

  const data = [{
    id: 1,
    title,
    audioName: "https://www.icore.network/replays/"+audioName,
    cover
  }]

  // Context
  const player = useContext(PlayerContext)
  const CATEGROY = title

  useEffect(() => {
    console.log(cover)
    const playlist = playlistFormatterHelper(data, title, cover)
    player.initPlaylist({
      playlist: playlist,
      directMode: false
    })
  }, [])

  let [fontsLoaded] = useFonts({
    GothamBold: require('../../assets/fonts/GothamBold.ttf'),
    GothamLight: require('../../assets/fonts/GothamLight.ttf'),
    GothamBlack: require('../../assets/fonts/GothamBlack.otf'),
  });

  const renderItem = ({ item, index }) => (
    <AudioListItem
      id={item.id}
      title={item.title} 
      image={item.cover}
      player={player}
      index={index}
      category={CATEGROY}
      playbackInstanceRef={player.playbackInstanceRef}
    />
  );

  return (
    <View style={styles.container}>
      <Header
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" color="#E0801E" size={40} />
          </TouchableOpacity>
        }
        centerComponent={<Text style={styles.titleAppBar}>Replays</Text>}
        containerStyle={{
          backgroundColor: '#fff',
        }}
      />
      <ImageBackground
        source={require('../../assets/background.jpeg')}
        style={{ flex: 1, width: '100%', height: '100%' }}>
        <View style={{flex: 1}}>
          <FlatList data={data} renderItem={renderItem} />
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
  },
  title: {
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'GothamBold',
  },
});

export default ReplaysDetails;
