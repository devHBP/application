import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {colors} from '../styles/styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {Badge} from 'react-native-paper';
import {useSelector} from 'react-redux';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
// import {API_BASE_URL, API_BASE_URL_ANDROID, API_BASE_URL_IOS} from '@env';
import { API_BASE_URL } from '../config';
import Home from '../SVG/Home';
import Orders from '../SVG/Orders';
import Cart from '../SVG/Cart';
import Profile from '../SVG/Profile';
import Bug from '../SVG/Bug';
import LoginInvite from '../SVG/LoginInvite';
import ModaleInvite from './ModalInvite';
import FastImage from 'react-native-fast-image';


const FooterProfile = () => {
  //on utilise ici useNavigation et non pas navigation car le footer n'est pas dans la pile de screens
  const navigation = useNavigation();

  const [orders, setOrders] = useState([]);
  const [badgeColor, setBadgeColor] = useState('white');
  const [isBadgeVisible, setIsBadgeVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const intervalId = useRef();

  useEffect(() => {
    // intervalId.current= setInterval(() => {
    //   console.log("Récupération des commandes...");
    //   allMyOrders();
    // }, 1000); // 5000 ms = 5 s
    // // Nettoyer l'intervalle lors du démontage du composant
    // return () => {
    //   clearInterval(intervalId.current);
    // };
    // allMyOrders()
  }, []);

    const openLink = (url) => {
      if (Platform.OS === 'android') {
          Linking.openURL(url)
            .then((supported) => {
              if (!supported) {
                console.log("Can't handle URL: " + url);
              } else {
                return Linking.openURL(url);
              }
            })
            .catch((err) => console.error('An error occurred', err));
      } else if (Platform.OS === 'ios') {
          Linking.canOpenURL(url)
            .then((supported) => {
              if (!supported) {
                console.log("Can't handle URL: " + url);
              } else {
                return Linking.openURL(url);
              }
            })
            .catch((err) => console.error('An error occurred', err));
      }
  }

  const user = useSelector(state => state.auth.user);
  const userId = user.userId;
  const cart = useSelector(state => state.cart.cart);
  const totalQuantity = cart.reduce((total, item) => total + item.qty, 0);

  const openHome = () => {
    //retour en position page haute
    navigation.navigate('home', {shouldScrollToTop: true});
  };
  const openOrders = () => {
    navigation.navigate('orders');
  };
  const openCart = async () => {
    navigation.navigate('panier');
    //   const token = await AsyncStorage.getItem('userToken');
    //    axios.get(`${API_BASE_URL}/verifyToken`, {
    //     headers: {
    //         'x-access-token': token
    //     }
    //   })
    //   .then(response => {
    //     if (response.data.auth) {
    //         navigation.navigate('panier')
    //     }
    // })
    // .catch(error => {
    //   handleLogout()
    //   //console.log('token invalide catch')
    //   return Toast.show({
    //     type: 'error',
    //     text1: 'Session expirée',
    //     text2: 'Veuillez vous reconnecter'
    //   });
    //     // console.error('Une erreur s\'est produite lors de la vérification du token :', error);
    // });
  };
  const openProfile = () => {
    navigation.navigate('profile');
  };

  const openPopupInvite = () => {
    setIsModalVisible(true);
  };
  //deconnexion
  // const handleLogout = () => {
  //   dispatch(clearCart())
  //   navigation.navigate('app')
  // }

  // const allMyOrders = async () => {
  //   if (!userId) {
  //     return;
  //   }
  //   try {
  //     // console.log('Récupération du statut de la dernière commande...');

  //     const response = await axios.get(`${API_BASE_URL}/statusLastOrder/${userId}`);
  //     const orderStatus = response.data.status;

  //     if (orderStatus) {
  //       switch (orderStatus) {
  //         case 'en attente':
  //           setBadgeColor('gray');
  //           setIsBadgeVisible(true);
  //           break;
  //         case 'preparation':
  //           setBadgeColor('blue');
  //           setIsBadgeVisible(true);
  //           break;
  //         case 'prete':
  //           setBadgeColor('green');
  //           setIsBadgeVisible(true);
  //           break;
  //         case 'livree':
  //           setIsBadgeVisible(false);
  //           break;
  //         default:
  //           setBadgeColor('purple');
  //           setIsBadgeVisible(true);
  //       }
  //     } else {
  //       setIsBadgeVisible(false);
  //     }

  //   } catch (error) {
  //     console.log("Une erreur s'est produite lors de la récupération du statut de la commande footer profile :", error);
  //   }
  // };

  return (
    <View style={style.profile}>
      <TouchableOpacity onPress={openHome}>
        <Home />
      </TouchableOpacity>

      <View style={style.badgeContainer}>
        {/* {isBadgeVisible && (
        <Badge size={16} style={{...style.badge, backgroundColor: badgeColor}}></Badge>
      )} */}

        <TouchableOpacity
          onPress={user.role == 'invite' ? openPopupInvite : openOrders}>
          <Orders />
        </TouchableOpacity>
      </View>

      <View style={style.badgeContainer}>
        <Badge visible={cart.length > 0} size={18} style={style.badgeCart}>
          {totalQuantity}
        </Badge>
        <TouchableOpacity onPress={openCart}>
          <Cart />
        </TouchableOpacity>
      </View>

      {user.role !== 'invite' && (
        <TouchableOpacity onPress={openProfile}>
          <Profile />
        </TouchableOpacity>
      )}
      {/* icone BUG */}
      {
          user.role !== 'invite' &&
              <TouchableOpacity onPress={() => openLink('https://www.help.lepaindujour.io/')}>
                {/* <Bug color={colors.color6}/> */}
                <FastImage
                    source={require('../assets/Question.jpg')}
                     style={{ width: 30, height: 30, resizeMode:'cover' }}
                    />
              </TouchableOpacity>
        }

      {user.role == 'invite' && (
        <TouchableOpacity onPress={openPopupInvite}>
          <LoginInvite />
        </TouchableOpacity>
      )}
      <ModaleInvite
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        navigation={navigation}
      />
    </View>
  );
};

const style = StyleSheet.create({
  profile: {
    height: 100,
    width: '100%',
    backgroundColor: colors.color1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
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
    zIndex: 99,
  },
  badgeCart: {
    position: 'absolute',
    top: -5,
    right: -5,
    zIndex: 99,
    backgroundColor: colors.color2,
  },
});

export default FooterProfile;
