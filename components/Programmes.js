import React,{useEffect, useState} from 'react';
import { View, StyleSheet,Text, Dimensions, StatusBar,TouchableOpacity, ImageBackground, Image, ActivityIndicator } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import {Header, Icon, SearchBar} from 'react-native-elements'
import Timeline from 'react-native-timeline-flatlist'
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import axios from 'axios'

const initialLayout = { width: Dimensions.get('window').width };

export default function Programmes({navigation}) {
  const [index, setIndex] = useState(0);
  const [activeSections, setActiveSections] = useState([])
  const [programmeLundi, setProgrammeLundi] = useState([])
  const [programmeMardi, setProgrammeMardi] = useState([])
  const [programmeMercredi, setProgrammeMercredi] = useState([])
  const [programmeJeudi, setProgrammeJeudi] = useState([])
  const [programmeVendredi, setProgrammeVendredi] = useState([])
  const [programmeSamedi, setProgrammeSamedi] = useState([])
  const [programmeDimanche, setProgrammeDimanche] = useState([])
  const [loading, setLoading] = useState(true)
  const [loading2, setLoading2] = useState(true)
  const [loading3, setLoading3] = useState(true)
  const [loading4, setLoading4] = useState(true)
  const [loading5, setLoading5] = useState(true)
  const [loading6, setLoading6] = useState(true)
  const [loading7, setLoading7] = useState(true)
  
  let [fontsLoaded] = useFonts({
    'GothamBold': require('../assets/fonts/GothamBold.ttf'),
    'GothamLight': require('../assets/fonts/GothamLight.ttf'),
    'GothamBlack': require('../assets/fonts/GothamBlack.otf'),
  });
  
  const [routes] = useState([
    { key: 'first', title: 'Lundi' },
    { key: 'second', title: 'Mardi' },
    { key: 'third', title: 'Mercredi' },
    { key: 'fourth', title: 'Jeudi'},
    { key: 'fifth', title: 'Vendredi'},
    { key: 'sixth', title: 'Samedi'},
    { key: 'seven', title: 'Dimanche'}
  ]);
  
  const getProgrammeLundi = async() => {
      let res = await axios.get("https://www.icore.network/client/getProgrammeByDay?day=Lundi");
      setProgrammeLundi(res.data.result)
      setLoading(false)
  }
  const getProgrammeMardi = async() => {
      let res = await axios.get("https://www.icore.network/client/getProgrammeByDay?day=Mardi");
      setProgrammeMardi(res.data.result)
      setLoading2(false)
  }
  const getProgrammeMercredi = async() => {
      let res = await axios.get("https://www.icore.network/client/getProgrammeByDay?day=Mercredi");
      setProgrammeMercredi(res.data.result)
      setLoading3(false)
  }
  const getProgrammeJeudi = async() => {
      let res = await axios.get("https://www.icore.network/client/getProgrammeByDay?day=Jeudi");
      setProgrammeJeudi(res.data.result)
      setLoading4(false)
  }
  const getProgrammeVendredi = async() => {
      let res = await axios.get("https://www.icore.network/client/getProgrammeByDay?day=Vendredi");
      setProgrammeVendredi(res.data.result)
      setLoading5(false)
  }
  const getProgrammeSamedi = async() => {
      let res = await axios.get("https://www.icore.network/client/getProgrammeByDay?day=Samedi");
      setProgrammeSamedi(res.data.result)
      setLoading6(false)
  }
  const getProgrammeDimanche = async() => {
      let res = await axios.get("https://www.icore.network/client/getProgrammeByDay?day=Dimanche");
      setProgrammeDimanche(res.data.result)
      setLoading7(false)
  }

  useEffect(()=>{
    getProgrammeLundi()
    getProgrammeMardi()
    getProgrammeMercredi()
    getProgrammeJeudi()
    getProgrammeVendredi()
    getProgrammeSamedi()
    getProgrammeDimanche()
  },[])
  
  const FirstRoute = () => (
    <ImageBackground style={styles.scene} source={require('../assets/background.jpeg')} imageStyle={{resizeMode: 'cover'}}>
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
          <>
            <Timeline
              data={programmeLundi}
              innerCircle={'dot'}
              lineColor='#573178'
              circleColor='#E0801E'
              style={{margin:5}}
              renderDetail = {
                function render(rowData, sectionID, rowID){
                  let title = <Text style={{fontFamily:"GothamBold", fontSize:20, marginBottom:5}}>{rowData.title}</Text>
                  var desc = null
                  if(rowData.description && rowData.imageUrl)
                    desc = (
                      <View style={{marginRight:"4%"}}>   
                        <View style={{flex: 1, justifyContent: "center",height:170,marginBottom:10,borderRadius:25,
        overflow:"hidden", borderWidth:2.5, borderColor:"#573178"}}>
                          <Image source={{uri:rowData.imageUrl}} style={{height:170, borderRadius:25}} />
                        </View>
                        <Text style={{fontWeight:"bold", textAlign:"justify"}}>{rowData.description}</Text>
                      </View>
                    )
                  return (
                    <View style={{flex:1}}>
                      {title}
                      {desc}
                    </View>
                  )
                }
              }
        />
          </>
        )}
        
    </ImageBackground>
  );

  const SecondRoute = () => (
    <ImageBackground style={styles.scene} source={require('../assets/background.jpeg')} imageStyle={{resizeMode: 'cover'}}>
        {loading2 ? (
        <View style={{flex:1, justifyContent: 'center', alignItems: 'center', }}>
          <ActivityIndicator
            //visibility of Overlay Loading Spinner
            visible={loading2}
            color="#573178"
            size="large"
          />
        </View>
        ) : (
          <>
            <Timeline
          data={programmeMardi}
          innerCircle={'dot'}
          lineColor='#573178'
              circleColor='#E0801E'
          style={{margin:5}}
          renderDetail = {
            function render(rowData, sectionID, rowID){
              let title = <Text style={{fontFamily:"GothamBold", fontSize:20, marginBottom:5}}>{rowData.title}</Text>
              var desc = null
              if(rowData.description && rowData.imageUrl)
                desc = (
                  <View style={{marginRight:"4%"}}>   
                        <View style={{flex: 1, justifyContent: "center",height:170,marginBottom:10,borderRadius:25,
        overflow:"hidden", borderWidth:2.5, borderColor:"#573178"}}>
                          <Image source={{uri:rowData.imageUrl}} style={{height:170, borderRadius:25}} />
                        </View>
                        <Text style={{fontWeight:"bold", textAlign:"justify"}}>{rowData.description}</Text>
                      </View>
                )
              return (
                <View style={{flex:1}}>
                  {title}
                  {desc}
                </View>
              )
            }
          }
        />
          </>
        )}
    </ImageBackground>
  );

  const ThirdRoute = () => (
    <ImageBackground style={styles.scene} source={require('../assets/background.jpeg')} imageStyle={{resizeMode: 'cover'}}>
        {loading3 ? (
        <View style={{flex:1, justifyContent: 'center', alignItems: 'center', }}>
          <ActivityIndicator
            //visibility of Overlay Loading Spinner
            visible={loading3}
            color="#573178"
            size="large"
          />
        </View>
        ) : (
          <>
            <Timeline
              data={programmeMercredi}
              innerCircle={'dot'}
              lineColor='#573178'
              circleColor='#E0801E'
              style={{margin:5}}
              renderDetail = {
                function render(rowData, sectionID, rowID){
                  let title = <Text style={{fontFamily:"GothamBold", fontSize:20, marginBottom:5}}>{rowData.title}</Text>
                  var desc = null
                  if(rowData.description && rowData.imageUrl)
                    desc = (
                      <View style={{marginRight:"4%"}}>   
                        <View style={{flex: 1, justifyContent: "center",height:170,marginBottom:10,borderRadius:25,
        overflow:"hidden", borderWidth:2.5, borderColor:"#573178"}}>
                          <Image source={{uri:rowData.imageUrl}} style={{height:170, borderRadius:25}} />
                        </View>
                        <Text style={{fontWeight:"bold", textAlign:"justify"}}>{rowData.description}</Text>
                      </View>
                    )
                  return (
                    <View style={{flex:1}}>
                      {title}
                      {desc}
                    </View>
                  )
                }
              }
            />
          </>
        )}
    </ImageBackground>
  );

  const FourthRoute = () => (
    <ImageBackground style={styles.scene} source={require('../assets/background.jpeg')} imageStyle={{resizeMode: 'cover'}}>
        {loading4 ? (
        <View style={{flex:1, justifyContent: 'center', alignItems: 'center', }}>
          <ActivityIndicator
            //visibility of Overlay Loading Spinner
            visible={loading4}
            color="#573178"
            size="large"
          />
        </View>
        ) : (
          <>
           <Timeline
             data={programmeJeudi}
             lineColor='#573178'
              circleColor='#E0801E'
             innerCircle={'dot'}
             style={{margin:5}}
             renderDetail = {
               function render(rowData, sectionID, rowID){
                 let title = <Text style={{fontFamily:"GothamBold", fontSize:20, marginBottom:5}}>{rowData.title}</Text>
                 var desc = null
                 if(rowData.description && rowData.imageUrl)
                   desc = (
                    <View style={{marginRight:"4%"}}>   
                    <View style={{flex: 1, justifyContent: "center",height:170,marginBottom:10,borderRadius:25,
    overflow:"hidden", borderWidth:2.5, borderColor:"#573178"}}>
                      <Image source={{uri:rowData.imageUrl}} style={{height:170, borderRadius:25}} />
                    </View>
                    <Text style={{fontWeight:"bold", textAlign:"justify"}}>{rowData.description}</Text>
                  </View>
                   )
                 return (
                   <View style={{flex:1}}>
                     {title}
                     {desc}
                   </View>
                 )
               }
             }
           />
          </>
        )}
    </ImageBackground>
  );

  const FifthRoute = () => (
    <ImageBackground style={styles.scene} source={require('../assets/background.jpeg')} imageStyle={{resizeMode: 'cover'}}>
        {loading5 ? (
        <View style={{flex:1, justifyContent: 'center', alignItems: 'center', }}>
          <ActivityIndicator
            //visibility of Overlay Loading Spinner
            visible={loading5}
            color="#573178"
            size="large"
          />
        </View>
        ) : (
          <>
            <Timeline
              data={programmeVendredi}
              lineColor='#573178'
              circleColor='#E0801E'
              innerCircle={'dot'}
              style={{margin:5}}
              renderDetail = {
                function render(rowData, sectionID, rowID){
                  let title = <Text style={{fontFamily:"GothamBold", fontSize:20, marginBottom:5}}>{rowData.title}</Text>
                  var desc = null
                  if(rowData.description && rowData.imageUrl)
                    desc = (
                      <View style={{marginRight:"4%"}}>   
                        <View style={{flex: 1, justifyContent: "center",height:170,marginBottom:10,borderRadius:25,
        overflow:"hidden", borderWidth:2.5, borderColor:"#573178"}}>
                          <Image source={{uri:rowData.imageUrl}} style={{height:170, borderRadius:25}} />
                        </View>
                        <Text style={{fontWeight:"bold", textAlign:"justify"}}>{rowData.description}</Text>
                      </View>
                    )
                  return (
                    <View style={{flex:1}}>
                      {title}
                      {desc}
                    </View>
                  )
                }
              }
            />
          </>
        )}
    </ImageBackground>
  );

  const SixthRoute = () => (
    <ImageBackground style={styles.scene} source={require('../assets/background.jpeg')} imageStyle={{resizeMode: 'cover'}}>
        {loading6 ? (
        <View style={{flex:1, justifyContent: 'center', alignItems: 'center', }}>
          <ActivityIndicator
            //visibility of Overlay Loading Spinner
            visible={loading6}
            color="#573178"
            size="large"
          />
        </View>
        ) : (
          <>
            <Timeline
              data={programmeSamedi}
              lineColor='#573178'
              circleColor='#E0801E'
              innerCircle={'dot'}
              style={{margin:5}}
              renderDetail = {
                function render(rowData, sectionID, rowID){
                  let title = <Text style={{fontFamily:"GothamBold", fontSize:20, marginBottom:5}}>{rowData.title}</Text>
                  var desc = null
                  if(rowData.description && rowData.imageUrl)
                    desc = (
                      <View style={{marginRight:"4%"}}>   
                        <View style={{flex: 1, justifyContent: "center",height:170,marginBottom:10,borderRadius:25,
        overflow:"hidden", borderWidth:2.5, borderColor:"#573178"}}>
                          <Image source={{uri:rowData.imageUrl}} style={{height:170, borderRadius:25}} />
                        </View>
                        <Text style={{fontWeight:"bold", textAlign:"justify"}}>{rowData.description}</Text>
                      </View>
                    )
                  return (
                    <View style={{flex:1}}>
                      {title}
                      {desc}
                    </View>
                  )
                }
              }
            />
          </>
        )}
    </ImageBackground>
  );

  const SevenRoute = () => (
    <ImageBackground style={styles.scene} source={require('../assets/background.jpeg')} imageStyle={{resizeMode: 'cover'}}>
        {loading7 ? (
        <View style={{flex:1, justifyContent: 'center', alignItems: 'center', }}>
          <ActivityIndicator
            //visibility of Overlay Loading Spinner
            visible={loading7}
            color="#573178"
            size="large"
          />
        </View>
        ) : (
          <>
            <Timeline
              data={programmeDimanche}
              lineColor='#573178'
              circleColor='#E0801E'
              innerCircle={'dot'}
              style={{margin:5}}
              renderDetail = {
                function render(rowData, sectionID, rowID){
                  let title = <Text style={{fontFamily:"GothamBold", fontSize:20, marginBottom:5}}>{rowData.title}</Text>
                  var desc = null
                  if(rowData.description && rowData.imageUrl)
                    desc = (
                      <View style={{marginRight:"4%"}}>   
                        <View style={{flex: 1, justifyContent: "center",height:170,marginBottom:10,borderRadius:25,
        overflow:"hidden", borderWidth:2.5, borderColor:"#573178"}}>
                          <Image source={{uri:rowData.imageUrl}} style={{height:170, borderRadius:25}} />
                        </View>
                        <Text style={{fontWeight:"bold", textAlign:"justify"}}>{rowData.description}</Text>
                      </View>
                    )
                  return (
                    <View style={{flex:1}}>
                      {title}
                      {desc}
                    </View>
                  )
                }
              }
            />
          </>
        )}
    </ImageBackground>
  );

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: ThirdRoute,
    fourth: FourthRoute,
    fifth: FifthRoute,
    sixth: SixthRoute,
    seven: SevenRoute,
  });

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      scrollEnabled
      indicatorStyle={styles.indicator}
      style={styles.tabbar}
      tabStyle={styles.tab}
      labelStyle={styles.label}
    />
  )
  
  return (
    <View style={{flex:1, backgroundColor:"#fff"}}>
      <Header
        
        centerComponent={
          <Text style={styles.titleAppBar}>Programmes</Text>
        }
        containerStyle={{
          backgroundColor:"#fff",
          marginBottom:"9%"
        }}
      />
      <TabView
        lazy
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={renderTabBar}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  titleAppBar:{
    color:"#573178",
    fontSize:22,
    fontWeight:"bold",
    position:"absolute",
    top:"15%"
  },
  tabbar: {
    backgroundColor: '#573178',
  },
  tab: {
    width: 120,
  },
  label: {
    fontWeight: '400',
  },
  indicator: {
    backgroundColor: '#E0801E',
  },
});
