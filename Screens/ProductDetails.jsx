import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native'
import React, { useEffect} from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { defaultStyle} from '../styles/styles'
import { Button, Badge } from 'react-native-paper'
import { useSelector, useDispatch } from 'react-redux'
import {  addToCart, decrementOrRemoveFromCart } from '../reducers/cartSlice';

const ProductDetails = ({navigation, route}) => {

   
    const { product } = route.params;
    //console.log('product', product)

    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart.cart);
    console.log('cart', cart)
    const totalQuantity = cart.reduce((total, item) => total + item.qty, 0);
    console.log('qty', totalQuantity)

    const baseUrl = 'http://127.0.0.1:8080';

    const handleBack = () => {
        navigation.navigate('home');
      };
      const handleNavigateToCart =  () => {
        navigation.navigate('panier')
    };

    const handleAddtoCart = () => {
        const productWithQty = {...product, qty: 1};
        dispatch(addToCart(productWithQty));
        console.log(product.productId);
    }

    const incrementhandler = () => {
        console.log('plus')
    }

    const decrementhandler = () => {
        console.log('moins')
    }
    
     
  return (
    <View style={{...defaultStyle, padding:35}}>
        <View style={style.icons}>
       
        <Icon name="arrow-back" size={30} color="#900" onPress={handleBack}/>
        <Icon name="shopping-cart" size={30} color="#000" onPress={handleNavigateToCart} style={style.badge_container}/>
         <Badge visible={cart.length > 0} size={18} style={style.badge}>
          {totalQuantity}
        </Badge>
        
      </View>
     


         <View style={style.container}>

            <View style={style.image_container}>
                <Image source={{ uri: `${baseUrl}/${product.image}` }} style={{width: "100%", height:"100%", objectFit:'cover'}} />
            </View>
            
            <View style={style.details}>
                <Text>{product.libelle}</Text>
                <Text>{product.prix_unitaire} euros</Text>
                <Text style={{textAlign:'justify'}}>{product.description}</Text>
                {/* Render other product details */}
            </View>

            <View>
                <Button 
                buttonColor='lightgray' 
                onPress={handleAddtoCart}
            >Ajouter au panier</Button>
            </View>

            <View style={style.qtyContainer}>
                             <TouchableOpacity
                                onPress={decrementhandler}
                            >
                                <Icon name="remove" size={30} color="#000" />
                            </TouchableOpacity>
                            {/* <Text style={style.qtyText}>{cart[index].qty}</Text> */}
                            <Text style={style.qtyText}>{product ? product.qty : 0}</Text>
                            <TouchableOpacity
                                onPress={incrementhandler}
                            >
                                <Icon name="add" size={30} color="#000" />
                            </TouchableOpacity>

                        </View>
            
        </View>

    </View>
  )
}

const style = StyleSheet.create({
    container:{
        marginVertical:20
    },
    icons:{
        flexDirection:'row',
        justifyContent:'space-between',
        marginVertical:10
    },
    badge_container:{
        position: 'relative',
        marginRight: 10,
    },
    badge: {
        position: 'absolute',
        top: -8,
        right: 0,
    },
    image_container:{
        width:'100%',
        height:'50%'
    },
    details:{
        marginVertical:10,
        flexDirection:'column',
        gap:10,
        alignItems:'center'
    },
    qtyContainer:{
        flexDirection:'row',
        alignItems: "center",
        width: "40%",
        justifyContent: "space-between",
        alignSelf: "center",
        marginVertical:10,
    },
    qtyText:{
        backgroundColor: 'white',
        height: 25,
        width: 25,
        textAlign: "center",
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'black',
        fontSize:18   
    },
})


export default ProductDetails