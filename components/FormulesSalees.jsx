import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { styles} from '../styles/home'; 

const FormulesSalees = () => {

    //open Formule Sandwich
const openFormuleSandwich = () => {
    navigation.navigate('formulesandwich')
  }
  
  return (
    <View style={{marginLeft:30, marginVertical:30}}>
              <Text style={styles.text1formule}>Notre sélection de</Text>
              <Text style={styles.text2formule}>snack <Text style={styles.text1formule}>et </Text>formules</Text>
              
              <ScrollView horizontal={true} style={{marginVertical:10}}>

              <TouchableOpacity style={{marginRight:10}} onPress={openFormuleSandwich} activeOpacity={0.8}>
                  <Image
                          source={require('../assets/Formule36.jpg')} 
                          style={{ width: 315, height: 200, resizeMode:'center' }}
                          />
                  <View style={styles.cardTitle}>
                     <Text style={styles.titleFormule}>Formule Poké Bowl</Text>
                     <Text style={styles.textFormule}>Une salade, un dessert et une boisson</Text>
                  </View>
             </TouchableOpacity>

             <TouchableOpacity style={{marginRight:10}} onPress={openFormuleSandwich} activeOpacity={0.8}>
                  <Image
                          source={require('../assets/Formule36.jpg')} 
                          style={{ width: 315, height: 200, resizeMode:'center' }}
                          />
                  <View style={styles.cardTitle}>
                     <Text style={styles.titleFormule}>Formule Sandwichs</Text>
                     <Text style={styles.textFormule}>Un sandwich, un dessert et une boisson</Text>
                  </View>
             </TouchableOpacity>
                

              </ScrollView>
          </View>
  )
}

export default FormulesSalees