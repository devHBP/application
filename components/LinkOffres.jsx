import { View, Text, TouchableOpacity, ScrollView , Modal, Image} from 'react-native'
import React, { useState, useEffect} from 'react'
import { styles} from '../styles/home'; 
import PopUp from '../components/PopUp';
import popupData from '../Datas/datas.json';
import axios from 'axios'
import { useNavigation } from '@react-navigation/native';

const LinkOffres = ({}) => {

    const navigation = useNavigation();

    const [solanidProductNames, setSolanidProductNames] = useState([]);
    const [offre31ProductNames, setoffre31ProductNames] = useState([])


    useEffect(() => {
        // Fonction pour récupérer les données de la base de données
        const fetchData = async () => {
          try {
          const response = await axios.get('http://127.0.0.1:8080/getAllProducts');
        
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
        fetchData(); // Appel de la fonction fetchData lors du montage du composant
      }, []);

    const [modalVisible, setModalVisible] = useState(false);
    const [currentPopupData, setCurrentPopupData] = useState({});

    const handlePress = (popupData) => {
        setCurrentPopupData(popupData);
        setModalVisible(true);
      }
      
      const handleClose = () => {
        setModalVisible(false);
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
     <ScrollView horizontal={true} style={{marginVertical:10, marginLeft:30}}>

        {/* anti gaspi */}
        {/* ajouter action onPress */}

        <TouchableOpacity style={{marginRight:10}}  activeOpacity={0.8}>
        <Image
                source={require('../assets/antigaspi.jpg')} 
                style={{ width: 315, height: 200, resizeMode:'cover', borderTopLeftRadius:10, borderTopRightRadius:10 }}
                />
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
                source={require('../assets/Croissant_offre31.jpg')} 
                style={{ width: 315, height: 200, resizeMode:'cover', borderTopLeftRadius:10, borderTopRightRadius:10 }}
                />
        <View style={styles.container_offre_antigaspi}>
            <View style={styles.text_offre31}>
            <Text style={styles.texte_offre31} >Profitez d'un produit</Text>
            <Text style={styles.texte_gratuit}>Gratuit</Text>
            </View>
            <View style={styles.pastille}>
            <Image
                source={require('../assets/offre31.png')}
                style={{ width:60, resizeMode:'contain'}}
            />
            
            </View>
        </View>
        
        </TouchableOpacity>

        {/* collaboration Les Halles Solanid */}
        <TouchableOpacity style={{marginRight:10}}  activeOpacity={0.8} onPress={handleHallesSolanid}>
        <Image
                source={require('../assets/fond_halles.jpg')} 
                style={{ width: 315, height: 200, resizeMode:'cover', borderTopLeftRadius:10, borderTopRightRadius:10 }}
                />
        <View style={styles.container_offre_antigaspi}>
            <View style={styles.text_offre31}>
            <Text style={styles.texte_offre31} >Un repas sain avec</Text>
            <Text style={styles.texte_gratuit}>Les Halles Solanid</Text>
            </View>
            <View style={styles.pastille}>
            <Image
                source={require('../assets/halles_solanid.png')}
                style={{ width:60, resizeMode:'contain'}}
            />
            
            </View>
        </View>
        
        </TouchableOpacity>

        {/* SUN */}
        <TouchableOpacity style={{marginRight:10}}  activeOpacity={0.8} onPress={() => handlePress({ title: popupData.title1, text: popupData.text1, image:popupData.image1 })}>
        <Image
                source={require('../assets/fond_halles.jpg')} 
                style={{ width: 315, height: 200, resizeMode:'cover', borderTopLeftRadius:10, borderTopRightRadius:10 }}
                />
        <View style={styles.container_offre_antigaspi}>
            <View style={styles.text_offre31}>
            <Text style={styles.texte_offre31} >  Découvrez</Text>
            <Text style={styles.texte_gratuit}>   les bénéfices</Text>
            </View>
            <View style={styles.pastille}>
            <Image
                source={require('../assets/start_union.png')}
                style={{ width:60, resizeMode:'contain'}}
            />
            
            </View>
        </View>
        
        </TouchableOpacity>

        {/* popup modale */}
        <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        >
            <PopUp onClose={handleClose} title={currentPopupData.title} text={currentPopupData.text} image={currentPopupData.image}/>

        </Modal>

        </ScrollView>
    </View>
  )
}

export default LinkOffres