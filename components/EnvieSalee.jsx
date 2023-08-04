import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { styles} from '../styles/home'; 
import { useNavigation } from '@react-navigation/native';

const EnvieSalee = () => {

    const navigation = useNavigation();

    const openPageSandwich = () => {
        navigation.navigate('sandwich')
    }
    const openPageWrap = () => {
        navigation.navigate('wrap')
    }
    const openPageSalade = () => {
        navigation.navigate('salade')
    }
    const openPageBurger = () => {
        navigation.navigate('burger')
    }
    const openPagePanini = () => {
        navigation.navigate('panini')
    }
    const openPagePainBagnat = () => {
        navigation.navigate('painbagnat')
    }
    const openPageQuiche = () => {
        navigation.navigate('quiche')
    }
    const openPageCroque = () => {
        navigation.navigate('croque')
    }
  return (
    <View style={{marginLeft:30}}>
        <Text style={styles.text1formule}>Une petite envie <Text style={styles.text2formule}>Salée ? </Text></Text>
        
        <ScrollView horizontal={true} style={{marginVertical:20}}>

            {/* Sandwichs */}
            <TouchableOpacity style={{marginRight:10}}  activeOpacity={0.8} onPress={openPageSandwich}>
                    <Image
                            source={require('../assets/Formule36.jpg')} 
                            style={{ width: 200, height: 234, resizeMode:'cover' }}
                            />
                    <View style={styles.cardTitle}>
                        <Text style={styles.titleFormule_envie}>Sandwichs</Text>
                    </View>
            </TouchableOpacity>

            {/* Wraps et pizza */}
            <TouchableOpacity style={{marginRight:10, flexDirection:'column', gap:12}}  activeOpacity={0.8}>
                
                <TouchableOpacity>
                    <Image
                        source={require('../assets/Formule2.jpg')} 
                        style={{ width: 200, height: 85, resizeMode:'cover' }}
                    />
                    <View style={styles.cardTitle}>
                        <Text style={styles.titleFormule_envie}>Pizzas</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={openPageWrap}>
                    <Image
                        source={require('../assets/Formule32.jpg')} 
                        style={{ width: 200, height: 80, resizeMode:'cover' }}
                    />
                    <View style={styles.cardTitle}>
                        <Text style={styles.titleFormule_envie}>Wraps</Text>
                    </View>
                </TouchableOpacity>
                    
            </TouchableOpacity>

            {/* Salades */}
            <TouchableOpacity style={{marginRight:10}}  activeOpacity={0.8} onPress={openPageSalade}>
                    <Image
                            source={require('../assets/Formule26.jpg')} 
                            style={{ width: 200, height: 234, resizeMode:'cover' }}
                            />
                    <View style={styles.cardTitle}>
                        <Text style={styles.titleFormule_envie}>Salades</Text>
                    </View>
            </TouchableOpacity>

            {/* Burgers et Paninis */}    
            <TouchableOpacity style={{marginRight:10, flexDirection:'column', gap:12}}>            
                <TouchableOpacity style={{marginRight:10}}  activeOpacity={0.8} onPress={openPageBurger}>
                    <Image
                        source={require('../assets/Formule27.jpg')} 
                        style={{ width: 200, height: 85, resizeMode:'cover' }}
                    />
                    <View style={styles.cardTitle}>
                        <Text style={styles.titleFormule_envie}>Burgers</Text>
                    </View>
                </TouchableOpacity>
               

                <TouchableOpacity style={{marginRight:10}}  activeOpacity={0.8} onPress={openPagePanini}>
                    <Image
                        source={require('../assets/Formule55.jpg')} 
                        style={{ width: 200, height: 80, resizeMode:'cover' }}
                    />
                    <View style={styles.cardTitle}>
                        <Text style={styles.titleFormule_envie}>Paninis</Text>
                    </View>
                </TouchableOpacity>
            </TouchableOpacity>    

            {/* Pains bagnats */}
            <TouchableOpacity style={{marginRight:10}}  activeOpacity={0.8} onPress={openPagePainBagnat}>
                    <Image
                            source={require('../assets/Formule28.jpg')} 
                            style={{ width: 200, height: 234, resizeMode:'cover' }}
                            />
                    <View style={styles.cardTitle}>
                        <Text style={styles.titleFormule_envie}>Pains Bagnats</Text>
                    </View>
            </TouchableOpacity>

            {/* Quiches et Croques */}
            <TouchableOpacity style={{marginRight:10, flexDirection:'column', gap:12}}  activeOpacity={0.8}>
                
                <TouchableOpacity style={{marginRight:10}}  activeOpacity={0.8} onPress={openPageQuiche}>
                    <Image
                        source={require('../assets/Formule22.jpg')} 
                        style={{ width: 200, height: 85, resizeMode:'cover' }}
                    />
                    <View style={styles.cardTitle}>
                        <Text style={styles.titleFormule_envie}>Quiches</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{marginRight:10}}  activeOpacity={0.8} onPress={openPageCroque}>
                    <Image
                        source={require('../assets/Formule16.jpg')} 
                        style={{ width: 200, height: 80, resizeMode:'cover' }}
                    />
                    <View style={styles.cardTitle}>
                        <Text style={styles.titleFormule_envie}>Croques</Text>
                    </View>
                </TouchableOpacity>
                    
            </TouchableOpacity>

        </ScrollView>

    </View>
  )
}

export default EnvieSalee