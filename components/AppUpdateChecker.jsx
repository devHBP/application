import {View, Text, Button, Linking, Platform, StyleSheet, Pressable} from 'react-native';
import React from 'react';
import {APPSTORE_URL, PLAYSTORE_URL} from '@env';
import {colors, fonts} from '../styles/styles';

const AppUpdateChecker = () => {
  //verif version app store
  const appStoreUrl = Platform.select({
    ios: APPSTORE_URL,
    android: PLAYSTORE_URL,
  });

  const openLink = url => {
    if (Platform.OS === 'android') {
      Linking.openURL(url)
        .then(supported => {
          if (!supported) {
            console.log("Can't handle URL: " + url);
          } else {
            return Linking.openURL(url);
          }
        })
        .catch(err => console.error('An error occurred', err));
    } else if (Platform.OS === 'ios') {
      console.log('url', url);
      Linking.canOpenURL(url)
        .then(supported => {
          if (!supported) {
            console.log("Can't handle URL: " + url);
          } else {
            return Linking.openURL(url);
          }
        })
        .catch(err => console.error('An error occurred', err));
    }
  };

  return (
    <View style={style.container}>
      <Text style={style.updateText}>Une nouvelle version  de l'application Click and Collect est disponible.</Text>
      <Pressable style={style.btnUpdate} onPress={() => openLink(appStoreUrl)}>
        <Text style={style.textButton}>Mettre à jour</Text>
      </Pressable>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.color1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnUpdate: {
    backgroundColor: colors.color2,
    marginTop: 40,
    paddingHorizontal:40,
    paddingVertical:20,
    borderRadius:10
  },
  updateText:{
    color: colors.color4,
    fontFamily:fonts.font2,
    fontSize:22,
    textAlign:'center',
    marginHorizontal:20
  },
  textButton: {
    color: colors.color4,
    fontSize:18,
    fontWeight:'bold'
  }
});

export default AppUpdateChecker;
