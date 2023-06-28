import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React, { useState} from 'react'
import { Button } from 'react-native-paper'
import { updateCart } from '../reducers/cartSlice';
import { useSelector, useDispatch } from 'react-redux'


import Icon from 'react-native-vector-icons/MaterialIcons';


const ProductCard = ({libelle, id, image, prix, qty, stock  }) => {

  //console.log('prix product card', prix)
  //console.log('stock', stock)

    const dispatch = useDispatch()
    const cart = useSelector((state) => state.cart.cart);
    //console.log('cart', cart)
    const product = cart.find((item) => item.productId === id);
    //console.log('product', product)


    const baseUrl = 'http://127.0.0.1:8080';

    // const incrementhandler = () => {
    //     dispatch(addToCart({ id, libelle, image, prix, qty: qty + 1 }));
    //   };


    const incrementhandler = () => {
        const updatedCart = [...cart];
        const existingProductIndex = updatedCart.findIndex((item) => item.productId === id);
    
        if (existingProductIndex !== -1) {
          updatedCart[existingProductIndex].qty += 1;
        } else {
          updatedCart.push({ productId:id, libelle, image, prix_unitaire:prix, qty: 1 });
        }
    
        dispatch(updateCart(updatedCart));
      };
   
    const decrementhandler = () => {
        const updatedCart = [...cart];
        const existingProductIndex = updatedCart.findIndex((item) => item.productId === id);
    
        if (existingProductIndex !== -1) {
          if (updatedCart[existingProductIndex].qty > 1) {
            updatedCart[existingProductIndex].qty -= 1;
          } else {
            updatedCart.splice(existingProductIndex, 1);
          }
        }
        dispatch(updateCart(updatedCart));
      };
    
  return (
    <View style={style.card_container}>
        
        <Image 
            // source={image.uri}
            source={{ uri: `${baseUrl}/${image}` }}
            style={{
                    width: 160,
                    height: 135,
                    resizeMode: "cover",
                    borderTopLeftRadius:10,
                    borderTopRightRadius:10,
                    }}
        />

            <View style={{
                width: "100%",
                height:90,
                }}>
            
                <View
                    style={{
                    flexDirection: "column",
                    justifyContent: "center",
                    width: "100%",
                    height:70,
                    backgroundColor:'white',
                    gap: 5,
                    }}
                >
                    <Text
                        numberOfLines={1}
                        style={{
                        fontSize: 16,
                        fontWeight: "300",
                        width: "100%",
                        textAlign:'center'
                        }}
                    >
                        {libelle}
                    </Text>
                    <Text
                            numberOfLines={1}
                            style={{
                            fontSize: 16,
                            fontWeight: "300",
                            width: "100%",
                            textAlign:'center'
                            }}
                        >
                            {prix}€
                      </Text>
                      {/* <Text>
                        {
                          stock===0 ?  'stock indispo':'stock ok'             
                        }
                      </Text> */}
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
        
    </View>
  )
}
const style = StyleSheet.create({
    
    card_container:{
        flexDirection:'column', 
        width:"46%", 
        justifyContent:'center', 
        alignItems:'center', 
        height:220, 
        gap: 10, 
        backgroundColor:'white', 
        padding:20, 
        marginVertical: 10, 
        marginHorizontal:5,
        borderRadius:10
        },
        qtyText: {
            backgroundColor: 'white',
            height: 25,
            width: 25,
            textAlign: "center",
            borderWidth: 1,
            borderRadius: 5,
            borderColor: 'black',
            fontSize:18
          },
          qtyContainer: {
            flexDirection:'row',
            alignItems: "center",
            width: "80%",
            justifyContent: "space-between",
            alignSelf: "center",
          },
})

export default ProductCard