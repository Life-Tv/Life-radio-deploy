import React,{useEffect, useState, useCallback, useRef} from 'react';
import { Text, View, StyleSheet, ImageBackground, Image, TouchableOpacity, Share, Alert, FlatList, ScrollView } from 'react-native';
import {Header, Icon, Input} from 'react-native-elements'
import Constants from 'expo-constants';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'
import { Avatar, Snackbar } from 'react-native-paper';
import io from "socket.io-client";

let socket = io("https://socket.icore.network/lifeRadioLive")

const LiveMessage = ({navigation, route}) => {
    const [chat, setChat] = useState([])
    const [userConnected, setUserConnected] = useState(null)
    const [message, setMessage] = useState('')
    const [userId, setUserId] = useState(null)
    const [visible, setVisible] = useState(false)

    const {codeRoom} = route.params

    let [fontsLoaded] = useFonts({
        'GothamBold': require('../assets/fonts/GothamBold.ttf'),
        'GothamLight': require('../assets/fonts/GothamLight.ttf'),
        'GothamBlack': require('../assets/fonts/GothamBlack.otf'),
    });

    const logout = async () => {
        try {
            await AsyncStorage.setItem('id',"null")
            return navigation.navigate('Tabs')
        } catch (error) {
            console.log("une erreur s'est produite")
        }
    }

    const onDismissSnackBar = () => setVisible(false);

    const AvatarText = (name) =>{
        let matches = name.match(/\b(\w)/g);
        var acronym = matches.join('');
        return acronym
    }

      const getMyStringValue = async () => {
        try {
        const res = await AsyncStorage.getItem('id')
        setUserId(res)
        } catch(e) {
        console.log("une erreur s'est produite");
        }    
    }

    const Item = ({key, author, content, created_at}) => (
    <View style={styles.item}>
        <View>
            <Avatar.Text size={45} label={AvatarText(author)} labelStyle={{textTransform:"uppercase"}} />
        </View>
        <View style={{flexDirection: 'column', justifyContent: 'center'}}>
            <Text style={{fontFamily: 'GothamBlack', marginLeft:"5%", textTransform:"capitalize"}}>{author}</Text>
            <Text style={{fontFamily: 'GothamBold', marginLeft:"5%", textAlign:"justify"}}>{content}</Text>
        </View>
    </View>
    )

    const renderItem = ({ item }) => <Item key={item.key} author={item.author} content={item.content} created_at={item.created_at} />;

    const sendHandleMessage =(content)=>{
        if(message == "" || message == " "){
            Alert.alert("Oups",'veuillez saisir un message !')
        }else{
            socket.emit('sendMessage',{content, room:codeRoom, idUser:userId})
            socket.on('locked',(data) => {
                if (data.message == "Vous n'avez pas le droit d'envoyer un message dans cet espace.") {
                    setVisible(!visible);
                }
            })
            setMessage('')
        }
    }

    useEffect(()=>{
        getMyStringValue()
        socket.on('connect', () => {
            console.log('connected')
        })
        socket.emit('getMessage',{room:codeRoom})
        socket.on('receiveAllMessage',(data)=>{
            setChat(data.allMessage)
            setUserConnected(data.numberClientInRoom)
        })
        socket.on('receiveMessage',(data)=>{
            setChat(data.allMessage)
            setUserConnected(data.numberClientInRoom)
        })
    },[])

    return (
        <View style={{flex:1}}>
            <Header
                leftComponent={
                <TouchableOpacity onPress={()=> navigation.goBack()}>
                    <Icon name="arrow-back" color="#E0801E" size={40} />
                </TouchableOpacity>
                }
                centerComponent={
                    <Text style={styles.titleAppBar}>Messages Live</Text>
                }
                rightComponent={
                    <TouchableOpacity onPress={logout}>
                        <MaterialCommunityIcons name="logout" size={38} color="#573178" />
                    </TouchableOpacity>
                }
                containerStyle={{
                backgroundColor:"#fff",
                }}
            />
        <View style={{flex:1}}>
            <ScrollView style={{flex:1, padding:8}}>
                <Text style={{textAlign:'center', fontFamily: "GothamLight", marginBottom:10}}>Personnes connectés: {userConnected}</Text>
                <FlatList
                    data={chat}
                    renderItem={renderItem}
                    keyExtractor={item => item.key}
                />
            </ScrollView>
            <View style={{flexDirection:"row", position:"absolute", width:"100%", bottom:1, alignItems: 'center', backgroundColor: "#fff",}}>
                <View style={{width:"90%", justifyContent: 'center', alignItems: 'center',}}>
                    <Input
                        placeholder="Entrez votre réaction"
                        onChangeText={text => setMessage(text)}
                        value={message}
                    />
                </View>
                <TouchableOpacity onPress={()=> sendHandleMessage(message)}>
                    <MaterialCommunityIcons name="send" size={38} color="#573178" />
                </TouchableOpacity>
                </View>
                <Snackbar
                visible = {
                    visible
                }
                onDismiss = {
                    onDismissSnackBar
                }
                action = {
                        {
                            label: "Compris !",
                            onPress: () => {
                                // Do something
                            },
                        }
                    } >Vous avez été bloqué sur cet espace pour non respect des conditions générales d 'utilisation </Snackbar>
        </View>
        </View>
    )
}

export default LiveMessage

const styles = StyleSheet.create({
    titleAppBar:{
        color:"#573178",
        fontSize:23,
        fontWeight:"bold",
        position:"absolute",
        top:"15%"
      },
      item:{
        borderColor:'gray',
        marginBottom:5, 
        flexDirection: 'row',
        padding:6,
    }
})