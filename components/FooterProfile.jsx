import { View, StyleSheet } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useNavigation } from '@react-navigation/native'

const FooterProfile = () => {
  //on utilise ici useNavigation et non pas navigation car le footer n'est pas dans la pile de screens
  const navigation = useNavigation()

 
  const openOrders = () => {
    navigation.navigate('orders')
  }
  const openCart = () => {
    navigation.navigate('panier')
  }
  const openProfile = () => {
    navigation.navigate('profile')
  }

  return (
    <View style={style.profile}>
      {/* <Icon name="home" size={30} color="#000" style={style.icon} onPress={openHome}/> */}
      <Icon name="list" size={30} color="#000" style={style.icon} onPress={openOrders} />
      <Icon name="shopping-cart" size={30} color="#000" style={style.icon} onPress={openCart}/>
      <Icon name="person" size={30} color="#000" style={style.icon} onPress={openProfile}/>
    </View>
  )
}

const style = StyleSheet.create({
    profile: {
        height:'10%',
        width:'100%', 
        position:'absolute', 
        bottom:0, 
        backgroundColor:'gray',
        flex:1,
        flexDirection: 'row',
        justifyContent:'space-around',
        alignItems:'center',
    },
    // icon:{
    //     borderWidth: 1,
    //     borderStyle:'solid',
    //     borderColor:'white',
    //     padding:10, 
    //     borderRadius:25,
    //     // backgroundColor:'white'
    // }
  });

export default FooterProfile