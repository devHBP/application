import React from 'react';
import { View, Text, Image, TouchableOpacity, FlatList } from 'react-native';
import { styles } from '../styles/home';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import PokeSaumon from '../assets/PokeSaumon.jpg'
import FormuleSandwich from '../assets/Formule36.jpg'
import FormuleSalade from '../assets/Formule25.jpg'
import FormulePizza from '../assets/Formule2.jpg'
import FormuleWrap from '../assets/Formule32.jpg'
import FormulePainBagnat from '../assets/Formule28.jpg'
import FormuleBurger from '../assets/Formule27.jpg'
import FormuleCroque from '../assets/Formule16.jpg'
import FormulePanini from '../assets/Formule55.jpg'
import FormuleQuiche from '../assets/Formule22.jpg'

const FormulesSalees = () => {
    const navigation = useNavigation();

    const data = [
        { name: 'Poke Bowl', imageUri: PokeSaumon, action: () => navigation.navigate('formulepoke'), description: "Un Poke Bowl, un dessert et une boisson" },
        { name: 'Sandwich', imageUri: FormuleSandwich, action: () => navigation.navigate('formulesandwich'), description: "Un sandwich, un dessert et une boisson" },
        { name: 'Salade', imageUri: FormuleSalade, action: () => navigation.navigate('formulesalade'), description: "Une salade, un dessert et une boisson" },
        { name: 'Pizza', imageUri: FormulePizza, action: () => navigation.navigate('formulepizza'), description: "Une pizza, un dessert et une boisson" },
        { name: 'Wrap', imageUri: FormuleWrap, action: () => navigation.navigate('formulewrap'), description: "Un wrap, un dessert et une boisson" },
        { name: 'Pain Bagnat', imageUri: FormulePainBagnat, action: () => navigation.navigate('formulepainbagnat'), description: "Un pain bagnat, un dessert et une boisson" },
        { name: 'Burger', imageUri: FormuleBurger, action: () => navigation.navigate('formuleburger'), description: "Un burger, un dessert et une boisson" },
        { name: 'Croque', imageUri: FormuleCroque, action: () => navigation.navigate('formulecroque'), description:"Un croque, un dessert et une boisson" },
        { name: 'Panini', imageUri: FormulePanini, action: () => navigation.navigate('formulepanini'), description:"Un panini, un dessert et une boisson" },
        { name: 'Quiche', imageUri: FormuleQuiche, action: () => navigation.navigate('formulequiche'), description:"Une quiche, un dessert et une boisson" },
        // { name: 'Quiche', imageUri: 'https://cdn.lepaindujour.io/assets/Formule22.jpg', action: () => navigation.navigate('formulequiche'), description:"Une quiche, un dessert et une boisson" },

    ];

    const renderItem = ({ item }) => (
        <TouchableOpacity style={{ marginRight: 10 }} onPress={item.action} activeOpacity={0.8}>
            <FastImage
                style={{ width: 315, height: 200 }}
                source={typeof item.imageUri === 'string' ? { uri: item.imageUri, priority: FastImage.priority.high } : item.imageUri}
                resizeMode={FastImage.resizeMode.cover}
            />
            {
                item.name === 'Poke Bowl' && <Image
                source={require('../assets/halles_solanid.jpg')}
                style={styles.pastilleSolanid}
            />
            }
            
            <View style={styles.cardTitle}>
                <Text style={styles.titleFormule}>Formule {item.name}</Text>
                <Text style={styles.textFormule}>{item.description}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={{ marginLeft: 30, marginVertical: 0 }}>
            <Text style={styles.text1formule}>Notre sélection de</Text>
            <Text style={styles.text2formule}>snacks <Text style={styles.text1formule}>et </Text>formules</Text>
            <FlatList
                data={data}
                horizontal
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{ marginVertical: 10 }}
            />
        </View>
    );
}

export default FormulesSalees;
