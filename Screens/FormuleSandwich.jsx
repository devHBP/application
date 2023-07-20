import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet, Switch } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { fonts, colors} from '../styles/styles'
import CheckBox from '@react-native-community/checkbox';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import { Button} from 'react-native-paper'
import { addToCart} from '../reducers/cartSlice';
import { useSelector, useDispatch } from 'react-redux'
import { getProductsByCategory, fetchOneProduct } from '../CallApi/api.js'

const FormuleSandwich = ({navigation}) => {

  const baseUrl = 'http://127.0.0.1:8080';

    const [products, setProducts] = useState([]);
    const [ desserts, setDesserts] = useState([]);
    const [dessertSwitch, setDessertSwitch] = useState(true);
    const [selectedSandwich, setSelectedSandwich] = useState(null);
    const [selectedDessert, setSelectedDessert] = useState(null);
    const [prix, setTotalPrice] = useState(0);
    const [productIds, setProductIds] = useState([]);
    const [qty, setQty] = useState(1); 


    const dispatch = useDispatch()
    const cart = useSelector((state) => state.cart.cart);
    console.log('cart', cart)

    const handleBack = () => {
        navigation.navigate('home')
      }

      useEffect(() => {
        const fetchProducts = async () => {
          try {
            const category = 'Sandwichs'; 
            const products = await getProductsByCategory(category);
            products.forEach((product) => {
                console.log(product.libelle, product.prix_unitaire);
              });
              setProducts(products)
          } catch (error) {
            console.error('Une erreur s\'est produite lors de la récupération des produits:', error);
          }
        };
    
        fetchProducts();

        const getOneProduct = async () => {
            try {
                const productIds = [10, 15]; // Remplacez par l'ID du produit souhaité
                const productPromises = productIds.map((productId) => fetchOneProduct(productId));
                const desserts = await Promise.all(productPromises);
                //console.log(desserts)
                    desserts.forEach((product) => {
                    console.log(product.libelle, product.prix_formule);
                    });
                setDesserts(desserts)
            } catch (error) {
              console.error('Une erreur s\'est produite lors de la récupération du produit:', error);
            }
          };
         getOneProduct()

      }, []);

    //   const handleSwitchToggle = () => {
    //     setDessertSwitch(!dessertSwitch);
    //     if (dessertSwitch) { // If the switch is being turned off
    //         setSelectedDessert(null); // Deselect the dessert
    //     }
    // };
      

    const handleSandwich = (product) => {
      // Check if the sandwich is already selected
      if (selectedSandwich?.productId === product.productId) {
        
          setSelectedSandwich(null); // Deselect the sandwich
          setProductIds(productIds.filter(productId => productId !== product.productId));

      } else {
          setSelectedSandwich(product); // Select the sandwich
          setProductIds([...productIds, product.productId]);

          //console.log('Selected Sandwich:', product.libelle);
          //console.log('Price:', product.prix_unitaire);
      }
  }
  const handleDessert = (product) => {
    if(!selectedSandwich ) {
      // If a sandwich is not selected, display a toast message
      Toast.show({
          type: 'error',
          text1: 'Attention',
          text2: 'Veuillez sélectionner un sandwich',
      });
      return;
  }
    // Check if the dessert is already selected
    if (selectedDessert?.productId === product.productId) {
        setSelectedDessert(null); // Deselect the dessert
        setProductIds(productIds.filter(productId => productId !== product.productId));

    } else {
        setSelectedDessert(product); // Select the dessert
        setProductIds([...productIds, product.productId]);

        //console.log('Selected Dessert:', product.libelle);
        //console.log('Price:', product.prix_formule);
    }
}


      useEffect(() => {
        calculateTotalPrice();
      }, [selectedSandwich, selectedDessert, dessertSwitch]);
      
      const calculateTotalPrice = () => {
        let prix = 0;
        
        if (selectedSandwich) {
          prix += parseFloat(selectedSandwich.prix_unitaire) || 0;
        }
      
        if (selectedDessert) {
          prix += parseFloat(selectedDessert.prix_formule) || 0;
        }
      
        setTotalPrice(prix);
    };

    const handleFormuleSelection = () => {
      const formule = {
        type: 'formule',
        option1: selectedSandwich,
        option2: selectedDessert,
        prix: prix,
        libelle:"Formule Sandwich",
        formuleImage: require('../assets/Formule36.jpg'),
        productIds: productIds,
        qty: qty,
      }
      console.log('formule', formule);
      dispatch(addToCart(formule));
      navigation.navigate('panier')
    }
    
      
  return (
    <View style={{flex:1}}>
      <ScrollView>
        <View>
            <Image
                    source={require('../assets/Formule36.jpg')} 
                    style={{ width: "100%", height: 330, resizeMode:'cover' }}
                />

            <TouchableOpacity  onPress={handleBack} activeOpacity={1} style={{position:'absolute', right:20, top:20, backgroundColor:'white', borderRadius:25}}>
                    <Icon name="keyboard-arrow-left" size={40} color="#000" style={{}}  />
                </TouchableOpacity>
        </View>
        <View style={{padding:30}}>
            <Text style={style.title}>Sandwich</Text>
            <Text>Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa sunt accusantium cum veniam sequi molestiae! Qui, perferendis ab magni enim veritatis
            oluptates, quis earum?</Text>
        </View>
        {/* choix sandwich */}
        <View>
            <Text style={style.choixTitle}>Votre choix de sandwich</Text>
            <ScrollView horizontal={true} style={style.scrollProduct}>
                {products.map((product) => (
                  <View style={{flexDirection:'column', justifyContent:'center'}}>
                    <TouchableOpacity key={product.productId} style={{gap:10,flexDirection:'column',  justifyContent:'center', alignItems:'center', margin:10}}>
                       <Image
                          source={{ uri: `${baseUrl}/${product.image}` }}
                          style={style.sandwichImage}
                        />
                      <Text>{product.libelle}</Text>
                        <CheckBox
                          disabled={false}
                          value={selectedSandwich?.productId === product.productId}
                          onValueChange={() => handleSandwich(product)}
                        />
                    </TouchableOpacity>
                  </View>
                    
                ))}
            </ScrollView>
        </View>
        {/* choix desserts */}
        <View>
          <View style={{...style.choixTitle,flexDirection:'row', gap:10, justifyContent:'center', alignItems:'center'}}>
              <Text style={style.choixTitle}>Les desserts  </Text>
              <Text style={{fontSize:12}}>(pour 2€ en +)</Text>
              {/* <Switch
                  value={dessertSwitch}
                  onValueChange={handleSwitchToggle}
                  thumbColor={dessertSwitch ? colors.color3 : '#f4f3f4'}
                  trackColor={{ false: 'red', true: colors.color9 }}
                /> */}
           
          </View>
            
            <ScrollView horizontal={true} style={style.scrollProduct}>
                {desserts.map((product) => (
                  <View key={product.productId} style={{flexDirection:'column', justifyContent:'center'}}>
                    <TouchableOpacity key={product.productId} style={{gap:10,flexDirection:'column',  justifyContent:'center', alignItems:'center', margin:10}}
                     disabled={!selectedSandwich || !dessertSwitch} >
                       <Image
                          source={{ uri: `${baseUrl}/${product.image}` }}
                          style={style.sandwichImage}
                        />
                      <Text>{product.libelle}</Text>
                        <CheckBox
                          value={selectedDessert?.productId === product.productId}
                          onValueChange={() => handleDessert(product)}
                         
                        />
                    </TouchableOpacity>
                  </View>
                    
                ))}
            </ScrollView>
        </View>
    </ScrollView>

    <View style={style.menu}>
      
      <View>
        <View>
          <View style={style.bandeauFormule}>
          <Text style={{ fontWeight:'bold'}}>Prix de la formule</Text>
          {selectedSandwich && typeof prix === 'number' && <Text>{prix.toFixed(2)} €</Text>}
          </View>
          <View style={style.bandeauFormule}>
            <View style={{flexDirection:'row'}}>
            <Text>Avec</Text><Image source={require('../assets/SUN.png')} style={{ width: 50, height: 20, resizeMode:'contain' }}/>
            </View>
          
          {selectedSandwich && typeof prix === 'number' && <Text style={{color:colors.color2, fontWeight:'bold'}}>{(prix*0.8).toFixed(2)} €</Text>}
          </View>
        </View>
      </View>
      <Button
                style={style.btn}
                textColor={'white'} 
                disabled={!selectedSandwich}
                onPress={handleFormuleSelection}
                >
                Choisir cette formule
            </Button>
    </View>
    </View> 
  )
}
const style = StyleSheet.create({
    title:{
        fontFamily:fonts.font1,
        fontSize:20,
        paddingBottom:10,
    },
    choixTitle:{
        textAlign:'center',
        fontSize:20,
        padding:10,
        backgroundColor:colors.color3,
        
    },
    scrollProduct:{
        height:200,
        paddingHorizontal:20
    },
    sandwichImage: {
      width: 150,
      height: 100,
      borderRadius: 50,
    },
    menu:{
      height:85,
      backgroundColor: '#fff',
      padding: 10,
      elevation: 2, // Add the elevation property for the shadow effect
      shadowColor: '#000', // Specify the shadow color
      shadowOpacity: 0.6, // Specify the shadow opacity
      shadowOffset: { width: 0, height: 1 }, // Specify the shadow offset
      shadowRadius: 2, 
      borderTopLeftRadius:10,
      borderTopRightRadius:10,
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'space-between'
    },
    disabledCheckBox: {
      opacity: 0.2, 
    },
    btn:{
      backgroundColor:colors.color2,
      height:40,
      width:150,
    },
    bandeauFormule:{
      flexDirection:'row', 
      width:180, 
      justifyContent:'space-between'
    }
   
  }
)
export default FormuleSandwich