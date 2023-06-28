import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Button} from 'react-native-paper'
import { defaultStyle, colors, fonts } from '../styles/styles'
// import Icon from 'react-native-vector-icons/MaterialIcons'

const App = ({navigation}) => {
    const navigationToSignUp = () => {
        navigation.navigate('signup')
    }
    const navigationToLogin = () => {
        navigation.navigate('login')
    }
  return (
    <View style={{...defaultStyle, backgroundColor:colors.color1}}>
        {/* <Icon name="add" size={30} color="#fff" /> */}
    
      <View style={style.container}>
     
        <Text style={style.title}>Le pain du jour</Text>
        <Text style={style.title2}>Click'n'Collect</Text>
       

        <View style={style.container_slogan}>
            <Text style={style.slogan}>Cliquez</Text>
            <Text style={style.slogan}>Conduisez</Text>
            <Text style={style.slogan}>Savourez.</Text>
        </View>
       
     
            <Button
                style={style.btn} 
                textColor={'white'} 
                onPress={navigationToSignUp}
                >
            S'INSCRIRE
            </Button>
            <Button
                style={style.btn} 
                textColor={'white'} 
                
                onPress={navigationToLogin}
                >
            SE CONNECTER
            </Button>
        </View>
    </View>
  )
}
const style = StyleSheet.create({
    
    container:{
        flex:1,
        padding:20,
        justifyContent:'center',
        //reajustement margin pour laisser de la place au footer
        marginBottom:70
    },
    btn: {
        backgroundColor: colors.color2,
        margin: 5,
        padding: 6,
        borderRadius:6,
        marginHorizontal:40
      },
    title:{
        fontFamily: fonts.font1,
        textAlign:'center',
        fontSize:26,
        color: colors.color3
    },
    title2:{
        color: colors.color3,
        textAlign:'center',
        fontSize:24,
        // fontFamily: fonts.font3
    },
    container_slogan:{
        flexDirection:'column',
        alignItems:'center',
        marginVertical:20
    },
    slogan:{
        color: colors.color2,
        fontSize:25,
        // fontFamily: fonts.font2,
        fontWeight:400,
    }
})

export default App