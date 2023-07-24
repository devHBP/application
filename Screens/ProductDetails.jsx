import { View, TouchableOpacity, Image, Text, StyleSheet} from 'react-native'
import React, { useEffect, useState} from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { defaultStyle} from '../styles/styles'
import { useSelector, useDispatch } from 'react-redux'
import {  addToCart, addFreeProductToCart} from '../reducers/cartSlice';
import { checkStockForSingleProduct } from '../CallApi/api.js';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import FooterProfile from '../components/FooterProfile';
import ModaleOffre31 from '../components/ModaleOffre31';


//fonctions
import { decrementhandler } from '../Fonctions/fonctions'

const ProductDetails = ({navigation, route}) => {

   
    const { product } = route.params;
    const [currentStock, setCurrentStock] = useState(product.stock);
    const [modalVisible, setModalVisible] = useState(false);

    // Effet de bord pour mettre à jour le stock
    useEffect(() => {
    const fetchStock = async () => {
      const stock = await checkStockForSingleProduct(product.productId);
      console.log('stock details', stock)
      setCurrentStock(stock[0].quantite);
    };

    fetchStock();
  }, [product.productId]);

    const dispatch = useDispatch();


    const cart = useSelector((state) => state.cart.cart);

    const productQuantity = cart.reduce((total, item) => {
      if (item.productId === product.productId) {
        return total + item.qty;
      }
      return total;
    }, 0);
    console.log('prodQty', productQuantity)

    const baseUrl = 'http://127.0.0.1:8080';

    const handleBack = () => {
        navigation.navigate('home');
      };
     
    const handleAcceptOffer = () => {
     
      dispatch(addFreeProductToCart(product));
      console.log('cart', cart)

    }; 
    
    const incrementhandler = async () => {
      if (currentStock === 0){
        return Toast.show({
          type: 'error',
          text1: `Victime de son succès`,
          text2: 'Plus de stock disponible' 
        });
      }
      try {
        const stockAvailable = await checkStockForSingleProduct(product.productId);
  
        const remainingStock = stockAvailable[0].quantite - productQuantity;
  
        if (stockAvailable.length > 0 && remainingStock > 0) {
          console.log(`Ajout au panier: ${product.libelle}, prix: ${product.prix_unitaire}, quantité: 1`);
          dispatch(addToCart({ productId: product.productId, libelle: product.libelle, image: product.image, prix_unitaire: product.prix_unitaire, qty: 1 , offre: product.offre}));
  
          if (product.offre && product.offre.startsWith('offre31')) {
            const updatedCart = [...cart, { productId: product.productId, libelle: product.libelle, image: product.image, prix_unitaire: product.prix, qty: 1 , offre: product.offre}];
            const sameOfferProducts = updatedCart.filter((item) => item.offre === product.offre);
            const totalQuantity = sameOfferProducts.reduce((total, product) => total + product.qty, 0);
            
            if (totalQuantity === 3 || (totalQuantity - 3) % 4 === 0) {
              setModalVisible(true);

            }
          }
        } else {
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
  
     
  return (
    <>
    <View style={{...defaultStyle, padding:35}}>
        <View style={style.icons}>
       
        <Icon name="arrow-back" size={30} color="#900" onPress={handleBack}/>
        {/* <Icon name="shopping-cart" size={30} color="#000" onPress={handleNavigateToCart} style={style.badge_container}/>
         <Badge visible={cart.length > 0} size={18} style={style.badge}>
          {totalQuantity}
        </Badge> */}
        
      </View>
     


         <View style={style.container}>

            <View style={style.image_container}>
                <Image source={{ uri: `${baseUrl}/${product.image}` }} style={{width: "100%", height:"100%", objectFit:'cover'}} />
            </View>
            
            <View style={style.details}>
                <Text>{product.libelle}</Text>
                <Text>{product.prix_unitaire} euros</Text>
                <Text style={{textAlign:'justify'}}>{product.description}</Text>
            </View>

            <View>
                {/* <Button 
                buttonColor='lightgray' 
                onPress={handleAddtoCart}
            >Ajouter au panier</Button> */}
            </View>

            <View style={style.qtyContainer}>
                             <TouchableOpacity
                              onPress={() => decrementhandler(product.productId, dispatch)}
                                // onPress={decrementhandler}
                            >
                                <Icon name="remove" size={30} color="#000" />
                            </TouchableOpacity>
                            <Text style={style.qtyText}>{productQuantity}</Text>
                            <TouchableOpacity
                                // onPress={incrementhandler}
                                 onPress={() => incrementhandler(product.productId, product.offre)}
                            >
                                <Icon name="add" size={30} color="#000" />
                            </TouchableOpacity>

                        </View>
            
        </View>

        <ModaleOffre31 modalVisible={modalVisible} setModalVisible={setModalVisible} handleAcceptOffer={handleAcceptOffer} />

    </View>
    <FooterProfile/>
    </>
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