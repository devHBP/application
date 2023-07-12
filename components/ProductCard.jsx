import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React, { useState, useEffect} from 'react'
import { Button } from 'react-native-paper'
import { updateCart, addToCart, decrementOrRemoveFromCart } from '../reducers/cartSlice';
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import {Toast} from 'react-native-toast-message/lib/src/Toast';

//call API
import { checkStock } from '../CallApi/api.js';



import Icon from 'react-native-vector-icons/MaterialIcons';


const ProductCard = ({libelle, id, image, prix, qty, stock  }) => {

  // Déclaration de l'état du stock
  const [currentStock, setCurrentStock] = useState(stock);

  // Effet de bord pour mettre à jour le stock
  useEffect(() => {
    const fetchStock = async () => {
      const stock = await checkStock(id);
      setCurrentStock(stock[0].quantite);
    };

    fetchStock();
  }, [id]);



    const dispatch = useDispatch()
    const cart = useSelector((state) => state.cart.cart);
    const product = cart.find((item) => item.productId === id);
    //console.log('currentStock', currentStock)

    const baseUrl = 'http://127.0.0.1:8080';

    // //verification des stocks - global
    // const checkStock = async () => {
    //   try {
    //     const stockResponse = await axios.get(`http://localhost:8080/getStockByProduct/${id}`);
    //     const stockByProduct = stockResponse.data;
    //     //console.log('stock', stockByProduct)
    //     return stockByProduct; 
    //   } catch (error) {
    //     console.error("Une erreur s'est produite lors de la récupération du stock :", error);
    //   }
    // }
        
    // incrementhandler function
const incrementhandler = async () => {
  if (currentStock === 0){
    return Toast.show({
      type: 'error',
      text1: `Victime de son succès`,
      text2: 'Plus de stock disponible' 
    });
  }
  try {
    const stockAvailable = await checkStock(id);
    //console.log('stockAvailable', stockAvailable);
    //console.log(stockAvailable[0].quantite)
    
    // Get the product from the cart
    const productInCart = cart.find((item) => item.productId === id);

    // Calculate the remaining stock after accounting for the items in the cart
  const remainingStock = stockAvailable[0].quantite - (productInCart ? productInCart.qty : 0);


    if (stockAvailable.length > 0 && remainingStock > 0) {
      // The stock is sufficient, add the product to the cart
      dispatch(addToCart({ productId: id, libelle, image, prix_unitaire: prix, qty: 1 }));
      //console.log('Le stock est suffisant pour ajouter la quantité spécifiée.');
    } else {
      // The stock is insufficient
      //console.log(`Le stock est insuffisant pour ajouter la quantité spécifiée.,Quantités max: ${stockAvailable[0].quantite}`);
      return Toast.show({
        type: 'error',
        text1: `Victime de son succès`,
        text2: `Quantité maximale: ${stockAvailable[0].quantite}` 
      });
    }
  } catch (error) {
    console.error("Une erreur s'est produite lors de l'incrémentation du stock :", error);
  }
};

   
    const decrementhandler = () => {

        dispatch(decrementOrRemoveFromCart({ productId: id, qty: 1 }));
      };



    
  return (
    
    <View style={style.card_container}>
         <View style={style.image_container}>
         
          <Image 
              // source={image.uri}
              source={{ uri: `${baseUrl}/${image}` }}
              style={{
                      width: "100%",
                      height: 135,
                      resizeMode: "cover",
                      borderTopLeftRadius:10,
                      borderTopRightRadius:10,
                      }}
              
          />
          {currentStock === 0 && (
            <View style={style.overlay} />
            )}
   
          
          
    
        </View>

            <View style={{
                width: "100%",
                height:80,
                }}>
            
                <View
                    style={{
                    flexDirection: "column",
                    justifyContent: "center",
                    width: "100%",
                    height:100,
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
                        textAlign:'center',
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
        width:"100%", 
        //justifyContent:'center', 
        //alignItems:'center', 
        height:220,
        backgroundColor:'white', 
        marginVertical: 10, 
        marginHorizontal:5,
        borderRadius:10
        },
        image_container: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          width:"100%"
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
          overlay: {
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: 'gray',
            opacity: 0.5,
            borderRadius:5
          },
})

export default ProductCard