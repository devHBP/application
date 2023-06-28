import { StyleSheet, Platform, StatusBar } from "react-native";

export const defaultStyle = StyleSheet.create({
    padding: 5,
    // paddingTop: Platform.OS === "ios" ? StatusBar.currentHeight : 0,
    //paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    flex: 1,
    
});

export const inputStyling = StyleSheet.create({
    height: 50,
    marginVertical: 5,
    marginHorizontal: 20,
    backgroundColor:'white',
    
  });

export const colors = {
    color1: "#273545", //fond pain du jour
    color2: "#E9521B", // orange
    color3: "#F5F5F5", //gris clair
};