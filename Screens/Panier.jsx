import { View, Text, TouchableOpacity,ScrollView, TextInput, Modal, StyleSheet } from 'react-native'
import React, { useState} from 'react'
import { defaultStyle} from '../styles/styles'
import { Button } from 'react-native-paper'
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios'
import { updateCart, addToCart, decrementOrRemoveFromCart, addFreeProductToCart } from '../reducers/cartSlice';
import { logoutUser} from '../reducers/authSlice';
import CartItem from '../components/CardItems';
import CardItemFormule from '../components/CardItemsFormule';
import AsyncStorage from '@react-native-async-storage/async-storage'
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import { checkStockFormule, checkStockForSingleProduct } from '../CallApi/api';
import FooterProfile from '../components/FooterProfile';
import ModaleOffre31 from '../components/ModaleOffre31';

//fonctions
import { decrementhandler } from '../Fonctions/fonctions'

const Panier = ({navigation}) => {

  let API_BASE_URL = 'http://127.0.0.1:8080';

  if (Platform.OS === 'android') {
    if (__DEV__) {
        API_BASE_URL = 'http://10.0.2.2:8080'; // Adresse pour l'émulateur Android en mode développement
    } 
}

  const dispatch = useDispatch()
  const [promoCode, setPromoCode] = useState('');
  //const [currentStock, setCurrentStock] = useState(product.stock);
  const [modalVisible, setModalVisible] = useState(false);


  const cart = useSelector((state) => state.cart.cart);
  const user = useSelector((state) => state.auth.user)
  const store = useSelector((state) => state.auth.selectedStore)
  
  const totalPrice = Number((cart.reduce((total, item) => {
    const prix = item.prix || item.prix_unitaire; // Utilisez la propriété "prix" si elle existe, sinon utilisez "prix_unitaire"
    return total + item.qty * prix;
  }, 0)).toFixed(2));
  

  const handleBack = () => {
    navigation.navigate('home');
  };


  const handleAcceptOffer = () => {
    const lastProductAdded = cart[cart.length - 1];
  const freeProduct = {
    ...lastProductAdded,
    qty: 1,
    prix_unitaire: 0
  };
    dispatch(addFreeProductToCart(freeProduct));
  };

const incrementhandler = async (id, offre) => {
  console.log({ id, dispatch, cart, offre });

  const productInCart = cart.find((item) => item.productId === id);


  try {
    if (productInCart.type === 'formule') {
      const stocks = await checkStockFormule(productInCart.productIds);

      for (let stock of stocks) {
        if (stock[0].quantite <= productInCart.qty) {
          return Toast.show({
            type: 'error',
            text1: `Victime de son succès`,
            text2: 'Plus de stock disponible',
          });
        }
      }

      productInCart.qty = 1;
      dispatch(addToCart(productInCart));
    } else {
      const stockAvailable = await checkStockForSingleProduct(id);

      // Calculate the remaining stock after accounting for the items in the cart
      const remainingStock = stockAvailable[0].quantite - (productInCart ? productInCart.qty : 0);

      if (stockAvailable.length > 0 && remainingStock > 0) {
        dispatch(
          addToCart({
            productId: id,
            libelle: productInCart.libelle,
            image: productInCart.image,
            prix_unitaire: productInCart.prix,
            qty: 1,
            offre: offre,
          })
        );

        if (offre && offre.startsWith('offre31')) {
          const updatedCart = [...cart, { productId: id, libelle: productInCart.libelle, image: productInCart.image, prix_unitaire: productInCart.prix, qty: 1, offre: offre }];
          const sameOfferProducts = updatedCart.filter((item) => item.offre === offre);
          const totalQuantity = sameOfferProducts.reduce((total, product) => total + product.qty, 0);

          if (totalQuantity === 3 || (totalQuantity - 3) % 4 === 0) {
            setModalVisible(true);
          }
        }
      } else {
        return Toast.show({
          type: 'error',
          text1: `Victime de son succès`,
          text2: `Quantité maximale: ${stockAvailable[0].quantite}`,
        });
      }
    }
  } catch (error) {
    console.error("Une erreur s'est produite lors de l'incrémentation du stock :", error);
  }
};

  const totalQuantity = cart.reduce((total, item) => total + item.qty, 0)

  const handleLogout = () => {
    dispatch(logoutUser()); 
    navigation.navigate('app')
  }

  const handleConfirm = async () => {
    console.log(cart)

    const token = await AsyncStorage.getItem('userToken');

    axios.get(`${API_BASE_URL}/verifyToken`, {
      headers: {
          'x-access-token': token
      }
    })
    .then(response => {
      if (response.data.auth) {
          navigation.navigate('choixpaiement');
      } else {
          // Token is not valid, show error...
          handleLogout()
      }
    })
    .catch(error => {
      handleLogout()
      return Toast.show({
        type: 'error',
        text1: 'Session expirée',
        text2: 'Veuillez vous reconnecter'
      });
      // console.log('token invalide catch')
        // console.error('Une erreur s\'est produite lors de la vérification du token :', error);
    });
  }

 //Promotion
  const handleApplyDiscount = async () => {

    axios.get(`${API_BASE_URL}/promocodes/${promoCode}`)
    .then(response => {
      const data = response.data;
      //console.log('data', data)
      if (data && data.active) {
        const percentage = data.percentage;

        // const updatedCart = cart.map(item => ({
        //   ...item,
        //   originalPrice: item.prix,
        //   prix: item.prix - (item.prix * percentage / 100)
        // }));
        const updatedCart = cart.map(item => ({
          ...item,
          originalPrice: item.prix_unitaire,
          prix_unitaire: item.prix_unitaire - (item.prix_unitaire * percentage / 100)
        }));
        //console.log('upd', updatedCart)

        dispatch(updateCart(updatedCart));
        setPromoCode('');
      } else {
        console.log('Code promo invalide ou non actif.');
      }
    })
    .catch(error => {
      console.error('Une erreur s\'est produite lors de l\'appel API :', error);
    });
  };
  
  // Restaurer le prix d'origine
  const handleRemoveDiscount = () => {
    const updatedCart = cart.map(item => ({
      ...item,
      prix_unitaire: item.originalPrice 
    }));
  
    dispatch(updateCart(updatedCart));
    setPromoCode('');
  };
  
  
  return (
    <>
    <View style={{ ...defaultStyle, alignItems: 'center', backgroundColor: 'white', paddingHorizontal: 5,paddingVertical:15,  marginBottom:70 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
         <TouchableOpacity onPress={handleBack}>
           <Icon name="arrow-back" size={30} color="#900" />
         </TouchableOpacity>
         <Text style={{ fontSize: 20, fontWeight: "bold", marginLeft: 10 }}>Mon Panier</Text>
       </View>
       <ScrollView  style={{
        marginVertical:10,
          // paddingVertical: 40,
          flex: 1,
        }}>
          {cart.map((item, index) => {
            if (item.type === 'formule'){
              
              const formule = item
              const { option1, option2,option3, prix, libelle, formuleImage, productIds, image, qty } = formule
              return (
                
                  <CardItemFormule
                    option1={option1}
                    option2={option2}
                    option3={option3}
                    prix_unitaire={prix}
                    incrementhandler={() => incrementhandler(item.productId, item.offre)}
                    decrementhandler={() => decrementhandler(item.productId, dispatch)}
                    image={formuleImage}
                    qty={qty}
                    key={index}
                  />
               
              );
            }
                return (
                  <CartItem 
                    libelle = {item.libelle}
                    prix_unitaire={item.prix || item.prix_unitaire}
                    incrementhandler={() => incrementhandler(item.productId, item.offre)}
                    decrementhandler={() => decrementhandler(item.productId, dispatch)}
                    image={item.image}
                    index={index}
                    qty={item.qty}
                    key={index}
                  />
                  );
              })}
              
       </ScrollView>
      
        <View  style={{ marginTop:10, alignItems:'center' }} >
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
            Total des quantités : {totalQuantity}
          </Text>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
          Total de la commande : { totalPrice} euros
          </Text>

          <View style={{ flexDirection:'row', alignItems:'center', gap: 10, marginVertical:10 }}>
          <TextInput
            value={promoCode}
            onChangeText={(value) => setPromoCode(value)}
            placeholder="Code promo"
            style={{ width: 150, marginVertical: 10, borderWidth: 1, borderColor: 'lightgray', paddingHorizontal: 20, paddingVertical: 10 }}
          />
          <Icon name="done" size={30} color="#900" onPress={handleApplyDiscount} />
          <Icon name="clear" size={30} color="#900" onPress={handleRemoveDiscount} />
        </View>
            
          <Button 
              buttonColor='lightgray' 
              onPress={handleConfirm}
          >Confirmer ma commande</Button>
            
          
        </View>
        
    </View>
          <ModaleOffre31 modalVisible={modalVisible} setModalVisible={setModalVisible} handleAcceptOffer={handleAcceptOffer} />

          <FooterProfile />
    </>

  )
  
}

const style = StyleSheet.create({
  
})

export default Panier