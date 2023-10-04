import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import FastImage from 'react-native-fast-image';
import { styles } from '../styles/home'; 
import { useNavigation } from '@react-navigation/native';

const EnvieSalee = () => {
    const navigation = useNavigation();

    const data = [
        {
            title: "Sandwichs",
            onPress: () => navigation.navigate('sandwich'),
            image: require('../assets/sandwich.jpg'),
            style: { width: 200, height: 244 }
        },
        {
            title: ["Pizzas", "Wraps"],
            onPress: [() => navigation.navigate('pizza'), () => navigation.navigate('wrap')],
            image: [require('../assets/pizza.jpg'), require('../assets/wrap.jpg')],
            style: [{ width: 200, height: 80 }, { width: 200, height: 80 }]
        },
         {
            title: "Salades",
            onPress: () => navigation.navigate('salade'),
            image: require('../assets/salade.jpg'),
            style: { width: 200, height: 244 }
        },
        {
            title: ["Burgers", "Paninis"],
            onPress: [() => navigation.navigate('burger'), () => navigation.navigate('panini')],
            image: [require('../assets/burger.jpg'), require('../assets/panini.jpg')],
            style: [{ width: 200, height: 80 }, { width: 200, height: 80 }]
        },
         {
            title: "Pains Bagnats",
            onPress: () => navigation.navigate('painbagnat'),
            image: require('../assets/painbagnat.jpg'),
            style: { width: 200, height: 244 }
        },
        {
            title: ["Quiches", "Croques"],
            onPress: [() => navigation.navigate('quiche'), () => navigation.navigate('croque')],
            image: [require('../assets/quiche.jpg'), require('../assets/croque.jpg')],
            style: [{ width: 200, height: 80 }, { width: 200, height: 80 }]
        },
    ];

    return (
        <View style={{marginLeft:30, marginTop:20}}>
            <Text style={styles.text1formule}>Une petite envie <Text style={styles.text2formule}>Salée ? </Text></Text>

            <FlatList
                horizontal
                data={data}
                renderItem={({ item }) => {
                    if (Array.isArray(item.title)) {
                        return (
                            <View style={{ flexDirection: 'column', marginRight: 10 }}>
                                {item.title.map((title, index) => (
                                    <TouchableOpacity key={index} activeOpacity={0.8} onPress={item.onPress[index]} style={{marginBottom: 15}}>
                                        <FastImage
                                            source={item.image[index]}
                                            style={item.style[index]}
                                            resizeMode={FastImage.resizeMode.cover}
                                        />
                                        <View style={styles.cardTitle}>
                                            <Text style={styles.titleFormule_envie}>{title}</Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        );
                    } else {
                        return (
                            <TouchableOpacity style={{marginRight:10}} activeOpacity={0.8} onPress={item.onPress}>
                                <FastImage
                                    source={item.image}
                                    style={item.style}
                                    resizeMode={FastImage.resizeMode.cover}
                                />
                                <View style={styles.cardTitle}>
                                    <Text style={styles.titleFormule_envie}>{item.title}</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    }
                }}
                keyExtractor={(item, index) => index.toString()}
            />

        </View>
    );
}

export default EnvieSalee;