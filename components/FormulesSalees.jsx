import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { styles} from '../styles/home'; 
import { useNavigation } from '@react-navigation/native';

const FormulesSalees = () => {

    const navigation = useNavigation();

    const openFormuleSandwich = () => {
        navigation.navigate('formulesandwich')
    }
    const openFormulePoke = () => {
        navigation.navigate('formulepoke')
    }
    const openFormuleSalade = () => {
        navigation.navigate('formulesalade')
    }
    const openFormulePizzas = () => {
        navigation.navigate('formulepizza')
    }
    const openFormuleWraps = () => {
        navigation.navigate('formulewrap')
    }
    const openFormulePainBagnat = () => {
        navigation.navigate('formulepainbagnat')
    }
    const openFormuleBurger = () => {
        navigation.navigate('formuleburger')
    }
    const openFormuleCroque = () => {
        navigation.navigate('formulecroque')
    }
    const openFormulePanini = () => {
        navigation.navigate('formulepanini')
    }
    const openFormuleQuiche = () => {
        navigation.navigate('formulequiche')
    }
  
  return (
    <View style={{marginLeft:30, marginVertical:30}}>
              <Text style={styles.text1formule}>Notre sélection de</Text>
              <Text style={styles.text2formule}>snack <Text style={styles.text1formule}>et </Text>formules</Text>
              
              <ScrollView horizontal={true} style={{marginVertical:10}}>

                {/* Poke Bowl */}
                <TouchableOpacity style={{marginRight:10}} onPress={openFormulePoke} activeOpacity={0.8}>
                    <Image
                            source={require('../assets/Formule26.jpg')} 
                            style={{ width: 315, height: 200, resizeMode:'center' }}
                            />
                   <Image
                            source={require('../assets/halles_solanid.png')} 
                            style={styles.pastilleSolanid}
                            />
                    <View style={styles.cardTitle}>
                        <Text style={styles.titleFormule}>Formule Poké Bowl</Text>
                        <Text style={styles.textFormule}>Une salade, un dessert et une boisson</Text>
                    </View>
                    
                </TouchableOpacity>

                {/* Sandwich */}
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

                {/* Salades*/}
                <TouchableOpacity style={{marginRight:10}} onPress={openFormuleSalade} activeOpacity={0.8}>
                    <Image
                            source={require('../assets/Formule25.jpg')} 
                            style={{ width: 315, height: 200, resizeMode:'center' }}
                            />
                    <View style={styles.cardTitle}>
                        <Text style={styles.titleFormule}>Formule Salades</Text>
                        <Text style={styles.textFormule}>Une salade, un dessert et une boisson</Text>
                    </View>
                </TouchableOpacity>
                    
                {/* Pizzas*/}
                <TouchableOpacity style={{marginRight:10}} onPress={openFormulePizzas} activeOpacity={0.8}>
                    <Image
                            source={require('../assets/Formule36.jpg')} 
                            style={{ width: 315, height: 200, resizeMode:'center' }}
                            />
                    <View style={styles.cardTitle}>
                        <Text style={styles.titleFormule}>Formule Pizzas</Text>
                        <Text style={styles.textFormule}>Une pizza, un dessert et une boisson</Text>
                    </View>
                </TouchableOpacity>

                {/* Wraps*/}
                <TouchableOpacity style={{marginRight:10}} onPress={openFormuleWraps} activeOpacity={0.8}>
                    <Image
                            source={require('../assets/Formule36.jpg')} 
                            style={{ width: 315, height: 200, resizeMode:'center' }}
                            />
                    <View style={styles.cardTitle}>
                        <Text style={styles.titleFormule}>Formule Wraps</Text>
                        <Text style={styles.textFormule}>Un wrap, un dessert et une boisson</Text>
                    </View>
                </TouchableOpacity>

                {/* Pains Bagnats*/}
                <TouchableOpacity style={{marginRight:10}} onPress={openFormulePainBagnat} activeOpacity={0.8}>
                    <Image
                            source={require('../assets/Formule36.jpg')} 
                            style={{ width: 315, height: 200, resizeMode:'center' }}
                            />
                    <View style={styles.cardTitle}>
                        <Text style={styles.titleFormule}>Formule Pains Bagnats</Text>
                        <Text style={styles.textFormule}>Un pain bagnat, un dessert et une boisson</Text>
                    </View>
                </TouchableOpacity>

                {/* Burgers*/}
                <TouchableOpacity style={{marginRight:10}} onPress={openFormuleBurger} activeOpacity={0.8}>
                    <Image
                            source={require('../assets/Formule36.jpg')} 
                            style={{ width: 315, height: 200, resizeMode:'center' }}
                            />
                    <View style={styles.cardTitle}>
                        <Text style={styles.titleFormule}>Formule Burgers</Text>
                        <Text style={styles.textFormule}>Un burger, un dessert et une boisson</Text>
                    </View>
                </TouchableOpacity>

                {/* croques*/}
                <TouchableOpacity style={{marginRight:10}} onPress={openFormuleCroque} activeOpacity={0.8}>
                    <Image
                            source={require('../assets/Formule36.jpg')} 
                            style={{ width: 315, height: 200, resizeMode:'center' }}
                            />
                    <View style={styles.cardTitle}>
                        <Text style={styles.titleFormule}>Formule Croques</Text>
                        <Text style={styles.textFormule}>Un croque, un dessert et une boisson</Text>
                    </View>
                </TouchableOpacity>

                {/* paninis*/}
                <TouchableOpacity style={{marginRight:10}} onPress={openFormulePanini} activeOpacity={0.8}>
                    <Image
                            source={require('../assets/Formule36.jpg')} 
                            style={{ width: 315, height: 200, resizeMode:'center' }}
                            />
                    <View style={styles.cardTitle}>
                        <Text style={styles.titleFormule}>Formule Paninis</Text>
                        <Text style={styles.textFormule}>Un panini, un dessert et une boisson</Text>
                    </View>
                </TouchableOpacity>

                {/* quiches */}
                <TouchableOpacity style={{marginRight:10}} onPress={openFormuleQuiche} activeOpacity={0.8}>
                    <Image
                            source={require('../assets/Formule36.jpg')} 
                            style={{ width: 315, height: 200, resizeMode:'center' }}
                            />
                    <View style={styles.cardTitle}>
                        <Text style={styles.titleFormule}>Formule Quiches</Text>
                        <Text style={styles.textFormule}>Un panini, un dessert et une boisson</Text>
                    </View>
                </TouchableOpacity>

              </ScrollView>
          </View>
  )
}

export default FormulesSalees