import * as React from 'react';
import { Text, View, StyleSheet, ImageBackground, Image, TouchableOpacity, Share, Alert, FlatList, ScrollView, ActivityIndicator } from 'react-native';
import {Header, Icon} from 'react-native-elements'
import Constants from 'expo-constants';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'

const ListeRooms = ({navigation}) => {
    const [name, setName] = React.useState('')
    const [pass, setPass] = React.useState('')
    const [datas, setdatas] = React.useState([])
    const [loading, setLoading] = React.useState(true)

    let [fontsLoaded] = useFonts({
        'GothamBold': require('../../assets/fonts/GothamBold.ttf'),
        'GothamLight': require('../../assets/fonts/GothamLight.ttf'),
        'GothamBlack': require('../../assets/fonts/GothamBlack.otf'),
    });
    
    const getMyStringValue = async () => {
        try {
        const res = await AsyncStorage.getItem('id')
        const response = await AsyncStorage.getItem('pass')
        setName(res)
        setPass(response)
        } catch(e) {
        console.log("une erreur s'est produite");
        }    
    }

    const AllersVersChat = (code) => {
        if(name == "null" && pass == "null"){
            navigation.navigate('LoginScreen')
        }else{
            navigation.navigate('LiveMessage',{codeRoom: code})
        }
    }

    const getListRooms = async() => {
        let res = await axios.get("https://icore.network/client/getRoomsActif");
        setdatas(res.data.result)
        setLoading(false)
    }

    React.useEffect(()=>{
        getMyStringValue()
        getListRooms()
    },[])

    const Item = ({id, title, image, nbrMessage, code}) => (
        <TouchableOpacity style={styles.item} onPress={()=> AllersVersChat(code)}>
            <View style={{flex:1.2}}>
                <Image source={require('../../assets/logo.png')} style={{width:100, height:100}} />
            </View>
            <View style={{ flex:3,flexDirection: 'column', justifyContent: 'center', width:"100%"}}>
                <Text style={{fontFamily: 'GothamBlack', marginLeft:"5%"}}>{title}</Text>
                <Text style={{fontFamily: 'GothamLight', marginLeft:"5%"}}>{nbrMessage} messages</Text>
            </View>
        </TouchableOpacity>
      )

    const renderItem = ({ item }) => <Item title={item.title} image={item.image} nbrMessage={item.nbrMessage} code={item.code} />;
  return (
    <View style={{flex:1}}>
        <Header
            leftComponent={
            <TouchableOpacity onPress={()=>navigation.goBack()}>
                <Icon name="arrow-back" color="#E0801E" size={40} />
            </TouchableOpacity>
            }
            centerComponent={
                <Text style={styles.titleAppBar}>Life</Text>
            }
            containerStyle={{
            backgroundColor:"#fff",
            }}
        />
        <View style={{flex:1, flexDirection:'column'}}>
            <ImageBackground style={{flex:1.5, backgroundColor:"#fff"}} source={require('../../assets/cover_chat.jpeg')} imageStyle={{resizeMode:'cover'}}></ImageBackground>
            <View style={{flex:3}}>
                <ImageBackground style={styles.profil} source={require('../../assets/logo.png')} imageStyle={{resizeMode:'cover', width:130, height:130, borderRadius:65}}></ImageBackground>
                <Text style={styles.name}>Life Radio</Text>
                <ScrollView style={{padding:8}}>
                {loading ? (
                    <View style={{flex:1, justifyContent: 'center', alignItems: 'center', }}>
                    <ActivityIndicator
                        //visibility of Overlay Loading Spinner
                        visible={loading}
                        color="#573178"
                        size="large"
                    />
                    </View>
                    ) : (
                        <FlatList
                            data={datas}
                            renderItem={renderItem}
                            keyExtractor={item => item?.id}
                        />
                    )}
                </ScrollView>
            </View>
        </View>
    </View>
  )
}

export default ListeRooms

const styles = StyleSheet.create({
    titleAppBar:{
        color:"#573178",
        fontSize:23,
        fontWeight:"bold",
        position:"absolute",
        top:"15%"
    },
    profil:{
        width:130,
        height:130,
        borderRadius:65,
        position:"relative",
        top:"-13%",
        marginLeft:10,
        backgroundColor: "#fff",
        overflow: 'hidden',
    },
    name:{
        fontFamily:"GothamBlack",
        fontSize:18,
        position:"relative",
        marginLeft:"6%",
        top:"-12%"
    },
    item:{
        borderWidth:1,
        borderColor:'gray',
        marginBottom:5, 
        flexDirection: 'row',
        padding:6,
        backgroundColor: "#fff",
        borderRadius:10
    }
})