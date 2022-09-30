import React,{useState, useEffect} from 'react';
import { Text, View, StyleSheet, FlatList, ImageBackground, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import {Header, Icon, SearchBar} from 'react-native-elements'
import { useFonts } from 'expo-font';
import axios from 'axios'

const ListeParCategorie = ({navigation, route}) => {
    const {id_categorie, title} = route.params
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    let [fontsLoaded] = useFonts({
        'GothamBold': require('../../assets/fonts/GothamBold.ttf'),
        'GothamLight': require('../../assets/fonts/GothamLight.ttf'),
        'GothamBlack': require('../../assets/fonts/GothamBlack.otf'),
    });

    const getNewsByCategory = async () => {
        let res = await axios.get("https://www.icore.network/client/getAllActualityByCategorie/"+id_categorie);
        setData(res.data.result)
        setLoading(false)
    }

    useEffect(()=>{
        getNewsByCategory()
    },[])

    const Item = ({id, cover,title, subtitle, content}) => (
        <TouchableOpacity style={styles.item} onPress={()=> navigation.navigate('NewsDetails',{image: cover, title: title, id: id, content: content})}>
          <View style={styles.image}>
            <Image source={{uri:"https://www.icore.network/actualities/"+cover}} style={{height:170, borderRadius:25}} />
          </View>
          <Text style={styles.title}>{title}</Text>
        </TouchableOpacity>
    )

    const renderItem = ({ item }) => <Item cover={item.cover} subtitle={item.subtitle} content={item.content} title={item.title} />;

  return (
    <View style={{flex:1, backgroundColor:"#fff"}}>
      <Header
        leftComponent={
            <TouchableOpacity onPress={()=> navigation.goBack()}>
                <Icon name="arrow-back" color="#E0801E" size={40} />
            </TouchableOpacity>
        }
        centerComponent={
          <Text style={styles.titleAppBar}>{title}</Text>
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

export default ListeParCategorie

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