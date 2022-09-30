import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import WebView from 'react-native-webview'
import { Header, Icon } from 'react-native-elements';
import { ActivityIndicator } from 'react-native';

const { width: WIDTH, height: HEIGHT } = Dimensions.get('screen');

const VideoPlayer = ({ navigation, route }) => {
 const { videoID } = route.params;
  return (
   <>
    <Header
      leftComponent={
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" color="#E0801E" size={40} />
        </TouchableOpacity>
      }
      centerComponent={<Text style={styles.titleAppBar}>Video Player</Text>}
      containerStyle={{
        backgroundColor: '#fff',
      }}
    />
    <WebView
     javaScriptEnabled={true}
     scrollEnabled={false}
     allowsFullscreenVideo={true}
     source={{uri: `https://www.youtube.com/watch?v=${videoID}&autoplay=1&mute=0&showinfo=0&controls=0&fullscreen=1`}}
     style={styles.video}
    />
   </>
  )
}

const styles = StyleSheet.create({
 video: {
  width: WIDTH,
  height: WIDTH / 2,
  backgroundColor: '#fff'
 },
 titleAppBar: {
  color: '#573178',
  fontSize: 23,
  fontWeight: 'bold',
  position: 'absolute',
  top: '15%',
 },
})
export default VideoPlayer