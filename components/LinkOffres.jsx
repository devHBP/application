import { View, Text, TouchableOpacity, ScrollView , Modal, Image, Linking, FlatList, Platform} from 'react-native'
import React, { useState, useEffect} from 'react'
import { styles} from '../styles/home'; 
import axios from 'axios'
import { useNavigation } from '@react-navigation/native';
import {  API_BASE_URL, API_BASE_URL_ANDROID, API_BASE_URL_IOS } from '@env';
import FastImage from 'react-native-fast-image';
import antigaspiImage from '../assets/antigaspi.jpg';
import offre31 from '../assets/Croissant_offre31.jpg';
import pastilleAntigaspi from '../assets/pastille_antigaspi.png';
import offre31Image from '../assets/offre31.jpg';
import hallesSolanidImage from '../assets/halles_solanid.jpg';
import startUnionImage from '../assets/start_union.jpg';
import halleSolanid from '../assets/fond_halles.jpg'
import popupSUN from '../assets/popupSUN.jpg';
import promoSUN from '../assets/promo_sun.jpg';
import badgeSUN from '../assets/badge_sun.jpg';

const LinkOffres = () => {
   
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

    const navigation = useNavigation();

    const [solanidProductNames, setSolanidProductNames] = useState([]);
    const [offre31ProductNames, setoffre31ProductNames] = useState([])
    const [isModalVisible, setIsModalVisible] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
          try {
          const response = await axios.get(`${API_BASE_URL}/getAllProductsClickandCollect`);
        
          const updatedProducts = response.data.map((product) => ({
            ...product,
            qty: 0, 
          }));

        //produits offre 3+1
        const productsOffre = updatedProducts.filter(product => product.offre && product.offre.startsWith("offre31_"))
        const productsOffreNames = productsOffre.map(product => product.libelle)
        setoffre31ProductNames(productsOffreNames)
       
        // produits solanid
        const solanidProducts = updatedProducts.filter(product => product.reference_fournisseur === "Solanid");
        const solanidProductNames = solanidProducts.map(product => product.libelle);
        setSolanidProductNames(solanidProductNames);    
          } catch (error) {
            console.error('Une erreur s\'est produite, error products :', error);
          }
        };
        fetchData(); 
      }, []);


    const handlePress = (popupData) => {
        setIsModalVisible(true);
      }
      
      const handleClose = () => {
        setIsModalVisible(false)
            }

      const handleAntiGaspi = () => {
        navigation.navigate('antigaspi')
      }
      const handleHallesSolanid = () => {
        //console.log(solanidProductNames)
        navigation.navigate('solanid')
      }

      const handleOffre31 = () => {
        //console.log(offre31ProductNames)
        navigation.navigate('offre31')
      }
      const data = [
        {
            type: 'antigaspi',
            imageUri: antigaspiImage,
            mainText: "L'offre",
            secondaryText: "Anti-gaspillage   ",
            pastilleImage: pastilleAntigaspi
        },
        {
            type: 'offre31',
            imageUri: offre31,
            mainText: "Profitez d'un produit",
            secondaryText: "Gratuit",
            pastilleImage: offre31Image
        },
        {
            type: 'hallesSolanid',
            imageUri: halleSolanid,
            mainText: "Un repas équilibré,",
            thirdText: "frais et de saison avec",
            secondaryText: "Les Halles Solanid",
            pastilleImage: hallesSolanidImage
        },
        {
            type: 'sun',
            imageUri: promoSUN,
            mainText: "Découvrez",
            secondaryText: "les bénéfices       ",
            pastilleImage: badgeSUN
        }
    ];
    
    
    const renderItem = ({ item, index }) => {
        let handlePressFunc, imgSrc, mainText, secondaryText, pastilleImgSrc;
    
        switch(item.type) {
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
                pastilleImgSrc = item.pastilleImage
                break;
            case 'hallesSolanid':
                handlePressFunc = handleHallesSolanid;
                imgSrc = item.imageUri;
                mainText = item.mainText;
                thirdText = item.thirdText;
                secondaryText = item.secondaryText;
                pastilleImgSrc = item.pastilleImage
                break;
            case 'sun':
                handlePressFunc = handlePress;
                imgSrc = item.imageUri;
                mainText = item.mainText;
                secondaryText = item.secondaryText;
                thirdText = item.thirdText;
                pastilleImgSrc = item.pastilleImage
                break;
            default:
                break;
        }
        
        return (
            <TouchableOpacity 
            style={{marginRight: 10}}
            activeOpacity={0.8} 
            onPress={handlePressFunc}
        >
      <FastImage
          source={imgSrc}
          style={{ width: 325, height: 160, resizeMode: 'contain', borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
      />
            <View style={styles.container_offre_antigaspi}>
                <View style={styles.text_antigaspi}>
                    <Text style={styles.texte_offre}>{mainText}</Text>
                    {thirdText && <Text style={styles.texte_offre}>{thirdText}</Text>}
                    {/* <Text style={styles.texte_anti}>{secondaryText}</Text> */}
                    <Text style={[styles.texte_anti, index === 0 ? styles.firstText : styles.otherText]}>{secondaryText}</Text>

                </View>
                <View style={styles.pastille}>
                    <Image
                        source={pastilleImgSrc}  
                        style={{ width: 50, resizeMode: 'contain' }}
                    />
                  
                </View>
            </View>
        </TouchableOpacity>
        );
    }

    return (
        <View>
            <FlatList
                data={data}
                renderItem={renderItem}
                horizontal={true}
                style={{ marginVertical: 10, marginLeft: 30 }}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => item.type + index.toString()}
            />


            {/* popup modale SUN... */}
            <Modal
          animationType="fade"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={handleClose}>
           
          <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} activeOpacity={1}  onPress={handleClose}>
            <View 
               onStartShouldSetResponder={() => true}  // capture le toucher évitant la propagation
                style={modalStyle}>
              <TouchableOpacity onPress={handleClose} style={{ alignItems: 'center', position:'absolute', top:0, right:10, zIndex:99}}>
                <Text style={{ fontSize: 36}}>&times;</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => openLink('https://www.start-union.fr')}>
                <Image
                  // source={require('../assets/popupSUN.jpg')}
                  source={{uri:'https://cdn.lepaindujour.io/assets/popupSUN.jpg'}}
                  style={{ width:"100%", height:"100%", resizeMode:'cover', zIndex:1}}
              />
              </TouchableOpacity>
              
            </View>
            </TouchableOpacity>  
        </Modal>
        </View>
    );
}
const modalStyle = {
    width: '74%',
    height:"90%",
    backgroundColor: 'white',
    borderRadius: 10,
    // Ombre pour iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    // Ombre pour Android
    elevation: 5,
  };

export default LinkOffres
