import React, { useEffect } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons';

const AudioListItem = ({id, index, title, image, player, category, playbackInstanceRef}) => {
    const ref = `${category}_${id}`
    return (
        <TouchableOpacity onPress={() => player.onPlayOrPause(index, ref)}>
            <View style={styles.item}>
                <View
                    style={{
                        width: 60,
                        height: 60,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 6 },
                        shadowOpacity: 0.39,
                        shadowRadius: 8.3,
                        elevation: 13,
                        borderRadius: 5,
                        borderWidth: 1,
                        overflow: 'hidden',
                        marginRight: 10
                    }}>
                    <Image
                        source={{ uri: image }}
                        style={{ width: 60, height: 60, resizeMode: 'cover' }}
                    />
                </View>
                <View style={{ justifyContent: 'center', flex: 1 }}>
                    <Text numberOfLines={2} style={{ fontFamily: 'GothamBlack' }}>{title}</Text>
                </View>
                {
                    (ref == player.playbackInstanceRef) ? (
                        <>
                        {
                            player.isLoading? (
                                <ActivityIndicator size={24} color='#E0801E' />
                            )
                            : <MaterialCommunityIcons size={24} name='equalizer' color={player.isPlaying? '#E0801E' : 'gray'}/>
                        }
                        </>
                    ) : null
                }
            </View>
        </TouchableOpacity>
    )
}

export default AudioListItem

const styles = StyleSheet.create({
    item: {
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 10,
        marginVertical: 10,
        alignItems: 'center',
      },
})