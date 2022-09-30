import { View, StyleSheet, TouchableOpacity, Platform, Dimensions, Text, Image } from 'react-native'
import React from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'

const { width: WIDTH, height: HEIGHT } = Dimensions.get('screen');
export const STICKY_HEIGHT = 45;

const StickyPlayer = (props) => {

  const {_onPlayPausePressed, isPlaying, instance, progressBar, title, cover} = props;

  return (
     <View style={styles.container}>
      <View style={{position: 'absolute', left: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, .6)', height: 4, width: `${progressBar * 100}%`}}/>
      <View style={{position: 'absolute', left: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, .2)', height: 4, width: WIDTH}}/>
      <TouchableOpacity style={{alignSelf: 'center', alignItems:'center'}} disabled={!instance} onPress={_onPlayPausePressed}>
        <MaterialCommunityIcons style={{ opacity: !instance? .8 : 1}} name={!isPlaying ? 'play':'pause'} color="#fff" size={30}/>
      </TouchableOpacity>
      <View style={{marginLeft: 10, width: '100%', flexDirection: 'row', alignItems: 'center'}}>
        <Image style={{
          height: STICKY_HEIGHT - 10, width: STICKY_HEIGHT - 10,
          resizeMode: 'cover', marginRight: 10, 
          borderRadius: 4,
          backgroundColor: 'rgba(255, 255, 255, .4)'
        }} 
        source={{uri: cover}}
        />
        <Text style={styles.title} numberOfLines={1}>
          { title }
        </Text>
      </View>
     </View>
    
  )
}

const styles = StyleSheet.create({
 container: {
  height: STICKY_HEIGHT,
  width: WIDTH,
  flexDirection: 'row',
  backgroundColor: '#E0801E', //573178
  alignItems: 'center',
  paddingLeft: 5,
 },
 title: {
  fontSize: 13,
  fontWeight: 'bold',
  width: '70%',
  color: '#fff'
 }
})

export default StickyPlayer