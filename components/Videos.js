import React,{useState, useEffect} from 'react'
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  ImageBackground,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  RefreshControl
} from 'react-native';
import { Header } from 'react-native-elements';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import axios from 'axios';

const { width: WIDTH } = Dimensions.get('screen');

const Item = (props) => {
  const { videoName, navigation} = props;
  const [item, setItem] = useState(null)
  const videoID = videoName.split("=")[1]

  console.log("ID: ", videoID)
  useEffect(() => {
    axios.get(`https://www.youtube.com/oembed?url=${videoName}&format=json`)
    .then(data => {
      setItem(data.data)
    })
    .catch(error => {
      console.error("Erreur: ", error)
    })
  }, [])
  return(
    <TouchableOpacity onPress={() => navigation.navigate("VideoPlayer", { videoID: videoID })}>
      <View style={styles.item}>
        <View>
          <Image style={styles.thumbnail} source={{uri: item?.thumbnail_url}}/>
          <MaterialCommunityIcons style={{position: 'absolute', alignSelf: 'center', top: '40%'}} name='play-circle-outline' color='#fff' size={60}/>
        </View>
        <View style={{ marginTop: 10 }}>
          <Text numberOfLines={2} style={styles.title}>{ item?.title }</Text>
          <Text style={styles.author}>{ item?.author_name }</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const Video = ({navigation}) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [refresh, setRefresh] = useState(false)
  

  let [fontsLoaded] = useFonts({
    'GothamBold': require('../assets/fonts/GothamBold.ttf'),
    'GothamLight': require('../assets/fonts/GothamLight.ttf'),
    'GothamBlack': require('../assets/fonts/GothamBlack.otf'),
  });

  const renderItem = ({ item }) => <Item title={item.title} videoName={item.videoName} navigation={navigation} />;

  const getVideos = async () => {
    let res = await axios.get("https://www.icore.network/client/getAllMovies")
    setData(res.data.result)
    setLoading(false)
  }

  useEffect(()=> {
    getVideos()
  },[])

  return(
    <View style={styles.container}>
      <Header
        centerComponent={
          <Text style={styles.titleAppBar}>Vidéos</Text>
        }
        containerStyle={{
          backgroundColor:"#fff",
          marginBottom:"9%"
        }}
      />
      <View style={{width:"100%", height:"100%", flex:1,}}>
        <ImageBackground style={{width:"100%", height:"100%", flex:1}} source={require('../assets/background.jpeg')} imageStyle={{resizeMode: 'cover'}}>
        {loading ? (
        <View style={styles.listNews}>
          <ActivityIndicator
            visible={loading}
            color="#573178"
            size="large"
          />
        </View>
        ) : (
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={item => item?.id}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl
                  colors={["#9Bd35A", "#689F38"]}
                  refreshing={false}
                  onRefresh={()=> getVideos()}
                />}
          />           
        )}
        </ImageBackground>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: "#fff",
  },
  item:{
    margin: 20
  },
  titleAppBar:{
    color:"#573178",
    fontSize:23,
    fontWeight:"bold",
    position:"absolute",
    top:"15%"
  },
  title:{
    fontSize: 16,
    fontFamily:"GothamBlack",
    marginBottom: 5,
  },
  author:{
    fontSize: 14,
    fontFamily:"GothamBlack",
    opacity: .5
  },
  thumbnail: {
    resizeMode: 'cover',
    width: '100%',
    height: WIDTH / 1.5,
    borderRadius: 10
  }
})

export default Video