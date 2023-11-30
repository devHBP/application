import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
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
import {API_BASE_URL, API_BASE_URL_ANDROID, API_BASE_URL_IOS} from '@env';
import FastImage from 'react-native-fast-image';
import antigaspiImage from '../assets/antigaspi.jpg';
import antigaspiImage2 from '../assets/anti.jpg';
import offre31 from '../assets/Croissant_offre31.jpg';
import pastilleAntigaspi from '../assets/pastille_antigaspi.png';
import offre31Image from '../assets/offre31.jpg';
import hallesSolanidImage from '../assets/halles_solanid.jpg';
import startUnionImage from '../assets/start_union.jpg';
import halleSolanid from '../assets/fond_halles.jpg';
import popupSUN from '../assets/popupSUN.jpg';
import promoSUN from '../assets/promo_sun.jpg';
import badgeSUN from '../assets/badge_sun.jpg';
import ScrollIndicators from './ScrollIndicators.';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import Compteur from '../SVG/Compteur';

const LinkOffres = () => {


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

  const [solanidProductNames, setSolanidProductNames] = useState([]);
  const [offre31ProductNames, setoffre31ProductNames] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

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

        // produits solanid
        const solanidProducts = updatedProducts.filter(
          product => product.reference_fournisseur === 'Solanid',
        );
        const solanidProductNames = solanidProducts.map(
          product => product.libelle,
        );
        setSolanidProductNames(solanidProductNames);
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

  // // 2. Définir la date et l'heure de disponibilité
  // const availabilityTime = new Date();
  // availabilityTime.setHours(11, 35, 0);

  // intervalle de décompte
  // useEffect(() => {
  //   const updateCountdown = () => {
  //     const now = new Date();
  //     const difference = availabilityTime - now;

  //     if (difference > 0) {
  //       const hours = Math.floor(difference / (1000 * 60 * 60));
  //       const minutes = Math.floor(
  //         (difference % (1000 * 60 * 60)) / (1000 * 60),
  //       );
  //       const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  //       setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
  //     } else {
  //       setTimeRemaining('');
  //       clearInterval(intervalId);
  //     }
  //   };

  //   updateCountdown();
  //   const intervalId = setInterval(updateCountdown, 1000);

  //   return () => clearInterval(intervalId);
  // }, []);
  // useEffect(() => {
  //   const updateCountdown = () => {
  //     const now = new Date();
  //     const endTime = new Date(now);
  //     endTime.setHours(11, 55, 0); // Heure de fin de l'offre

  //     const difference = endTime - now;

  //     if (difference > 0) {
  //       // Compte à rebours en cours
  //       const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  //       const seconds = Math.floor((difference % (1000 * 60)) / 1000);
  //       setTimeRemaining(`${minutes}m ${seconds}s`);
  //     } else {
  //       // Compte à rebours terminé
  //       setTimeRemaining('');
  //       clearInterval(intervalId);
  //     }
  //   };

  //   updateCountdown();
  //   const intervalId = setInterval(updateCountdown, 1000);

  //   return () => clearInterval(intervalId);
  // }, []);

  //test : les 2 fonctionnes 
  // useEffect(() => {
  //   const updateCountdown = () => {
  //     const now = new Date();
  //     let endTime = new Date();

  //     // Fin du compteur à 20h59m59s
  //     endTime.setHours(20, 59, 59, 999);

  //     if (now.getHours() >= 21) {
  //       endTime.setDate(now.getDate() + 1); // Passer au jour suivant après 21h
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

  //   updateCountdown();
  //   const intervalId = setInterval(updateCountdown, 1000);

  //   return () => clearInterval(intervalId);
  // }, []);

 
  // useEffect(() => {
  //   const updateCountdownVisibility = () => {
  //     const now = new Date();
  //     const hours = now.getHours();
  //     const minutes = now.getMinutes();
  
  //     // Afficher le compteur en dehors de 21h à minuit
  //     setShowCountdown(!(hours >= 21 && hours < 24));
  //   };
  
  //   const calculateIntervalLength = () => {
  //     const now = new Date();
  //     const hours = now.getHours();
  //     const minutes = now.getMinutes();
  
  //     // Rafraîchissement toutes les secondes entre 20h50 et 00h10
  //     if ((hours === 20 && minutes >= 50) || (hours === 0 && minutes <= 2) || (hours === 21 && minutes === 0)) {
  //       console.log('cest le creneau à 1 seconde')
  //       return 1000; // 1 seconde
  //     } else {
  //       console.log('cest le creneau à 1 minute')
  //       return 60000; // 60 secondes
  //     }
  //   };
  
  //   const intervalLength = calculateIntervalLength();
  //   const intervalId = setInterval(() => {
  //     updateCountdownVisibility();
  //   }, intervalLength);
  
  //   return () => clearInterval(intervalId);
  // }, []);
  
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      let endTime = new Date();
  
      // Fin du compteur à 20h59m59s
      endTime.setHours(20, 59, 59, 999);
  
      if (now.getHours() >= 21) {
        endTime.setDate(now.getDate() + 1); // Passer au jour suivant après 21h
      }
  
      const difference = endTime - now;
  
      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeRemaining('');
      }
    };
  
    const updateCountdownVisibility = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
  
      // Afficher le compteur en dehors de 21h à minuit
      setShowCountdown(!(hours >= 21 && hours < 24));
    };
  
    const update = () => {
      updateCountdown();
      updateCountdownVisibility();
    };
  
    // Mettre à jour toutes les secondes
    const intervalId = setInterval(update, 1000);
  
    return () => clearInterval(intervalId);
  }, []);
  
  

  const handleAntiGaspi = () => {
    const d = new Date();
    const hours = d.getHours();
    const minutes = d.getMinutes();
    //ouverture de la vignette - offre de 12h à 12h02
    if (hours >= 21 && hours < 24) {
      navigation.navigate('antigaspi');
    } else {
      // console.log('ce nest pas encore lheure')
      // console.log(`${hours}:${minutes}`);
      Toast.show({
        type: 'error',
        text1: `Une peu de patience...`,
        text2: `L'offre arrive à partir de 21h`,
        visibilityTime: 6000,
      });
    }
  };
  const handleHallesSolanid = () => {
    navigation.navigate('solanid');
  };

  const handleOffre31 = () => {
    //console.log(offre31ProductNames)
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
      type: 'offre31',
      imageUri: offre31,
      mainText: "Profitez d'un produit",
      secondaryText: 'Gratuit',
      pastilleImage: offre31Image,
    },
    {
      type: 'hallesSolanid',
      imageUri: halleSolanid,
      mainText: 'Un repas équilibré,',
      thirdText: 'frais et de saison avec',
      secondaryText: 'Les Halles Solanid',
      pastilleImage: hallesSolanidImage,
    },
    {
      type: 'sun',
      imageUri: promoSUN,
      mainText: 'Découvrez',
      secondaryText: 'les bénéfices       ',
      pastilleImage: badgeSUN,
    },
  ];

  const renderItem = ({item, index}) => {
    let handlePressFunc, imgSrc, mainText, secondaryText, pastilleImgSrc;

    switch (item.type) {
      case 'antigaspi':
        handlePressFunc = handleAntiGaspi;
        imgSrc = item.imageUri;
        mainText = item.mainText;
        secondaryText = item.secondaryText;
        thirdText = item.thirdText;
        pastilleImgSrc = item.pastilleImage;
        break;
      case 'offre31':
        handlePressFunc = handleOffre31;
        imgSrc = item.imageUri;
        mainText = item.mainText;
        secondaryText = item.secondaryText;
        thirdText = item.thirdText;
        pastilleImgSrc = item.pastilleImage;
        break;
      case 'hallesSolanid':
        handlePressFunc = handleHallesSolanid;
        imgSrc = item.imageUri;
        mainText = item.mainText;
        thirdText = item.thirdText;
        secondaryText = item.secondaryText;
        pastilleImgSrc = item.pastilleImage;
        break;
      case 'sun':
        handlePressFunc = handlePress;
        imgSrc = item.imageUri;
        mainText = item.mainText;
        secondaryText = item.secondaryText;
        thirdText = item.thirdText;
        pastilleImgSrc = item.pastilleImage;
        break;
      default:
        break;
    }

    return (
      <TouchableOpacity
        style={{marginRight: 10}}
        activeOpacity={0.8}
        onPress={handlePressFunc}>
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
