import React,{useState, useEffect} from 'react';
import { Text, View, StyleSheet, FlatList, ImageBackground, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import {Header, Icon} from 'react-native-elements'
import Constants from 'expo-constants';
import {Button, Searchbar} from "react-native-paper"
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';

const PocastsList = ({navigation}) => {
  const [categories, setcategories] = useState([])
  const [replays, setreplays] = useState([])
  const [loading, setLoading] = useState(true)
  const [loading2, setLoading2] = useState(true)
  const [search, setsearch] = useState("")
  const [showSearchBar, setshowSearchBar] = useState(true)

  const getCategories = async () => {
    let res = await axios.get("https://www.icore.network/client/getAllCategoriePodcasts");
      setcategories(res.data.result.allPodcastsCategorie)
      setLoading(false)
  }

  const getReplays = async () => {
    let res = await axios.get("https://www.icore.network/client/getAllCategoriePodcasts");
      setreplays(res.data.result.allReplays)
      setLoading2(false)
  }

  const getData = async () => {
    try {
      const liveStatus = await AsyncStorage.getItem('live_status')
      console.log(liveStatus)
    } catch(e) {
      console.log('erreur survenue', e)
    }
  }

  const onChangeSearch = query => setsearch(query);

  const searchInFlatlist = async(e) =>{
    setLoading(true)
    setLoading2(true)
    let text = e.toLowerCase();
    let trucks = categories;

    let filteredName = trucks.filter((item) => {
      return item.title.toLowerCase().match(text)
    })

    if (!text || text === '') {
      setcategories([])
      setLoading(false)
      setLoading2(false)
    } else if (Array.isArray(filteredName)) {
      setcategories(filteredName)
      setLoading(false)
      setLoading2(false)
    }

  }

  const showBar = () => {
    if(showSearchBar == true){
      return(
        <View style={{width:"100%", flexDirection: 'row',flex:1}}>
          <View style={{flex:4}}>
            <Searchbar
              placeholder="Recherche"
              onChangeText={onChangeSearch}
              value={search}
              onIconPress={()=>searchInFlatlist(search)}
              InputStyle={{fontSize:18}}
            />
          </View>
        </View>
      )
    }
  }

  let [fontsLoaded] = useFonts({
    'GothamBold': require('../../assets/fonts/GothamBold.ttf'),
    'GothamLight': require('../../assets/fonts/GothamLight.ttf'),
    'GothamBlack': require('../../assets/fonts/GothamBlack.otf'),
  });

  const Item = ({id, title, audioName, cover}) => (
    <TouchableOpacity style={styles.item} onPress={()=> navigation.navigate('ReplaysDetails',{title:title, audioName:audioName, cover:cover})}>
    <View style={{width:"100%", height:157, marginBottom:8, borderRadius:12, borderWidth:1}}>
      <Image source={{uri: "https://www.icore.network/replays/"+cover}} style={{width:"100%", height:155, borderRadius:15}} />
    </View>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  )

  const Item2 = ({id, title, cover}) => (
    <TouchableOpacity style={styles.item2} onPress={()=> navigation.navigate('PodcastsDetails',{id:id,title:title, image:cover})}>
    <View style={{borderWidth:1, marginBottom:8, borderRadius:8}}>
      <Image source={{uri: "https://www.icore.network/podcasts/"+cover}} style={{width:150, height:155, borderRadius:15}} />
    </View>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  )

  const renderItem = ({ item }) => <Item title={item.title} audioName={item.audioName} cover={item.cover} />;
  const renderItem2 = ({ item }) => <Item2 title={item.title} cover={item.cover} id={item.id} />;

  useEffect(()=> {
    getCategories()
    getReplays()
    getData()
  },[])
  return(
    <View style={{flex:1, backgroundColor: "#fff",}}>
      <Header
        centerComponent={
          <Text style={styles.titleAppBar}>Podcasts</Text>
        }
        containerStyle={{
          backgroundColor:"#fff",
          marginBottom:"9%"
        }}
      />
        <ImageBackground source={require('../../assets/background.jpeg')} style={{flex:1, width:"100%", height:"100%"}}>
          <ScrollView style={{padding:10}}>
            {showBar()}
            <View style={{marginTop:25, flex:1}}>
              <View>
                <Text style={{fontFamily:'GothamBlack', fontSize:22, position:"relative", left:"2%", marginBottom:10}}>Replays</Text>
                {loading2 ? (
                  <View>
                    <ActivityIndicator
                      visible={loading2}
                      color="#573178"
                      size="large"
                    />
                  </View>
                  ) : (
                    <>
                    {replays.length < 1 ?
                      (<Text style={{marginLeft:5}}>Aucun replay n'est disponible pour le moment</Text>):(
                        <FlatList
                          data={replays}
                          renderItem={renderItem}
                          keyExtractor={item => item?.id}
                        />
                      )
                    }
                    </>            
                )}
                
              </View>
              <View style={{flex:1}}>
                <Text style={{fontFamily:'GothamBlack', fontSize:22, position:"relative", left:"2%", marginBottom:10, marginTop:10}}>Podcasts</Text>
                {loading ? (
                  <View>
                    <ActivityIndicator
                      visible={loading}
                      color="#573178"
                      size="large"
                    />
                  </View>
                  ) : (
                    <>
                      {
                        categories.length < 1 ?
                        ( <Text Text style = {{marginLeft: "2%",}}> Aucun podcast n 'est disponible pour le moment</Text>):(
                          <FlatList
                            data={categories}
                            numColumns={2}
                            renderItem={renderItem2}
                            keyExtractor={item => item?.id}
                          />
                        )
                      }
                    </>            
                )}
              </View>
            </View>
          </ScrollView>
        </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    padding:10,
  },
  titleAppBar:{
    color:"#573178",
    fontSize:23,
    fontWeight:"bold",
    position:"absolute",
    top:"15%"
  },
  title:{
    fontSize:12,
    textAlign:"center",
    fontFamily:"GothamBold"
  },
  image: {
    flex: 1,
    justifyContent: "center",
    height:100,
    width:95,
    marginBottom:10,
    borderRadius:25,
    overflow:"hidden"
  },
  item:{
    margin:8
  },
  item2:{
    margin:8,
    marginBottom:20,
    width:"45%"
  }
})

export default PocastsList