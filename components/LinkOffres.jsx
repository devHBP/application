import { View, Text, TouchableOpacity, ScrollView , Modal, Image} from 'react-native'
import React, { useState} from 'react'
import { styles} from '../styles/home'; 
import PopUp from '../components/PopUp';
import popupData from '../Datas/datas.json';

const LinkOffres = () => {

    const [modalVisible, setModalVisible] = useState(false);
    const [currentPopupData, setCurrentPopupData] = useState({});

    const handlePress = (popupData) => {
        setCurrentPopupData(popupData);
        setModalVisible(true);
      }
      
      const handleClose = () => {
        setModalVisible(false);
      }
  return (
    <View >
     <ScrollView horizontal={true} style={{marginVertical:10, marginLeft:30}}>

        {/* anti gaspi */}
        {/* ajouter action onPress */}

        <TouchableOpacity style={{marginRight:10}}  activeOpacity={0.8}>
        <Image
                source={require('../assets/Formule36.jpg')} 
                style={{ width: 315, height: 200, resizeMode:'center', borderTopLeftRadius:10, borderTopRightRadius:10 }}
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
        <TouchableOpacity style={{marginRight:10}}  activeOpacity={0.8} onPress={() => handlePress({ title: popupData.title1, text: popupData.text1, image:popupData.image1 })}>
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
        <TouchableOpacity style={{marginRight:10}}  activeOpacity={0.8} onPress={() => handlePress({ title: popupData.title2, text: popupData.text2, image:popupData.image2 })}>
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
        <TouchableOpacity style={{marginRight:10}}  activeOpacity={0.8}>
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