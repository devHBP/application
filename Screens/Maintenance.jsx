import { View, Text, StyleSheet, Alert } from 'react-native'
import React from 'react'
import { colors, fonts } from '../styles/styles'


const Maintenance = () => {
  return (
    <View style={style.container}>
      <Text style={style.textMaintenance}>Maintenance</Text>
    </View>
  )
}
const style = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: colors.color1,
        justifyContent: 'center', 
        alignItems: 'center',
    },
    textMaintenance:{
        color:colors.color3
    }
});
export default Maintenance