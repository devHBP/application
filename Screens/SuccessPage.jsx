import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { defaultStyle} from '../styles/styles'
import { Button } from 'react-native-paper'
import { useSelector, useDispatch } from 'react-redux';
import { clearCart} from '../reducers/cartSlice';

const SuccessPage = ({navigation}) => {

    const dispatch = useDispatch();

    const cart = useSelector(state => state.cart.cart); 
    console.log('panier', cart)
    if (cart.length > 0){
      dispatch(clearCart())
      console.log('panier', cart)
    }
    

    const submitHandler = () => {
        navigation.navigate('home')
    }

  return (
    <View style={{...defaultStyle,flex:1,}}>
        <View style={style.container}>
        <Text style={{textAlign:'center'}}>Success !!! </Text>
      <Button
                style={style.btn} 
                textColor={'white'} 
                onPress={submitHandler}
                >
                Page d'Accueil
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
        // marginBottom:70,
        backgroundColor:'white', 
        borderRadius:10,
    },
    btn: {
        backgroundColor: 'red',
        margin: 20,
        padding: 6,
      }
})

export default SuccessPage