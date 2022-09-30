import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useCallback, useState } from "react";
import { useEffect } from "react";
import { TouchableOpacity, View } from "react-native";
import {
  TouchableWithoutFeedback, Dimensions
} from "react-native";

import { GestureHandlerRootView, PanGestureHandler } from "react-native-gesture-handler";
import { getBottomSpace, getStatusBarHeight } from "react-native-iphone-x-helper";
import Animated, { StretchInY, StretchOutY, useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { STICKY_HEIGHT } from "./StickyPlayer";

export const BOTTOM = getBottomSpace()

export const STICKY_PADDING = 12
export const { width: WIDTH, height: HEIGHT } = Dimensions.get('screen');
export const MINI_BOTTOM = HEIGHT;

const STATUS_BAR_HEIGHT = getStatusBarHeight();

const AnimatedPlayerWrapper = (props) => {

  const translateY = useSharedValue(MINI_BOTTOM)

  const { showStickyPlayer, instance, closeStickyPlayer } = props

  const scrollTo = useCallback((destination) => {
    'worklet';
    translateY.value = withSpring(destination, { damping: 15 })
  }, [])

  const _onPanGestureEvent = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.translateY = translateY.value
    },
    onActive: (event, context) => {
      if(event.translationY > 0 ) {
        translateY.value = event.translationY + context.translateY
      }
    },
    onEnd: () => {
      if(translateY.value > HEIGHT / 5) {
        scrollTo(MINI_BOTTOM)
      } else {
        scrollTo(0)
      }
    },
  })

  const animateScrollToTop = useCallback(() => {
    'worklet';
    if(translateY.value > 0) {
      scrollTo(0)
    }
  }, [])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    }
  });

  return (
  <GestureHandlerRootView style={{flex: 1}}>
    <>
    <TouchableWithoutFeedback onPress={animateScrollToTop}>
      <Animated.View 
        entering={StretchInY}
        exiting={StretchOutY.duration(100)}
        style={{width: '100%', height: (showStickyPlayer && instance) ? STICKY_HEIGHT : 0, marginBottom: STATUS_BAR_HEIGHT, top: (showStickyPlayer && instance) ? STATUS_BAR_HEIGHT : -100}}
      >
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
          { props.stickyPlayer }
          <TouchableOpacity style={{position: 'absolute', right: 5}} onPress={closeStickyPlayer}>
            <MaterialCommunityIcons name="close" color="#fff" size={26}/>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
    {props.children}
    {/* style={{ flex: 1, position: 'absolute', top: 0}} */}
    <PanGestureHandler onGestureEvent={_onPanGestureEvent}>
      <Animated.View style={[{flex: 1, position: 'absolute'}, animatedStyle]}> 
        <View style={{flex: 1, backgroundColor: '#fff'}}>
          <View style={{position: 'absolute', top: STATUS_BAR_HEIGHT + 5, left: 10, zIndex: 999}}>
            <TouchableOpacity onPress={() => scrollTo(MINI_BOTTOM)}>
              <MaterialCommunityIcons name="chevron-down" color="#fff" size={35}/>
            </TouchableOpacity>
          </View>
          { props.player }
        </View>
      </Animated.View>
    </PanGestureHandler>
    </>
  </GestureHandlerRootView>
  )
}

export default AnimatedPlayerWrapper;