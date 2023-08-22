import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet, } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { fonts, colors} from '../../styles/styles'
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import { Button, } from 'react-native-paper'
import { addToCart} from '../../reducers/cartSlice';
import { useSelector, useDispatch } from 'react-redux'
import { getProductsByCategory, fetchOneProduct } from '../../CallApi/api.js'
import { style } from '../../styles/formules'; 
import FooterProfile from '../../components/FooterProfile';


//call API
import { checkStockForSingleProduct } from '../../CallApi/api.js';
//fonctions
import { checkProductAvailability } from '../../Fonctions/fonctions';
import ArrowLeft from '../../SVG/ArrowLeft';
import ProductCard from '../../components/ProductCard';

const FormulePoke = ({navigation}) => {

  let API_BASE_URL = 'http://127.0.0.1:8080';

  if (Platform.OS === 'android') {
    if (__DEV__) {
        API_BASE_URL = 'http://10.0.2.2:8080'; // Adresse pour l'émulateur Android en mode développement
    } 
}

    const [ products, setProducts] = useState([]);
    const [ desserts, setDesserts] = useState([]);
    const [ boissons, setBoissons] = useState([]);
    const [dessertSwitch, setDessertSwitch] = useState(true);
    const [selectedSandwich, setSelectedSandwich] = useState(null);
    const [selectedDessert, setSelectedDessert] = useState(null);
    const [selectedBoisson, setSelectedBoisson] = useState(null);
    const [prix, setTotalPrice] = useState(0);
    const [productIds, setProductIds] = useState([]);
    //const [qty, setQty] = useState(1); 


    const dispatch = useDispatch()
    const cart = useSelector((state) => state.cart.cart);
    //console.log('cart', cart)
    const handleBack = () => {
        navigation.navigate('home')
      }

      useEffect(() => {
        //les pokebowl - categorie
        const fetchProducts = async () => {
          try {
            const category = 'Poke Bowls'; 
            const products = await getProductsByCategory(category);
            // products.forEach((product) => {
            //     console.log(product.libelle, product.prix_unitaire);
            //   });
              setProducts(products)
          } catch (error) {
            console.error('Une erreur s\'est produite lors de la récupération des produits:', error);
          }
        };
    
        fetchProducts();

        //les desserts - par id
        const getOneProduct = async () => {
            try {
                const productIds = [88, 89];
                const productPromises = productIds.map((productId) => fetchOneProduct(productId));
                const desserts = await Promise.all(productPromises);
                //console.log(desserts)
                    // desserts.forEach((product) => {
                    // console.log(product.libelle, product.prix_formule);
                    // });
                setDesserts(desserts)
            } catch (error) {
              console.error('Une erreur s\'est produite lors de la récupération du produit:', error);
            }
          };
         getOneProduct()

         //les boisssons - par catégories
      //    const fetchBoissons = async () => {
      //     try {
      //       const category = 'Boissons'; 
      //       const boissons = await getProductsByCategory(category);
      //       boissons.forEach((boisson) => {
      //           console.log(boisson.libelle, boisson.prix_formule);
      //         });
      //         setBoissons(boissons)
      //     } catch (error) {
      //       console.error('Une erreur s\'est produite lors de la récupération des produits:', error);
      //     }
      //   };
      //  fetchBoissons()

       //les boissons - par id
       const fetchBoissons = async () => {
        try {
            const productIds = [90]; 
            const productPromises = productIds.map((productId) => fetchOneProduct(productId));
            const boissons = await Promise.all(productPromises);
            //console.log(desserts)
                // boissons.forEach((boisson) => {
                // console.log(boisson.libelle, boisson.prix_formule);
                // });
                setBoissons(boissons)
        } catch (error) {
          console.error('Une erreur s\'est produite lors de la récupération du produit:', error);
        }
      };
      fetchBoissons()
        
      }, []);


    const handleSandwich = async (product) => {
   
     const isAvailable = await checkProductAvailability(product, checkStockForSingleProduct, cart);
      //pas de selection possible si pas de stock
     if (!isAvailable){
       return
     }
        if (selectedSandwich?.productId === product.productId) {
          setSelectedSandwich(null); 
          setProductIds(productIds.filter(productId => productId !== product.productId));
      } else {
          setSelectedSandwich(product); 
          setProductIds([...productIds, product.productId]);
      }
   
  }
  const handleDessert = async (product) => {
  
    const isAvailable = await checkProductAvailability(product, checkStockForSingleProduct, cart);
    //pas de selection possible si pas de stock
    if (!isAvailable){
      return
    }

    if(!selectedSandwich ) {
      Toast.show({
          type: 'error',
          text1: 'Attention',
          text2: 'Veuillez sélectionner un Poke Bowl',
      });
      return;
    }
    if (selectedDessert?.productId === product.productId) {
        setSelectedDessert(null); 
        setProductIds(productIds.filter(productId => productId !== product.productId));
    } else {
        setSelectedDessert(product); 
        setProductIds([...productIds, product.productId]);
    }
  }

  const handleBoisson = async (product) => {

    const isAvailable = await checkProductAvailability(product, checkStockForSingleProduct, cart);
    //pas de selection possible si pas de stock
    if (!isAvailable){
      return
    }

    if(!selectedSandwich ) {
      Toast.show({
          type: 'error',
          text1: 'Attention',
          text2: 'Veuillez sélectionner un Poke Bowl',
      });
      return;
    }
    if (selectedBoisson?.productId === product.productId) {
        setSelectedBoisson(null); 
        setProductIds(productIds.filter(productId => productId !== product.productId));
    } else {
        setSelectedBoisson(product); 
        setProductIds([...productIds, product.productId]);
        console.log('Selected Dessert:', product.libelle);
        console.log('Price:', product.prix_formule);
    }
  }

      useEffect(() => {
        calculateTotalPrice();
      }, [selectedSandwich, selectedDessert,selectedBoisson, dessertSwitch]);
      
      const calculateTotalPrice = () => {
        let prix = 0;
        
        if (selectedSandwich) {
          prix += parseFloat(selectedSandwich.prix_unitaire) || 0;
        }
      
        if (selectedDessert) {
          prix += parseFloat(selectedDessert.prix_formule) || 0;
        }

        if (selectedBoisson) {
          prix += parseFloat(selectedBoisson.prix_formule) || 0;
        }
      
        setTotalPrice(prix);
    };

    const handleFormuleSelection = () => {
      const formule = {
        id: `formule-${Date.now()}`,
        type: 'formule',
        option1: selectedSandwich,
        option2: selectedDessert ? selectedDessert : null,
        option3:selectedBoisson ? selectedBoisson : null,
        prix: prix,
        libelle:"Formule Poke Bowl",
        formuleImage: require('../../assets/Formule26.jpg'),
        productIds: productIds,
        qty: 1,
      }
      console.log('formule', formule);
      console.log('option1', formule.option1.libelle)
      console.log('option2', formule.option2?.libelle)
      console.log('option3', formule.option3?.libelle)
      dispatch(addToCart(formule));
      navigation.navigate('panier')
    }
      
  return (
    <View style={{flex:1}}>
      <ScrollView>
        <View>
            <Image
                    source={require('../../assets/Formule26.jpg')} 
                    style={{ width: "100%", height: 330, resizeMode:'cover' }}
                />

                  <View style={{flexDirection:'row',justifyContent:'space-between', width:"100%" , alignItems:'center', position:'absolute', top:30, paddingHorizontal:30}}>
                    <Text style={style.titleProduct}>Poke Bowls</Text>
                    <TouchableOpacity  onPress={handleBack} activeOpacity={1} style={{ backgroundColor:'black', borderRadius:25}}>
                      <ArrowLeft fill="white"/>
                    </TouchableOpacity>
                  </View>  
               
        </View>
        <View style={{padding:30}}>
            <Text style={style.title}>Poke Bowl</Text>
            <Text>Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa sunt accusantium cum veniam sequi molestiae! Qui, perferendis ab magni enim veritatis
            oluptates, quis earum?</Text>
        </View>
        {/* choix sandwich */}
        <View>
            <Text style={style.choixTitle}>Votre choix de Poke Bowl</Text>
            <ScrollView horizontal={true} style={style.scrollProduct}>
                {products.map((product, index) => (
                  <View key={product.productId} style={{flexDirection:'column', justifyContent:'center'}}>
                    <TouchableOpacity  style={{gap:10,flexDirection:'column',  justifyContent:'center', alignItems:'center', margin:10}} key={index}>
                       {/* <Image
                          source={{ uri: `${API_BASE_URL}/${product.image}` }}
                          style={style.sandwichImage}
                        />
                      <Text>{product.libelle}</Text> */}

                      <View style={{width:180, marginLeft:10}} key={index}>
                      <ProductCard
                        libelle={product.libelle}
                        key={product.productId}
                        id={product.productId}
                        index={index}
                        image={product.image}
                        prix={product.prix_unitaire}
                        prixSUN={product.prix_remise_collaborateur}
                        qty={product.qty}
                        stock={product.stock}
                        offre={product.offre}
                        showButtons={false} 

                      />
                      </View>
                        {/* <CheckBox
                          disabled={false}
                          value={selectedSandwich?.productId === product.productId}
                          onValueChange={() => handleSandwich(product)}
                        /> */}
                      <TouchableOpacity
                        style={[
                          style.checkButton,
                          selectedSandwich?.productId === product.productId
                        ]}
                        onPress={() => handleSandwich(product)}
                      >
                        {selectedSandwich?.productId === product.productId && <View style={style.checkInnerCircle} />}
                      </TouchableOpacity>
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
                {desserts.map((product, index) => (
                  <View key={product.productId} style={{flexDirection:'column', justifyContent:'center'}}>
                    <TouchableOpacity  style={{gap:10,flexDirection:'column',  justifyContent:'center', alignItems:'center', margin:10}}
                     disabled={!selectedSandwich || !dessertSwitch} >
                       {/* <Image
                          source={{ uri: `${API_BASE_URL}/${product.image}` }}
                          style={style.sandwichImage}
                        />
                      <Text>{product.libelle}</Text> */}
                      <View style={{width:180, marginLeft:10}} key={index}>
                      <ProductCard
                        libelle={product.libelle}
                        key={product.productId}
                        id={product.productId}
                        index={index}
                        image={product.image}
                        prix={product.prix_unitaire}
                        prixSUN={product.prix_remise_collaborateur}
                        qty={product.qty}
                        stock={product.stock}
                        offre={product.offre}
                        showButtons={false} 
                      />
                      </View>
                        {/* <CheckBox
                          value={selectedDessert?.productId === product.productId}
                          onValueChange={() => handleDessert(product)}
                        /> */}
                         <TouchableOpacity
                        style={[
                          style.checkButton,
                          selectedDessert?.productId === product.productId
                        ]}
                        onPress={() => handleDessert(product)}
                      >
                        {selectedDessert?.productId === product.productId && <View style={style.checkInnerCircle} />}
                      </TouchableOpacity>
                    </TouchableOpacity>
                  </View>     
                ))}
            </ScrollView>
        </View>

        {/* choix boissons */}
        <View>
          <View style={{...style.choixTitle,flexDirection:'row', gap:10, justifyContent:'center', alignItems:'center'}}>
              <Text style={style.choixTitle}>Les boissons  </Text>
              <Text style={{fontSize:12}}>(pour 2€ en +)</Text>
          </View>
            <ScrollView horizontal={true} style={style.scrollProduct}>
                {boissons.map((product, index) => (
                  <View key={product.productId} style={{flexDirection:'column', justifyContent:'center'}}>
                    <TouchableOpacity  style={{gap:10,flexDirection:'column',  justifyContent:'center', alignItems:'center', margin:10}}
                     disabled={!selectedSandwich || !dessertSwitch} >
                       {/* <Image
                          source={{ uri: `${API_BASE_URL}/${product.image}` }}
                          style={style.sandwichImage}
                        />
                      <Text>{product.libelle}</Text> */}
                      <View style={{width:180, marginLeft:10}} key={index}>
                      <ProductCard
                        libelle={product.libelle}
                        key={product.productId}
                        id={product.productId}
                        index={index}
                        image={product.image}
                        prix={product.prix_unitaire}
                        prixSUN={product.prix_remise_collaborateur}
                        qty={product.qty}
                        stock={product.stock}
                        offre={product.offre}
                        showButtons={false} 
                      />
                      </View>
                      <TouchableOpacity
                        style={[
                          style.checkButton,
                          selectedBoisson?.productId === product.productId
                        ]}
                        onPress={() => handleBoisson(product)}
                      >
                        {selectedBoisson?.productId === product.productId && <View style={style.checkInnerCircle} />}
                      </TouchableOpacity>
                    </TouchableOpacity>
                  </View>     
                ))}
            </ScrollView>
        </View>

    </ScrollView>

    <View style={style.menu}>
        <View>
          <View style={style.bandeauFormule}>
          <Text style={{ fontWeight:"bold"}}>Prix de la formule</Text>
          {selectedSandwich && typeof prix === 'number' && <Text>{prix.toFixed(2)} €</Text>}
          </View>
          <View style={style.bandeauFormule}>
            <View style={{flexDirection:'row'}}>
            <Text>Avec</Text><Image source={require('../../assets/SUN.png')} style={{ width: 50, height: 20, resizeMode:'contain' }}/>
            </View>
          {selectedSandwich && typeof prix === 'number' && <Text style={{color:colors.color2, fontWeight:"bold"}}>{(prix*0.8).toFixed(2)} €</Text>}
          </View>
        </View>
      <Button
                style={style.btn}
                textColor={'white'} 
                disabled={!selectedSandwich}
                onPress={handleFormuleSelection}
                >Choisir cette formule</Button>
    </View>
    <FooterProfile />
    </View> 
  )
}

export default FormulePoke