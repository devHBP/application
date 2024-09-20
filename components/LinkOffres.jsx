import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Image,
  Linking,
  FlatList,
  Platform,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {styles} from '../styles/home';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import {API_BASE_URL} from '../config';
import FastImage from 'react-native-fast-image';
import baguetteSUN from '../assets/offreSUNbaguette.jpg';
import antigaspiImage2 from '../assets/anti2.jpg';
import offre31 from '../assets/Croissant_offre31.jpg';
import pastilleAntigaspi from '../assets/pastille_antigaspi.png';
import offre31Image from '../assets/offre31.jpg';
import startUnionImage from '../assets/start_union.jpg';
import popupSUN from '../assets/popupSUN.jpg';
import promoSUN from '../assets/promo_sun.jpg';
import badgeSUN from '../assets/badge_sun.jpg';
import ScrollIndicators from './ScrollIndicators.';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import Compteur from '../SVG/Compteur';
import {useSelector, useDispatch} from 'react-redux';
import {fetchAllProductsClickAndCollect, checkIfUserOrderedOffreSUNToday} from '../CallApi/api';
import ModaleOffreSUN from './ModaleOffreSUN';
import { formatToDateISO } from '../Fonctions/fonctions';

const LinkOffres = ({hasOrderedOffreSun}) => {
  const openLink = url => {
    if (Platform.OS === 'android') {
      Linking.openURL(url)
        .then(supported => {
          if (!supported) {
            console.log("Can't handle URL: " + url);
          } else {
            return Linking.openURL(url);
          }
        })
        .catch(err => console.error('An error occurred', err));
    } else if (Platform.OS === 'ios') {
      Linking.canOpenURL(url)
        .then(supported => {
          if (!supported) {
            console.log("Can't handle URL: " + url);
          } else {
            return Linking.openURL(url);
          }
        })
        .catch(err => console.error('An error occurred', err));
    }
  };

  const navigation = useNavigation();

  const [offre31ProductNames, setoffre31ProductNames] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalSunVisible, setIsModalSunVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const cart = useSelector(state => state.cart.cart);
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();

  const getTomorrowISODate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1); // J+1
    return tomorrow.toISOString().split('T')[0]; // On prend juste la date sans l'heure
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/getAllProductsClickandCollect`,
        );

        const updatedProducts = response.data.map(product => ({
          ...product,
          qty: 0,
        }));

        //produits offre 3+1
        const productsOffre = updatedProducts.filter(
          product => product.offre && product.offre.startsWith('offre31_'),
        );
        const productsOffreNames = productsOffre.map(
          product => product.libelle,
        );
        setoffre31ProductNames(productsOffreNames);
      } catch (error) {
        console.error("Une erreur s'est produite, error products :", error);
      }
    };
    fetchData();
  }, []);

  const handlePress = popupData => {
    setIsModalVisible(true);
  };

  const handleClose = () => {
    setIsModalVisible(false);
  };

  const [timeRemaining, setTimeRemaining] = useState('');
  const [showCountdown, setShowCountdown] = useState(true);

  // useEffect(() => {
  //   const updateCountdown = () => {
  //     const now = new Date();
  //     let endTime = new Date();

  //     // Fin du compteur à 20h59m59s
  //     endTime.setHours(20, 59, 59, 999);

  //     if (now.getHours() >= 21) {
  //       endTime.setDate(now.getDate() + 1);
  //     }

  //     const difference = endTime - now;

  //     if (difference > 0) {
  //       const hours = Math.floor(difference / (1000 * 60 * 60));
  //       const minutes = Math.floor(
  //         (difference % (1000 * 60 * 60)) / (1000 * 60),
  //       );
  //       const seconds = Math.floor((difference % (1000 * 60)) / 1000);
  //       setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
  //     } else {
  //       setTimeRemaining('');
  //     }
  //   };

  //   const updateCountdownVisibility = () => {
  //     const now = new Date();
  //     const hours = now.getHours();
  //     const minutes = now.getMinutes();

  //     // Afficher le compteur en dehors de 21h à minuit
  //     setShowCountdown(!(hours >= 21 && hours < 24));
  //   };

  //   const update = () => {
  //     updateCountdown();
  //     updateCountdownVisibility();
  //   };

  //   // Mettre à jour toutes les secondes
  //   const intervalId = setInterval(update, 1000);

  //   return () => clearInterval(intervalId);
  // }, [cart]);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      let endTime = new Date();
      endTime.setHours(20, 59, 59, 999);

      if (now.getHours() >= 21) {
        endTime.setDate(now.getDate() + 1);
      }

      const difference = endTime - now;

      if (difference > 0) {
        const timeString = new Date(difference).toISOString().substr(11, 8);
        setTimeRemaining(timeString);
      } else {
        setTimeRemaining('');
      }
    };

    const updateCountdownVisibility = () => {
      const now = new Date();
      setShowCountdown(!(now.getHours() >= 21 && now.getHours() < 24));
    };

    const intervalId = setInterval(() => {
      updateCountdown();
      updateCountdownVisibility();
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const handleAntiGaspi = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/checkAntiGaspi`);
      if (response.data.accessible === true) {
        navigation.navigate('antigaspi');
      } else {
        Toast.show({
          type: 'error',
          text1: `Un peu de patience...`,
          text2: `L'offre arrive à partir de 21h`,
          visibilityTime: 6000,
        });
      }
    } catch (error) {
      console.error(
        "Erreur lors de la vérification de l'accès à l'antigaspi",
        error,
      );
      Toast.show({
        type: 'error',
        text1: 'Erreur de communication avec le serveur',
      });
    }
  };

  const handleOffreSun = async () => {
    const allProductsClickandCollect = await fetchAllProductsClickAndCollect();
    const offreSunProduct = allProductsClickandCollect.find(
      product => product.type_produit === 'offreSUN',
    );
    const isOffreSunInCart = cart.some(item => item.typeProduit === 'offreSUN');
    if (isOffreSunInCart) {
      Toast.show({
        type: 'error',
        text1: 'Offre déja ajoutée',
        text2: "Vous avez déjà une baguette 'offreSUN' dans votre panier",
      });
      return;
    }

    const checkFreeOffer = await checkIfUserOrderedOffreSUNToday(
      user.userId,
      getTomorrowISODate(),
    );
    if(checkFreeOffer){
      Toast.show({
        type: 'error',
        text1: 'Offre déja consommée',
        text2: `Vous avez déjà une commandé une baguette pour le ${getTomorrowISODate()}`,
      });
      return;
    }

    // je veux ajouter le produit : offreSunProduct si pas encore présent dans le panier
    if (offreSunProduct) {
      setIsModalSunVisible(true);
      setSelectedProduct(offreSunProduct);
    }
  };

  const handleOffreNoel = () => {
    navigation.navigate('noel');
  };

  const handleOffre31 = () => {
    navigation.navigate('offre31');
  };

  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = event => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const activeIndex = Math.round(scrollPosition / 325);
    setActiveIndex(activeIndex);
  };

  const data = [
    {
      type: 'antigaspi',
      imageUri: antigaspiImage2,
      mainText: "L'offre",
      secondaryText: 'Anti-gaspillage   ',
      pastilleImage: pastilleAntigaspi,
    },
    {
      type: 'baguetteSUN',
      imageUri: baguetteSUN,
      mainText: 'Votre baguette         ',
      secondaryText: 'Gratuite      ',
      pastilleImage: badgeSUN,
    },
    {
      type: 'offre31',
      imageUri: offre31,
      mainText: "Profitez d'un produit",
      secondaryText: 'Gratuit',
      pastilleImage: offre31Image,
    },
    {
      type: 'sun',
      imageUri: promoSUN,
      mainText: 'Découvrez',
      secondaryText: 'les bénéfices       ',
      pastilleImage: badgeSUN,
    },
  ];

  // Ajout du isDisabled pour la vignette baguetteSUN de manière à ce qu'il soit le seul encart désactivé si la commande à été passée
  const renderItem = ({item, index}) => {
    let handlePressFunc, imgSrc, mainText, secondaryText, pastilleImgSrc, isDisabled;

    switch (item.type) {
      case 'antigaspi':
        handlePressFunc = handleAntiGaspi;
        imgSrc = item.imageUri;
        mainText = item.mainText;
        secondaryText = item.secondaryText;
        thirdText = item.thirdText;
        pastilleImgSrc = item.pastilleImage;
        isDisabled = false;
        break;
      case 'baguetteSUN':
        handlePressFunc = handleOffreSun ;
        imgSrc = item.imageUri;
        mainText = item.mainText;
        secondaryText = item.secondaryText;
        thirdText = item.thirdText;
        pastilleImgSrc = item.pastilleImage;
        isDisabled = hasOrderedOffreSun;
        break;
      case 'custom':
        handlePressFunc = handleOffreNoel;
        imgSrc = item.imageUri;
        mainText = item.mainText;
        secondaryText = item.secondaryText;
        thirdText = item.thirdText;
        pastilleImgSrc = item.pastilleImage;
        isDisabled = false;
        break;
      case 'offre31':
        handlePressFunc = handleOffre31;
        imgSrc = item.imageUri;
        mainText = item.mainText;
        secondaryText = item.secondaryText;
        thirdText = item.thirdText;
        pastilleImgSrc = item.pastilleImage;
        isDisabled = false;
        break;
      case 'sun':
        handlePressFunc = handlePress;
        imgSrc = item.imageUri;
        mainText = item.mainText;
        secondaryText = item.secondaryText;
        thirdText = item.thirdText;
        pastilleImgSrc = item.pastilleImage;
        isDisabled = false;
        break;
      default:
        break;
    }

    return (
      <TouchableOpacity
        style={[
          {marginRight: 10},
          isDisabled && { opacity: 0.5 }
        ]}
        activeOpacity={0.8}
        onPress={handlePressFunc}
      >
        <View style={styles.offerContainer}>
          {index === 0 && timeRemaining && showCountdown && (
            <View style={styles.overlayContainer}>
              <Image
                source={require('../assets/bg_antigaspi.jpg')}
                style={styles.fullSizeImage}
              />
              <View style={styles.contentPopUp}>
                <Compteur />
                <Text style={styles.countdownText}>Disponible de</Text>
                <Text style={styles.countdownText}>21h à Minuit</Text>
                <View style={styles.contentRemaining}>
                  <Text style={styles.textRemaining}>dans {timeRemaining}</Text>
                </View>
              </View>
            </View>
          )}
          <FastImage source={imgSrc} style={styles.vignetteAntiGaspi} />

          <View style={styles.container_offre_antigaspi}>
            <View style={styles.text_antigaspi}>
              <Text style={styles.texte_offre}>{mainText}</Text>
              {thirdText && <Text style={styles.texte_offre}>{thirdText}</Text>}
              {/* <Text style={styles.texte_anti}>{secondaryText}</Text> */}
              <Text
                style={[
                  styles.texte_anti,
                  index === 0 ? styles.firstText : styles.otherText,
                ]}>
                {secondaryText}
              </Text>
            </View>
            <View style={styles.pastille}>
              <Image
                source={pastilleImgSrc}
                style={{width: 50, resizeMode: 'contain'}}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <FlatList
        data={data}
        renderItem={renderItem}
        horizontal={true}
        style={{marginVertical: 10, marginLeft: 30}}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => item.type + index.toString()}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />

      <ScrollIndicators dataLength={data.length} activeIndex={activeIndex} />

      {/* popup modale SUN... */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={handleClose}>
        <TouchableOpacity
          style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
          activeOpacity={1}
          onPress={handleClose}>
          <View onStartShouldSetResponder={() => true} style={modalStyle}>
            <TouchableOpacity
              onPress={handleClose}
              style={{
                alignItems: 'center',
                position: 'absolute',
                top: 0,
                right: 10,
                zIndex: 99,
              }}>
              <Text style={{fontSize: 36}}>&times;</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => openLink('https://www.start-union.fr')}>
              <Image
                source={require('../assets/popupSUN.jpg')}
                // source={{
                //   uri: 'https://cdn.lepaindujour.io/assets/popupSUN.jpg',
                // }}
                style={{
                  width: '100%',
                  height: '100%',
                  resizeMode: 'cover',
                  zIndex: 1,
                }}
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* 2e modale - baguette SUN */}
      <ModaleOffreSUN
        modalVisible={isModalSunVisible}
        setModalVisible={setIsModalSunVisible}
        product={selectedProduct}
      />
    </View>
  );
};
const modalStyle = {
  width: '74%',
  height: '90%',
  backgroundColor: 'white',
  borderRadius: 10,
  // Ombre pour iOS
  shadowColor: '#000',
  shadowOffset: {width: 0, height: 3},
  shadowOpacity: 0.5,
  shadowRadius: 5,
  // Ombre pour Android
  elevation: 5,
};

export default LinkOffres;
