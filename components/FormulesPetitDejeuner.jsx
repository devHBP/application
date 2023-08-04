import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { styles} from '../styles/home'; 
import { useNavigation } from '@react-navigation/native';

const FormulesSalees = () => {

    const navigation = useNavigation();

    const openFormuleArtisan = () => {
        navigation.navigate('artisan')
    }
    const openFormulePetitDejeuner = () => {
        navigation.navigate('petitdej')
    }
    const openFormulePetitDejeunerGourmand = () => {
        navigation.navigate('petitdejgourmand')
    }
  
  return (
    <View style={{marginLeft:30, marginVertical:30}}>

        <View style={{flexDirection:'row', alignItems:'center'}}>
        <Text style={styles.text1formule}>Les formules du</Text>
              <Text style={styles.text2formule}> petit dejeuner</Text>
        </View>
              
              <ScrollView horizontal={true} style={{marginVertical:10}}>

                {/* artisan */}
                <TouchableOpacity style={{marginRight:10}} onPress={openFormuleArtisan} activeOpacity={0.8}>
                    <Image
                            source={require('../assets/Formuleartisan.jpg')} 
                            style={{ width: 315, height: 200, resizeMode:'center' }}
                            />
                    <View style={styles.cardTitle}>
                        <Text style={styles.titleFormule}>Formule Artisan</Text>
                        <Text style={styles.textFormule}>Un café et un en-cas de 6h à 8h</Text>
                    </View>
                </TouchableOpacity>

                {/* petit dej */}
                <TouchableOpacity style={{marginRight:10}} onPress={openFormulePetitDejeuner} activeOpacity={0.8}>
                    <Image
                            source={require('../assets/FormulePetitdejeuner.jpg')} 
                            style={{ width: 315, height: 200, resizeMode:'center' }}
                            />
                    <View style={styles.cardTitle}>
                        <Text style={styles.titleFormule}>Petit Déjeuner </Text>
                        <Text style={styles.textFormule}>Une viennoiserie, un jus d'orange et un café</Text>
                    </View>
                </TouchableOpacity>

                {/* petit dej gourmand*/}
                <TouchableOpacity style={{marginRight:10}} onPress={openFormulePetitDejeunerGourmand} activeOpacity={0.8}>
                    <Image
                            source={require('../assets/FormulepetitdejeunerGourmand.jpg')} 
                            style={{ width: 315, height: 200, resizeMode:'center' }}
                            />
                    <View style={styles.cardTitle}>
                        <Text style={styles.titleFormule}>Petit déjeuner gourmand</Text>
                        <Text style={styles.textFormule} numberOfLines={2}>Une viennoiserie, un jus d'orange et une boisson gourmande</Text>
                    </View>
                </TouchableOpacity>
                    
                
              </ScrollView>
          </View>
  )
}

export default FormulesSalees