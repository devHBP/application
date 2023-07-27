import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect, useState} from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { style } from '../../styles/formules'; 
import axios from 'axios'
import { fonts, colors} from '../../styles/styles'
import { Button} from 'react-native-paper'
import FooterProfile from '../../components/FooterProfile';

const PageSandwich = ({navigation}) => {

    const [sandwichs, setSandwichs] = useState([]); // Ajoutez cette ligne
    const [selectedSandwich, setSelectedSandwich] = useState(null); // Nouvel état pour le sandwich sélectionné


    const handleBack = () => {
        navigation.navigate('home')
      }
      useEffect(() => {
        // Fonction pour récupérer les données de la base de données
        const fetchData = async () => {
          try {
          const response = await axios.get('http://127.0.0.1:8080/getAllProducts');
        
          const updatedProducts = response.data.map((product) => ({
            ...product,
            qty: 0, 
          }));
       
        // produits solanid
        const sandwichs = updatedProducts.filter(product => product.categorie === "sandwichs");
        //const sandwichsProduct = sandwichs.map(product => product.libelle);
        setSandwichs(sandwichs)
        console.log(sandwichs)
        
          
          } catch (error) {
            console.error('Une erreur s\'est produite, error products :', error);
          }
        };
        fetchData(); // Appel de la fonction fetchData lors du montage du composant
      }, []);

      const handleSandwich = (product) => {
        console.log('sandwich')
    }

  return (
    <View style={{marginBottom:150}} >
       <ScrollView>
        <View>
            <Image
                    source={require('../../assets/Formule36.jpg')} 
                    style={{ width: "100%", height: 330, resizeMode:'cover' }}
                />
             <Text style={styles.titleProduct}>Sandwich</Text>
            <TouchableOpacity  onPress={handleBack} activeOpacity={1} style={{position:'absolute', right:20, top:20, backgroundColor:'white', borderRadius:25}}>
                    <Icon name="keyboard-arrow-left" size={40} color="#000" style={{}}  />
                </TouchableOpacity>
        </View>
        

        {/* les options */}
        <View style={{marginHorizontal:30, marginVertical:20}}>
            <Text style={styles.titleOptions}>Les options</Text>
            <ScrollView horizontal={true} style={{marginVertical:20}}>
            {sandwichs.map((product, index) => (
                <TouchableOpacity key={index} >
                <View style={{marginHorizontal:20, flexDirection:'column', alignItems:'center'}} key={index}>
                    <Image
                    key={index}
                    source={{ uri: `http://127.0.0.1:8080/${product.image}` }}
                    style={styles.imageOptions}
                    />
                    <Text style={styles.libelle}>{product.libelle}</Text>
                    <TouchableOpacity
                        style={[
                          style.checkButton,
                          selectedSandwich?.productId === product.productId
                        ]}
                        onPress={() => setSelectedSandwich(product)}
                      >
                        {selectedSandwich?.productId === product.productId && <View style={style.checkInnerCircle} />}
                      </TouchableOpacity>
                    {/* rajouter increment / decrement */}
                </View>
                </TouchableOpacity>
            ))}
            </ScrollView >
           
        </View>


        {/* les ingredients */}
        <View style={{marginHorizontal:30}}>
            <Text style={styles.titleOptions}>Ingrédients</Text>
            {/* nom libelle du sandwich cliqué */}
            {selectedSandwich && selectedSandwich.ingredients && (
  <View style={styles.ingredients}>
    <Text style={styles.listeIngredients}>
      {selectedSandwich.ingredients}
    </Text>
  </View>
)}
            {/* {selectedSandwich && <Text>{selectedSandwich.description}</Text>} */}
            {
                selectedSandwich && 
                selectedSandwich.description && 
                selectedSandwich.description.toLowerCase().includes('halal') && 
                <View style={styles.description}>
                    <Image
                    source={require('../../assets/halal.png')}
                    style={{ width: 42, height: 42, resizeMode:'cover' }}
                    />
                    <Text>Ce produit est certifié Halal !</Text>
                </View>
            }
            {
                selectedSandwich && 
                selectedSandwich.description && 
                selectedSandwich.description.toLowerCase().includes('vegan') && 
                <View style={styles.description}>
                    <Image
                    source={require('../../assets/vegan.png')}
                    style={{ width: 42, height: 42, resizeMode:'cover' }}
                    />
                    <Text>Ce produit est vegan !</Text>
                </View>
            }
       
        </View>

        </ScrollView>

        <View style={{...style.menu, marginBottom:65}}>
                <View>
                <View style={style.bandeauFormule}>
                <Text style={{ fontWeight:'bold'}}>Prix de la formule</Text>
                {selectedSandwich && typeof prix === 'number' && <Text>{prix.toFixed(2)} €</Text>}
                </View>
                <View style={style.bandeauFormule}>
                    <View style={{flexDirection:'row'}}>
                    <Text>Avec</Text><Image source={require('../../assets/SUN.png')} style={{ width: 50, height: 20, resizeMode:'contain' }}/>
                    </View>
                {selectedSandwich && typeof prix === 'number' && <Text style={{color:colors.color2, fontWeight:'bold'}}>{(prix*0.8).toFixed(2)} €</Text>}
                </View>
                </View>
            <Button
                        style={style.btn}
                        textColor={'white'} 
                        disabled={!selectedSandwich}
                        >Choisir cette formule</Button>
            </View>
    <FooterProfile />
    </View>
  )
}

const styles = StyleSheet.create({
    titleProduct:{
        color:'white',
        fontFamily:fonts.font1,
        fontSize:24,
        position:'absolute',
        top:30,
        left:20
    },
    titleOptions:{
        fontSize:20,
        fontWeight:'600',
        fontFamily:fonts.font2
    },
    imageOptions:{
        width: 128, 
        height: 88, 
        borderRadius:6
    },
    libelle:{
        fontSize:12,
        fontFamily: fonts.font2,
        fontWeight: '400',
        textAlign:'center',
        paddingVertical:5
    },
    sousTexte:{
        // fontFamily:fonts.font2,
        fontSize:14,
        fontWeight:'400'
    },
    ingredients:{
        backgroundColor:'white',
        borderRadius:10,
        padding:10,
        marginVertical:10
    },
    listeIngredients:{
        fontSize:13,
        fontFamily:fonts.font2
    },
    description:{
        flexDirection:'row',
        alignItems:'center',
        gap:5,
        backgroundColor:'white',
        width:"85%",
        paddingHorizontal:19,
        paddingVertical:5,
        height:60,
        borderRadius:10,
        marginBottom:10
    }
  }); 

export default PageSandwich