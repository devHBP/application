import { View, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React, { useState, useEffect, useRef} from 'react'
import { colors} from '../styles/styles'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useNavigation } from '@react-navigation/native'
import { Badge } from 'react-native-paper';
import { useSelector} from 'react-redux'
import axios from 'axios'

const FooterProfile = () => {
  //on utilise ici useNavigation et non pas navigation car le footer n'est pas dans la pile de screens
  const navigation = useNavigation()
  
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
    const [orders, setOrders] = useState([]);
    const [badgeColor, setBadgeColor] = useState('white');

  const openHome = () => {
    navigation.navigate('home')
  }
  const openOrders = () => {
    navigation.navigate('orders')
  }
  const openCart = () => {
    navigation.navigate('panier')
  }
  const openProfile = () => {
    navigation.navigate('profile')

  }

  //recupérer toutes les commandes du user
  const allMyOrders = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8080/ordersOfUser/${userId}`);
      const orders = response.data;
      //console.log('orders', orders)

       // Triez les commandes par orderId en ordre décroissant
    const sortedOrders = orders.sort((a, b) => b.orderId - a.orderId);

    // Prenez la première commande (la plus récente)
    const latestOrder = sortedOrders[0];
      
    //console.log('Latest Order ID:', latestOrder.orderId, 'Status:', latestOrder.status);
    switch(latestOrder.status) {
          case 'en attente':
            setBadgeColor('gray');
            break;
          case 'preparation':
            setBadgeColor('blue');
            break;
          case 'prete':
            setBadgeColor('green');
            clearInterval(intervalId.current);
            break;
          default:
            setBadgeColor('gray');
        }
      
      
    } catch (error) {
      console.error("Une erreur s'est produite :", error);
    }
  };

  return (
    <View style={style.profile}>
      {/* <Icon name="home" size={30} color="#000" style={style.icon} onPress={openHome}/> */}
      {/* <Icon name="list" size={28} color="#000" style={style.icon} onPress={openOrders} /> */}
      {/* <Icon name="shopping-cart" size={30} color="#000" style={style.icon} onPress={openCart}/> */}

      <TouchableOpacity onPress={openHome}>
      <Image
         source={require('../assets/home.png')} // Remplacez 'my-image' par le nom de votre image
         style={{ width: 28, height: 30, resizeMode:'contain' }} // Remplacez ces valeurs par les dimensions souhaitées
      />
      </TouchableOpacity> 
       
       {/* <Icon name="person" size={30} color="#000" style={style.icon} onPress={openProfile}/> */}
      <Badge size={16} style={{...style.badge, backgroundColor: badgeColor}}></Badge>
      <TouchableOpacity onPress={openOrders}>
        <Image
          source={require('../assets/commande.png')} // Remplacez 'my-image' par le nom de votre image
          style={{ width: 23, height: 28, resizeMode:'stretch' }}
           // Remplacez ces valeurs par les dimensions souhaitées
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={openCart}>
      <Image
         source={require('../assets/panier.png')} // Remplacez 'my-image' par le nom de votre image
         style={{ width: 25, height: 28, resizeMode:'stretch'  }} // Remplacez ces valeurs par les dimensions souhaitées
      />
      </TouchableOpacity>

      <TouchableOpacity onPress={openProfile}>
      <Image
         source={require('../assets/profile.png')} // Remplacez 'my-image' par le nom de votre image
         style={{ width: 20, height: 27, resizeMode:'contain' }} // Remplacez ces valeurs par les dimensions souhaitées
      />
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
    badge: {
      position: 'absolute',
      top: 10,
      left: 150,  
      zIndex:99
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