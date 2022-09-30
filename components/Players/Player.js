import { View, Text } from 'react-native'
import React from 'react'
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import Slider from "@react-native-community/slider";
import { HEIGHT, WIDTH } from './AnimatedPlayerWrapper';
import { Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
const PADDING = 45;
const DISABLED_OPACITY = 0.5

const Player = (props) => {

  const {
    directMode,
    title,
    cover,
    category,
    isLoading,
    isPlaying,
    muted,
    progressBar,
    _onSeekSliderValueChange,
    _onSeekSliderSlidingComplete,
    _onChangeRateChanged,
    _onBackPressed,
    _onPlayPausePressed,
    _onForwardPressed,
    _onMutePressed,
    playingDuration,
    duration,
    rate,
  } = props;

  const slideStyle = directMode? {alignSelf: "stretch", opacity: directMode? 0:1, height: 0} : {alignSelf: "stretch"}
  
  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require('./../../assets/logo.png')}/>
      <View style={styles.wrapper}>
        <Image style={styles.cover} source={{uri: cover}}/>
        <View style={{ marginVertical: 30 }}>
          <Text style={styles.title} numberOfLines={1}>{ title }</Text>
          <Text style={styles.category}>{ category }</Text>
        </View>
      </View>
      <View style={{ 
        width: '100%', paddingHorizontal: PADDING - 15, 
        opacity: isLoading ? DISABLED_OPACITY : 1.0
      }}>
        <>
          <Slider
            style={slideStyle}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#eee"
            thumbTintColor="#fff"
            value={progressBar}
            onValueChange={_onSeekSliderValueChange}
            onSlidingComplete={_onSeekSliderSlidingComplete}
            disabled={isLoading || directMode}
          />
          {
            directMode? (
              <View style={styles.directLabel}>
                <MaterialCommunityIcons name="access-point" color="white" size={14} />
                <Text style={{ color: 'white', fontSize: 8, fontWeight: 'bold', marginHorizontal: 3, textTransform: 'uppercase'}}>En direct</Text>
              </View>
            ) : null
          }
          <View style={styles.durations}>
            <Text style={styles.duration}>{ playingDuration }</Text>
            <Text style={styles.duration}>{ duration }</Text>
          </View>
        </>
      </View>
      <View style={[styles.actions, {opacity: isLoading ? DISABLED_OPACITY : 1.0}]}>
        <TouchableOpacity disabled={isLoading || directMode} onPress={_onChangeRateChanged} style={{
          justifyContent:"center", alignItems:"center", 
          borderWidth: .7, borderColor: '#fff',
          borderRadius: 3, width: 21, height: 17,
        }}>
          <Text style={{color: '#ffffff', fontSize: 9}}>x{ rate.toFixed(1) }</Text>
        </TouchableOpacity>
        <TouchableOpacity disabled={isLoading || directMode} onPress={_onBackPressed} style={{justifyContent:"center", alignItems:"center" , marginHorizontal: 10}}>
          <MaterialCommunityIcons name="skip-previous" color="white" size={50} />
        </TouchableOpacity>
        <TouchableOpacity disabled={isLoading} onPress={_onPlayPausePressed} style={{justifyContent:"center", alignItems:"center", marginHorizontal: 12}}>
          <MaterialCommunityIcons name={
            isPlaying
            ? "pause-circle"
            : "play-circle"
            } 
            color="white" size={80}
          />
        </TouchableOpacity>
        <TouchableOpacity disabled={isLoading || directMode} onPress={_onForwardPressed} style={{justifyContent: "center", alignItems: "center"}}>
          <MaterialCommunityIcons name="skip-next" color="white" size={50} />
        </TouchableOpacity>
        <TouchableOpacity disabled={isLoading} onPress={_onMutePressed} style={{justifyContent:"center", alignItems:"center", marginHorizontal: 10}}>
          <MaterialCommunityIcons style={{ opacity: .8 }} name={muted ? "volume-off" : "volume-high"} color="white" size={25} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: HEIGHT,
    width: WIDTH,
    paddingVertical: PADDING * 2,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    height: 50,
    width: WIDTH / 2.5,
    resizeMode: 'cover',
    marginBottom: 20
  },
  wrapper: {
    paddingHorizontal: PADDING,
  },
  cover: {
    width: WIDTH - PADDING*2,
    height: WIDTH - PADDING*2,
    borderRadius: 8,
    resizeMode: 'cover',
    overflow: 'hidden',
    backgroundColor: '#333'
  },
  title: {
    fontSize: 22,
    textAlign: 'center',
    color: '#ffffff',
    width: WIDTH - PADDING * 2,
    marginBottom: 8,
    fontWeight: 'bold'
  },
  category: {
    fontSize: 14,
    opacity: .6,
    textAlign: 'center',
    color: '#ffffff',
    textTransform: 'uppercase',
  },
  durations: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 10
  },
  duration: {
    fontSize: 12,
    color: '#ffffff',
    opacity: .7
  },
  actions: {
    paddingHorizontal: PADDING,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  directLabel: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    alignSelf:'center', 
    backgroundColor: 'rgba(204, 0, 0, .9)',
    padding: 2,
    borderRadius: 3,
  }
})

Player.propTypes = {
  directMode: PropTypes.bool,
  progressBar: PropTypes.number,
  playingDuration: PropTypes.any,
  duration: PropTypes.any,
  rate: PropTypes.number,
  cover: PropTypes.string,
  title: PropTypes.string,
  category: PropTypes.string,
  isLoading: PropTypes.bool,
  isPlaying: PropTypes.bool,
  muted: PropTypes.bool,
  _onSeekSliderValueChange: PropTypes.func,
  _onSeekSliderSlidingComplete: PropTypes.func,
  _onChangeRateChanged: PropTypes.func,
  _onBackPressed: PropTypes.func,
  _onPlayPausePressed: PropTypes.func,
  _onForwardPressed: PropTypes.func,
  _onMutePressed: PropTypes.func,
}

export default Player