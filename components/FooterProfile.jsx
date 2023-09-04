import { View, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React, { useState, useEffect, useRef} from 'react'
import { colors} from '../styles/styles'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useNavigation } from '@react-navigation/native'
import { Badge } from 'react-native-paper';
import { useSelector} from 'react-redux'
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import {  API_BASE_URL, API_BASE_URL_ANDROID, API_BASE_URL_IOS } from '@env';
import Home from '../SVG/Home'
import Orders from '../SVG/Orders'
import Cart from '../SVG/Cart'
import Profile from '../SVG/Profile'

const FooterProfile = () => {

  
  //on utilise ici useNavigation et non pas navigation car le footer n'est pas dans la pile de screens
  const navigation = useNavigation()

  const [orders, setOrders] = useState([]);
  const [badgeColor, setBadgeColor] = useState('white');
  const [isBadgeVisible, setIsBadgeVisible] = useState(false);
  
  const intervalId = useRef()

  useEffect(() => {
    intervalId.current= setInterval(() => { // Utilisez intervalId ici
      allMyOrders();
    }, 1000); // 5000 ms = 5 s

    // Nettoyer l'intervalle lors du démontage du composant
    return () => {
      clearInterval(intervalId.current);
    };
  }, [orders]);



  const user = useSelector((state) => state.auth.user);
  const userId = user.userId

  const cart = useSelector((state) => state.cart.cart);
  const totalQuantity = cart.reduce((total, item) => total + item.qty, 0);

  const openHome = () => {
    navigation.navigate('home')
  }
  const openOrders = () => {
    navigation.navigate('orders')
  }
  const openCart = async () => {
    const token = await AsyncStorage.getItem('userToken');
     axios.get(`${API_BASE_URL}/verifyToken`, {
      headers: {
          'x-access-token': token
      }
    })
    .then(response => {
      if (response.data.auth) {
          navigation.navigate('panier')
      } 
  })
  .catch(error => {
    handleLogout()
    //console.log('token invalide catch')
    return Toast.show({
      type: 'error',
      text1: 'Session expirée',
      text2: 'Veuillez vous reconnecter'
    });
      // console.error('Une erreur s\'est produite lors de la vérification du token :', error);
  });
  
};
  const openProfile = () => {
    navigation.navigate('profile')
  }
  //deconnexion
  const handleLogout = () => {
    dispatch(clearCart())
    navigation.navigate('app')
  }

  //recupérer toutes les commandes du user
  const allMyOrders = async () => {
    if (!userId) {
      return;
    }
    try {
      const response = await axios.get(`${API_BASE_URL}/ordersOfUser/${userId}`);
      const orders = response.data;
     


      if(orders && orders.length > 0){
           // Triez les commandes par orderId en ordre décroissant
    const sortedOrders = orders.sort((a, b) => b.orderId - a.orderId);

    // Prenez la première commande (la plus récente)
    const latestOrder = sortedOrders[0];
      
    //console.log('Latest Order ID:', latestOrder.orderId, 'Status:', latestOrder.status);
    switch(latestOrder.status) {
          case 'en attente':
            setBadgeColor('gray');
            setIsBadgeVisible(true)
            break;
          case 'preparation':
            setBadgeColor('blue');
            setIsBadgeVisible(true)
            break;
          case 'prete':
            setBadgeColor('green');
            clearInterval(intervalId.current);
            setIsBadgeVisible(true)
            break;
          case 'livree':
            clearInterval(intervalId.current);
            setIsBadgeVisible(false)
            break;
          default:
            setBadgeColor('purple');
            setIsBadgeVisible(true)
        }
      }
      else {
        setIsBadgeVisible(false);
      }
      
    } catch (error) {
      console.error("Une erreur s'est produite, order :", error);
    }
  };

  return (
    <View style={style.profile}>
      {/* <Icon name="home" size={30} color="#000" style={style.icon} onPress={openHome}/> */}
      {/* <Icon name="list" size={28} color="#000" style={style.icon} onPress={openOrders} /> */}
      {/* <Icon name="shopping-cart" size={30} color="#000" style={style.icon} onPress={openCart}/> */}

      <TouchableOpacity onPress={openHome}>
        <Home />
      {/* <Image
         source={require('../assets/home.png')} // Remplacez 'my-image' par le nom de votre image
         style={{ width: 28, height: 30, resizeMode:'contain' }} // Remplacez ces valeurs par les dimensions souhaitées
      /> */}
      </TouchableOpacity> 
       
      <View style={style.badgeContainer}>
       {/* <Icon name="person" size={30} color="#000" style={style.icon} onPress={openProfile}/> */}
       {isBadgeVisible && (
        <Badge size={16} style={{...style.badge, backgroundColor: badgeColor}}></Badge>
      )}
      <TouchableOpacity onPress={openOrders}>
        {/* <Image
          source={require('../assets/commande.png')} // Remplacez 'my-image' par le nom de votre image
          style={{ width: 23, height: 28, resizeMode:'stretch' }}
           // Remplacez ces valeurs par les dimensions souhaitées
        /> */}
        <Orders />
      </TouchableOpacity>
      </View>

      <View style={style.badgeContainer}>
        <Badge visible={cart.length > 0} size={18} style={style.badgeCart}>
            {totalQuantity}
          </Badge>
        <TouchableOpacity onPress={openCart}>
        {/* <Image
          source={require('../assets/panier.png')} // Remplacez 'my-image' par le nom de votre image
          style={{ width: 25, height: 28, resizeMode:'stretch'  }} // Remplacez ces valeurs par les dimensions souhaitées
        /> */}
        <Cart />
      </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={openProfile}>
      {/* <Image
         source={require('../assets/profile.png')} // Remplacez 'my-image' par le nom de votre image
         style={{ width: 20, height: 27, resizeMode:'contain' }} // Remplacez ces valeurs par les dimensions souhaitées
      /> */}
      <Profile />
      </TouchableOpacity>
    </View>
  )
}

const style = StyleSheet.create({
    profile: {
        height:'10%',
        width:'100%', 
        position:'absolute', 
        bottom:0, 
        backgroundColor:colors.color1,
        flex:1,
        flexDirection: 'row',
        justifyContent:'space-around',
        alignItems:'center',
    },
    badgeContainer: {
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'center',
    },
    badge: {
      position: 'absolute',
      top: -5,
      right: -5,  
      zIndex:99
     },
     badgeCart: {
      position: 'absolute',
      top: -5,
      right: -5,  
      zIndex:99,
      backgroundColor:colors.color2
     },
  });

export default FooterProfile