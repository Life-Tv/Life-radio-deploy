import React from "react";
import {
  Audio,
} from "expo-av";

import AnimatedPlayerWrapper from "./AnimatedPlayerWrapper";
import Player from "./Player";
import StickyPlayer from "./StickyPlayer";

const LOADING_STRING = 'Chargement...'
const RATE_SCALE = 2;

const PlayerContext = React.createContext()

class PlayerProvider extends React.Component {
  constructor(props) {
    super(props);
    this.index = 0;
    this.isSeeking = false;
    this.shouldPlayAtEndOfSeek = false;
    this.playbackInstance = null;
    this.state = {
      playlist: null,
      // context state
      showPlayer: false,
      showStickyPlayer: false,
      // End context state
      directMode: false,
      playbackInstanceRef: null, // format {{category}}_{{id}} example Podcast_2
      playbackInstanceName: LOADING_STRING,
      playbackInstanceId: null,
      playbackInstanceCategory: null,
      playbackInstanceCover: null,
      muted: false,
      playbackInstancePosition: null,
      playbackInstanceDuration: null,
      shouldPlay: false,
      isPlaying: false,
      isBuffering: false,
      isLoading: false,
      shouldCorrectPitch: true,
      volume: 1.0,
      rate: 1.0,
    };

  }

  componentDidMount() {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
     //  interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
     //  interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
      playThroughEarpieceAndroid: false
    });
  }

  async _loadNewPlaybackInstance(playing) {
    try {
      if (this.playbackInstance != null) {
        await this.playbackInstance.unloadAsync();
        this.playbackInstance = null;
      }

      const source = { uri: this.state.playlist[this.index].uri };
      const initialStatus = {
        shouldPlay: playing,
        rate: this.state.rate,
        shouldCorrectPitch: this.state.shouldCorrectPitch,
        volume: this.state.volume,
        isMuted: this.state.muted,
      };

      const { sound, status } = await Audio.Sound.createAsync(
        source,
        initialStatus,
        this._onPlaybackStatusUpdate
      );
      this.playbackInstance = sound;

      this._updateScreenForLoading(false);
    } catch (error) {
      console.log("ERREUR: ", error)
      this.setState({
        isLoading: false
      })
    }
  }

  _updateScreenForLoading(isLoading) {
    if (isLoading) {
      this.setState({
        showVideo: false,
        isPlaying: false,
        playbackInstanceName: LOADING_STRING,
        playbackInstanceDuration: null,
        playbackInstancePosition: null,
        isLoading: true
      });
    } else {
      this.setState({
        playbackInstanceName: this.state.playlist[this.index].name,
        playbackInstanceId: this.state.playlist[this.index].id,
        playbackInstanceCover: this.state.playlist[this.index].cover,
        playbackInstanceCategory: this.state.playlist[this.index].category,
        playbackInstanceRef: `${this.state.playlist[this.index].category}_${this.state.playlist[this.index].id}`,
        isLoading: false
      });
    }
  }

  _onPlaybackStatusUpdate = status => {
    if (status.isLoaded) {
      this.setState({
        playbackInstancePosition: status.positionMillis,
        playbackInstanceDuration: status.durationMillis,
        shouldPlay: status.shouldPlay,
        isPlaying: status.isPlaying,
        isBuffering: status.isBuffering,
        rate: status.rate,
        muted: status.isMuted,
        volume: status.volume,
        shouldCorrectPitch: status.shouldCorrectPitch
      });
      if (status.didJustFinish && !status.isLooping) {
        this._advanceIndex(true);
        this._updatePlaybackInstanceForIndex(true);
      }
    } else {
      if (status.error) {
        console.log(`FATAL PLAYER ERROR: ${status.error}`);
      }
    }
  };

  _advanceIndex(forward) {
    this.index =
      (this.index + (forward ? 1 : this.state.playlist.length - 1)) % this.state.playlist.length;
  }

  async _updatePlaybackInstanceForIndex(playing) {
    this._updateScreenForLoading(true);
    this._loadNewPlaybackInstance(playing);
  }

  _onPlayPausePressed = () => {
    if (this.playbackInstance != null) {
      if (this.state.isPlaying) {
        this.playbackInstance.pauseAsync();
      } else {
        this.playbackInstance.playAsync();
      }
    }
  };

  _onForwardPressed = () => {
    if (this.playbackInstance != null) {
      this._advanceIndex(true);
      this._updatePlaybackInstanceForIndex(this.state.shouldPlay);
    }
  };

  _onBackPressed = () => {
    if (this.playbackInstance != null) {
      this._advanceIndex(false);
      this._updatePlaybackInstanceForIndex(this.state.shouldPlay);
    }
  };

  _onMutePressed = () => {
    if (this.playbackInstance != null) {
      this.playbackInstance.setIsMutedAsync(!this.state.muted);
    }
  };

  _onChangeRateChanged = async () => {
    try {
      if(this.playbackInstance != null) {
        const RATE = (this.state.rate == RATE_SCALE)? 1 : parseFloat((this.state.rate + 0.2).toFixed(2))
        await this.playbackInstance.setRateAsync(RATE, this.state.shouldCorrectPitch)
        this.setState({
          rate: RATE
        })
      }
    } catch (error) {
      console.log("ERROR: ", error)
    }
  }

  _onSeekSliderValueChange = value => {
    if (this.playbackInstance != null && !this.isSeeking) {
      this.isSeeking = true;
      this.shouldPlayAtEndOfSeek = this.state.shouldPlay;
      this.playbackInstance.pauseAsync();
    }
  };

  _onSeekSliderSlidingComplete = async value => {
    if (this.playbackInstance != null) {
      this.isSeeking = false;
      const seekPosition = value * this.state.playbackInstanceDuration;
      if (this.shouldPlayAtEndOfSeek) {
        this.playbackInstance.playFromPositionAsync(seekPosition);
      } else {
        this.playbackInstance.setPositionAsync(seekPosition);
      }
    }
  };

  _getSeekSliderPosition() {
    if (
      this.playbackInstance != null &&
      this.state.playbackInstancePosition != null &&
      this.state.playbackInstanceDuration != null
    ) {
      return (
        this.state.playbackInstancePosition /
        this.state.playbackInstanceDuration
      );
    }
    return 0;
  }

  _getMMSSFromMillis(millis) {
    const totalSeconds = millis / 1000;
    const seconds = Math.floor(totalSeconds % 60);
    const minutes = Math.floor(totalSeconds / 60);

    const padWithZero = number => {
      const string = number.toString();
      if (number < 10) {
        return "0" + string;
      }
      return string;
    };
    return padWithZero(minutes) + ":" + padWithZero(seconds);
  }

  _getTimestamp(position) {
    if (
      this.playbackInstance != null &&
      this.state.playbackInstancePosition != null &&
      this.state.playbackInstanceDuration != null
    ) {
      return position == 0? this._getMMSSFromMillis(
        this.state.playbackInstancePosition
      ) : this._getMMSSFromMillis(
        this.state.playbackInstanceDuration
      )
    }
    return "";
  }

  // Context Method
  // init the player with all properties
  initPlaylist = ({
    playlist,
    directMode
  }) => { 
    this.setState({
      playlist: playlist,
      directMode: directMode
    })
  }

  onPlayOrPause = (index, ref) => { // ref is {{category}}_{{id}}

    this.index = index;
    this.setState({
      showStickyPlayer: true
    })

    if(this.playbackInstance != null && this.state.playbackInstanceRef == ref) {
      this._onPlayPausePressed()
    } else {
      this._updatePlaybackInstanceForIndex(true)
    }
  }

  closeStickyPlayer = () => {
    this.setState({
      showStickyPlayer: false
    })
  }

  render() {
    const { children } = this.props
    return (
      <PlayerContext.Provider value={{
        initPlaylist: this.initPlaylist,
        onPlayOrPause: this.onPlayOrPause,
        isPlaying: this.state.isPlaying,
        isLoading: this.state.isLoading,
        directMode: this.state.directMode,
        playbackInstanceId: this.state.playbackInstanceId,
        playbackInstanceCategory: this.state.playbackInstanceCategory,
        playbackInstanceRef: this.state.playbackInstanceRef,
      }}>
        <AnimatedPlayerWrapper
          showPlayer={this.state.showPlayer} 
          showStickyPlayer={this.state.showStickyPlayer} 
          children={children}
          instance={this.playbackInstance != null}
          closeStickyPlayer={this.closeStickyPlayer}
          player={
            <Player
              directMode={this.state.directMode}
              progressBar={this._getSeekSliderPosition()} 
              cover={this.state.playbackInstanceCover} 
              title={this.state.playbackInstanceName}
              category={this.state.playbackInstanceCategory}
              playingDuration={this._getTimestamp(0)}
              duration={this._getTimestamp(1)}
              isLoading={this.state.isLoading}
              isPlaying={this.state.isPlaying}
              muted={this.state.muted}
              rate={this.state.rate}
              _onBackPressed={this._onBackPressed}
              _onForwardPressed={this._onForwardPressed}
              _onPlayPausePressed={this._onPlayPausePressed}
              _onMutePressed={this._onMutePressed}
              _onChangeRateChanged={this._onChangeRateChanged}
              _onSeekSliderValueChange={this._onSeekSliderValueChange}
              _onSeekSliderSlidingComplete={this._onSeekSliderSlidingComplete}
            />
          }
          stickyPlayer={
            <StickyPlayer 
              progressBar={this._getSeekSliderPosition()} 
              cover={this.state.playbackInstanceCover}
              title={this.state.playbackInstanceName}
              isPlaying={this.state.isPlaying}
              _onPlayPausePressed={this._onPlayPausePressed}
              instance={this.playbackInstance != null}
              closeStickyPlayer={this.closeStickyPlayer}
            />
          }
        />
      </PlayerContext.Provider>
    )
  }
}

export { PlayerProvider }
export default PlayerContext