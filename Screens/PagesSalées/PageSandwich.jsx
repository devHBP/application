import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { style } from '../../styles/formules'; 

const PageSandwich = ({navigation}) => {

    const handleBack = () => {
        navigation.navigate('home')
      }

  return (
    <View>
       <ScrollView>
        <View>
            <Image
                    source={require('../../assets/Formule36.jpg')} 
                    style={{ width: "100%", height: 330, resizeMode:'cover' }}
                />

            <TouchableOpacity  onPress={handleBack} activeOpacity={1} style={{position:'absolute', right:20, top:20, backgroundColor:'white', borderRadius:25}}>
                    <Icon name="keyboard-arrow-left" size={40} color="#000" style={{}}  />
                </TouchableOpacity>
        </View>
        <View style={{padding:30}}>
            <Text style={style.title}>Sandwich</Text>
            <Text style={style.texte_page_produit}>Lorem ipsum dolor sit amet consectetur adipisicing elit.
                 Sed vitae necessitatibus ratione cum magnam. Dolor perferendis aliquam saepe ipsum maiores, 
                 esse accusamus dicta corrupti dolore totam quaerat labore reprehenderit laborum!</Text>
        </View>
        </ScrollView>
    </View>
  )
}

export default PageSandwich