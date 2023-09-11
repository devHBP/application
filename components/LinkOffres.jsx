import { View, Text, TouchableOpacity, ScrollView , Modal, Image, Linking} from 'react-native'
import React, { useState, useEffect} from 'react'
import { styles} from '../styles/home'; 
import popupData from '../Datas/datas.json';
import axios from 'axios'
import { useNavigation } from '@react-navigation/native';
import {  API_BASE_URL, API_BASE_URL_ANDROID, API_BASE_URL_IOS } from '@env';
import FastImage from 'react-native-fast-image';


const LinkOffres = ({}) => {


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
        console.log(solanidProductNames)
        navigation.navigate('solanid')
      }

      const handleOffre31 = () => {
        console.log(offre31ProductNames)
        navigation.navigate('offre31')
      }

  return (
    <View >
     <ScrollView horizontal={true} style={{marginVertical:10, marginLeft:30}} showsHorizontalScrollIndicator={false}>

        {/* anti gaspi */}
        {/* ajouter action onPress */}

        <TouchableOpacity style={{marginRight:10}}  activeOpacity={0.8} onPress={handleAntiGaspi}>
        <Image
                // source={require('../assets/antigaspi.jpg')} 
                source={{uri:'https://cdn.lepaindujour.io/assets/antigaspi.jpg'}}
                style={{ width: 315, height: 200, resizeMode:'cover', borderTopLeftRadius:10, borderTopRightRadius:10 }}
                />
          
         {/* <FastImage
          style={{ width: 315, height: 200, borderTopLeftRadius:10, borderTopRightRadius:10  }}
          source={{
            uri: `${API_BASE_URL}/Images/antigaspi.jpg`,
              priority: FastImage.priority.high,
          }}
          resizeMode={FastImage.resizeMode.cover}
      /> */}
        <View style={styles.container_offre_antigaspi}>
            <View style={styles.text_antigaspi}>
            <Text style={styles.texte_offre} >L'offre </Text>
            <Text style={styles.texte_anti}>Anti-gaspillage</Text>
            </View>
            <View style={styles.pastille}>
            
              <Image
                  source={require('../assets/pastille_antigaspi.png')}
                  style={{ width:50, resizeMode:'contain'}}
              />
            
            
            </View>
        </View>
        
        </TouchableOpacity>

        {/* Offre 3+1 */}
        <TouchableOpacity style={{marginRight:10}}  activeOpacity={0.8} onPress={handleOffre31}>
        <Image
                // source={require('../assets/Croissant_offre31.jpg')} 
                source={{uri:'https://cdn.lepaindujour.io/assets/Croissant_offre31.jpg'}}
                style={{ width: 315, height: 200, resizeMode:'cover', borderTopLeftRadius:10, borderTopRightRadius:10 }}
                />

      {/* <FastImage
                style={{ width: 315, height: 200, borderTopLeftRadius:10, borderTopRightRadius:10  }}
                source={{
                  uri: `${API_BASE_URL}/Images/Croissant_offre31.jpg`,
                    priority: FastImage.priority.high,
                }}
          resizeMode={FastImage.resizeMode.cover}
      /> */}
        <View style={styles.container_offre_antigaspi}>
            <View style={styles.text_offre31}>
            <Text style={styles.texte_offre31} >Profitez d'un produit</Text>
            <Text style={styles.texte_gratuit}>Gratuit</Text>
            </View>
            <View style={styles.pastille}>
            <Image
                source={require('../assets/offre31.jpg')}
                style={{ width:60, resizeMode:'contain'}}
            />
            
            </View>
        </View>
        
        </TouchableOpacity>

        {/* collaboration Les Halles Solanid */}
        <TouchableOpacity style={{marginRight:10}}  activeOpacity={0.8} onPress={handleHallesSolanid}>
        <Image
                // source={require('../assets/fond_halles.jpg')} 
                source={{uri:'https://cdn.lepaindujour.io/assets/fond_halles.jpg'}}
                style={{ width: 315, height: 200, resizeMode:'cover', borderTopLeftRadius:10, borderTopRightRadius:10 }}
                />
                {/* <FastImage
                style={{ width: 315, height: 200, borderTopLeftRadius:10, borderTopRightRadius:10  }}
                source={{
                  uri: `${API_BASE_URL}/Images/fond_halles.jpg`,
                    priority: FastImage.priority.high,
                }}
                resizeMode={FastImage.resizeMode.cover}
            /> */}
        <View style={styles.container_offre_antigaspi}>
            <View style={styles.text_offre31}>
            <Text style={styles.texte_offre31} >Un repas sain avec</Text>
            <Text style={styles.texte_gratuit}>Les Halles Solanid</Text>
            </View>
            <View style={styles.pastille}>
            <Image
                source={require('../assets/halles_solanid.jpg')}
                style={{ width:60, resizeMode:'contain'}}
            />
            
            
            </View>
        </View>
        
        </TouchableOpacity>

        {/* SUN */}
        <TouchableOpacity style={{marginRight:10}}  activeOpacity={0.8} onPress={() => handlePress({ title: popupData.title1, text: popupData.text1, image:popupData.image1 })}>
        <Image
                // source={require('../assets/fond_halles.jpg')} 
                source={{uri:'https://cdn.lepaindujour.io/assets/fond_halles.jpg'}}
                style={{ width: 315, height: 200, resizeMode:'cover', borderTopLeftRadius:10, borderTopRightRadius:10 }}
                />
        {/* <FastImage
                style={{ width: 315, height: 200, borderTopLeftRadius:10, borderTopRightRadius:10  }}
                source={{
                  uri: `${API_BASE_URL}/Images/fond_halles.jpg`,
                    priority: FastImage.priority.high,
                }}
                resizeMode={FastImage.resizeMode.cover}
            /> */}
        <View style={styles.container_offre_antigaspi}>
            <View style={styles.text_offre31}>
            <Text style={styles.texte_offre31} >  Découvrez</Text>
            <Text style={styles.texte_gratuit}>   les bénéfices</Text>
            </View>
            <View style={styles.pastille}>
            <Image
                source={require('../assets/start_union.jpg')}
                style={{ width:60, resizeMode:'contain'}}
            />
            
            </View>
        </View>
        
        </TouchableOpacity>

        {/* popup modale SUN*/}
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

        </ScrollView>
    </View>
  )
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