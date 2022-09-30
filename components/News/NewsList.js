import React,{useState, useEffect} from 'react';
import { Text, View, StyleSheet, FlatList, ImageBackground, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import {Header, Icon, SearchBar} from 'react-native-elements'
import Constants from 'expo-constants';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import axios from 'axios'

const NewsList = ({navigation}) => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [categorie, setCategorie] = useState([])

  let [fontsLoaded] = useFonts({
    'GothamBold': require('../../assets/fonts/GothamBold.ttf'),
    'GothamLight': require('../../assets/fonts/GothamLight.ttf'),
    'GothamBlack': require('../../assets/fonts/GothamBlack.otf'),
  });

  const getNews = async () => {
    let res = await axios.get("https://www.icore.network/client/getActualities?limit=10");
    setData(res.data.result)
    setLoading(false)
  }

  const getCategories = async() => {
    const endpoint = "https://www.icore.network/client/getAllCategoriesActuality"
    let res = await axios.get(endpoint)
    setCategorie(res.data.result)
  }

  useEffect(()=>{
    getCategories()
    getNews()
  },[])
  
  const Item = ({id, cover,titleActuality, titleCategorieActuality, content}) => (
    <TouchableOpacity style={styles.item} onPress={()=> navigation.navigate('NewsDetails',{image: cover, title: titleActuality, id: id, content: content})}>
      <View style={styles.image}>
        <Image source={{uri:"https://www.icore.network/actualities/"+cover}} style={{height:170, borderRadius:25}} />
      </View>
      <Text style={styles.title}>{titleActuality}</Text>
      <Text style={{borderWidth:1, margin:4, borderRadius:5, padding:4, backgroundColor :"#E0801E", opacity:0.6, textAlign:"center", width:200, alignSelf: 'center',fontFamily:"GothamBlack"}}>{titleCategorieActuality}</Text>
    </TouchableOpacity>
  )

  const Item2 = ({id, title}) => (
    <TouchableOpacity style={{flex:1, borderWidth:1, margin:4, borderRadius:5, padding:4, backgroundColor :"#573178", opacity:0.5}} onPress={()=>navigation.navigate('ListeParCategorie',{id_categorie: id, title:title})}>
      <Text style={{color:"#000", fontWeight:"bold", textAlign:"center"}}>{title}</Text>
    </TouchableOpacity>
  )

  const renderItem = ({ item }) => <Item cover={item.cover} titleCategorieActuality={item.titleCategorieActuality}  content={item.content} titleActuality={item.titleActuality} />;
  const renderCategorie = ({ item }) => <Item2 id={item.id} title={item.title} />

  return(
    <View style={{flex:1, backgroundColor:"#fff"}}>
      <Header
        centerComponent={
          <Text style={styles.titleAppBar}>Actualités</Text>
        }
        containerStyle={{
          backgroundColor:"#fff",
          marginBottom:"9%"
        }}
      />
      <ScrollView style={{flex:1}}>
        <ImageBackground style={styles.container} source={require('../../assets/background.jpeg')} imageStyle={{resizeMode: 'cover'}}>
          {loading ? (
        <View style={{flex:1, justifyContent: 'center', alignItems: 'center',}}>
          <ActivityIndicator
            visible={loading}
            color="#573178"
            size="large"
          />
        </View>
        ) : (
            <View style={styles.listNews}>
              <Text style={{fontSize:19,fontFamily:"GothamBold"}}>Catégories</Text>
              <View style={{flex:1, marginBottom:10}}>
                <FlatList
                  data={categorie}
                  renderItem={renderCategorie}
                  keyExtractor={item => item.id}
                  numColumns={3}
                />
              </View>
              <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={item => item?.id}
              />
            </View>            
        )}
        </ImageBackground>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    padding:10,
  },
  listNews:{
    marginTop:"1%",
    flex:1
  },
  titleAppBar:{
    color:"#573178",
    fontSize:23,
    fontWeight:"bold",
    position:"absolute",
    top:"15%"
  },
  item:{
    marginBottom:15
  },
  image: {
    flex: 1,
    justifyContent: "center",
    height:170,
    marginBottom:10,
    borderRadius:25,
    overflow:"hidden"
  },
  title:{
    fontSize:17,
    fontFamily:"GothamBold",
    textAlign:"center"
  },
  subtitle:{
    fontSize:18.5,
    fontFamily:"GothamLight"
  }
})

export default NewsList