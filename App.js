import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Player from "./components/Player"
import NewsList from './components/News/NewsList'
import NewsDetails from './components/News/NewsDetails'
import Programmes from './components/Programmes'
import { NavigationContainer } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import PodcastsList from './components/Podcasts/PodcastsList'
import PodcastsDetails from "./components/Podcasts/PodcastsDetails"
import ReplaysDetails from './components/Podcasts/ReplaysDetails'
import Video from './components/Videos'
import ListeRooms from './components/Reactions/ListeRooms'
import LoginScreen from './components/Reactions/LoginScreen'
import RegisterScreen from './components/Reactions/RegisterScreen'
import LiveMessage from "./components/LiveMessage"
import Settings from "./components/Settings"
import { PlayerProvider } from './components/Players/PlayerProvider';
import ListeParCategorie from './components/News/ListeParCategorie';
import VideoPlayer from './components/VideoPlayer';

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Direct"
      //activeColor="#fff"
      labelStyle={{ fontSize: 12}}
      //tabBarStyle={{backgroundColor:"#573178"}}
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: "#573178" },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: 'gray'
      }}
    >
      <Tab.Screen
        name="Programmes"
        component={Programmes}
        options={{
          tabBarLabel: 'Programmes',
          tabBarShowLabel: true,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="format-list-bulleted" color={color} size={26} />
          ),
        }}
      />

      <Tab.Screen
        name="Podcasts"
        component={PodcastsList}
        options={{
          tabBarLabel: 'Podcasts',
          tabBarShowLabel: true,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="podcast" color={color} size={26} />
          ),
        }}
      />

      <Tab.Screen
        name="Direct"
        component={Player}
        options={{
          tabBarLabel: 'Direct',
          tabBarShowLabel: true,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="radio-tower" color={color} size={26} />
          ),
        }}
      />

      <Tab.Screen
        name="Video"
        component={Video }
        options={{
          tabBarLabel: 'Vidéos',
          tabBarShowLabel: true,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="play-box" color={color} size={26} />
          ),
        }}
      />

      <Tab.Screen
        name="News"
        component={NewsList}
        options={{
          tabBarLabel: 'Actualités',
          tabBarShowLabel: true,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="newspaper-variant-outline" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function MyStack(){
  return(
    <Stack.Navigator initialRouteName="Tabs" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={MyTabs} />
      <Stack.Screen name="NewsDetails" component={NewsDetails} />
      <Stack.Screen name="ListeParCategorie" component={ListeParCategorie} />
      <Stack.Screen name="PodcastsDetails" component={PodcastsDetails} />
      <Stack.Screen name="ReplaysDetails" component={ReplaysDetails} />
      <Stack.Screen name="ListeRooms" component={ListeRooms} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
      <Stack.Screen name="LiveMessage" component={LiveMessage} />
      <Stack.Screen name="Direct" component={Player} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="VideoPlayer" component={VideoPlayer} />

    </Stack.Navigator>
  )
}

export default function App() {
  return (
    <PlayerProvider>
      <NavigationContainer>
        <MyStack />
      </NavigationContainer>
    </PlayerProvider>
  );
}

