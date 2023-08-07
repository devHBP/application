import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect, useState} from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { style } from '../../styles/formules'; 
import axios from 'axios'
import { fonts, colors} from '../../styles/styles'
import { Button} from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux';
import FooterProfile from '../../components/FooterProfile';
import { addToCart, decrementOrRemoveFromCart } from '../../reducers/cartSlice';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
//call API
import { checkStockForSingleProduct } from '../../CallApi/api.js';


const PageQuiche = ({navigation}) => {

    const [products, setProducts] = useState([]); 
    const [selectedSandwich, setSelectedSandwich] = useState(null); 
    const [stock, setStock] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [productCount, setProductCount] = useState(0);

    const dispatch = useDispatch();

    const cart = useSelector(state => state.cart.cart);
   
    
    const getProductQtyInCart = (productId) => {
      const productInCart = cart.find(item => item.productId === productId);
      return productInCart ? productInCart.qty : 0;
    };

    useEffect(() => {
      const totalPrice = products.reduce((acc, product) => acc + (product.qty * product.prix_unitaire), 0);
      setTotalPrice(totalPrice);
    }, [products]);

    useEffect(() => {
      const fetchStock = async () => {
        const updatedStock = []; 

        for (const product of products) {

          //sous forme d'un seul tableau
          //[{"productId": 45, "quantite": 50}, {"productId": 46, "quantite": 30}, {"productId": 47, "quantite": 30}, {"productId": 48, "quantite": 30}, 
          //{"productId": 49, "quantite": 30}, {"productId": 50, "quantite": 30}, {"productId": 51, "quantite": 30}]
          const [productStock] = await checkStockForSingleProduct(product.productId); 
          updatedStock.push(productStock); 
        }

        setStock(updatedStock);
      };

      if (products.length > 0) {
        fetchStock();
      }
    }, [products]);


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
       
      
        const products = updatedProducts.filter(product => product.categorie === "Quiches");
        setProducts(products)
          
          } catch (error) {
            console.error('Une erreur s\'est produite, error products :', error);
          }
        };
        fetchData(); 
      }, []);
    
    //increment
    const incrementHandler = async (productId) => {
      const product = products.find(p => p.productId === productId);
      setProductCount(productCount + 1);

      if (!product) {
        console.error(`Product with ID ${productId} not found.`);
        return;
      }

      const { libelle, image, prix_unitaire, offre} = product; // Déstructurez le produit
      //console.log(product.productId);

      const productStock = stock.find(item => item.productId === product.productId);
      
      // Obtenir la quantité en stock pour ce produit
      const productQuantity = productStock ? productStock.quantite : 0;
      console.log(`The quantity in stock for product ${productId} is ${productQuantity}`);

      //si plus de stock
      if(productQuantity === 0){
        return Toast.show({
          type: 'error',
          text1: `Victime de son succès`,
          text2: 'Plus de stock disponible' 
        });
      }
      try{
        const stockAvailable = await checkStockForSingleProduct(product.productId);
        console.log(stockAvailable)

        const remainingStock = stockAvailable[0].quantite - product.qty;
        console.log(remainingStock)

        if (stockAvailable.length > 0 && remainingStock > 0) {
          console.log(`Ajout au panier: ${product.libelle}, prix: ${product.prix_unitaire}, quantité: 1`);
          dispatch(addToCart({ productId: product.productId, libelle: product.libelle, image: product.image, prix_unitaire: product.prix_unitaire, qty: 1 , offre: product.offre}));
  
          setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.productId === productId ? { ...product, qty: product.qty + 1 } : product
          )
        );
          if (product.offre && product.offre.startsWith('offre31')) {
            const updatedCart = [...cart, { productId: product.productId, libelle: product.libelle, image: product.image, prix_unitaire: product.prix, qty: 1 , offre: product.offre}];
            const sameOfferProducts = updatedCart.filter((item) => item.offre === product.offre);
            const totalQuantity = sameOfferProducts.reduce((total, product) => total + product.qty, 0);
            
            if (totalQuantity === 3 || (totalQuantity - 3) % 4 === 0) {
              setModalVisible(true);

            }
          }
        } else {
          return Toast.show({
            type: 'error',
            text1: `Victime de son succès`,
            text2: `Quantité maximale: ${stockAvailable[0].quantite}` 
          });
        }
        
      }catch (error) {
        console.error("Une erreur s'est produite lors de l'incrémentation du stock :", error);
      }
    };

    const decrementhandler = async (productId) => {
      const product = products.find(p => p.productId === productId);
      setProductCount(productCount - 1);
      if (!product) {
        console.error(`Product with ID ${productId} not found.`);
        return;
      }
  
      if (product.qty <= 0) {
        console.error(`Product with ID ${productId} already has a quantity of 0.`);
        return;
      }
  
      dispatch(decrementOrRemoveFromCart({ productId: product.productId}));
  
      setProducts(prevProducts =>
        prevProducts.map((product) =>
          product.productId === productId ? { ...product, qty: product.qty - 1 } : product
        )
      );
      
  };

    const openFormuleQuiche = () => {
      navigation.navigate('formulequiche')
  }
  const handleCart = () => {
    navigation.navigate('panier')
  }

  return (
    <View style={{marginBottom:150}} >
       <ScrollView>
        <View>
            <Image
                    source={require('../../assets/quiche.jpg')} 
                    style={{ width: "100%", height: 330, resizeMode:'cover' }}
                />
             <Text style={styles.titleProduct}>Quiche</Text>
            <TouchableOpacity  onPress={handleBack} activeOpacity={1} style={{position:'absolute', right:20, top:20, backgroundColor:'white', borderRadius:25}}>
                    <Icon name="keyboard-arrow-left" size={40} color="#000" style={{}}  />
                </TouchableOpacity>
        </View>
        

        {/* les options */}
        <View style={{marginHorizontal:30, marginVertical:20}}>
            <Text style={styles.titleOptions}>Les options</Text>
            <ScrollView horizontal={true} style={{marginVertical:20}}>
            {products.map((product, index) => (
                <TouchableOpacity key={index} onPress={() => setSelectedSandwich(product)}>
                <View style={{marginHorizontal:20, flexDirection:'column', alignItems:'center'}} key={index}>
                    <Image
                    key={index}
                    source={{ uri: `http://127.0.0.1:8080/${product.image}` }}
                    style={styles.imageOptions}
                    />
                    <Text style={styles.libelle}>{product.libelle}</Text>
                    
                    {/* rajouter increment / decrement */}
                    <View style={styles.qtyContainer}>
                    <TouchableOpacity
                        onPress={() => decrementhandler(product.productId)}
                        style={styles.decrement}
                    >
                        <Icon name="remove" size={14} color="#000" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.qtyText}>
                      {/* <Text>{product.qty}</Text> */}
                      <Text>{getProductQtyInCart(product.productId)}</Text>

                  </TouchableOpacity>          
                    <TouchableOpacity
                        onPress={() => incrementHandler(product.productId)}
                        style={styles.increment}
                    >
                        <Icon name="add" size={14}  color="white" />
                    </TouchableOpacity>

          </View>
                </View>
                </TouchableOpacity>
            ))}
            </ScrollView >
           <Text>{selectedSandwich && selectedSandwich.descriptionProduit}</Text>
        </View>


        {/* les ingredients */}
        <View style={{marginHorizontal:30, marginBottom:20}}>
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
        <View>
          <View style={styles.bandeau}>
            <Text style={styles.textBandeau}>Faites vous plaisir !</Text>
          </View>
          <View style={{margin:30, flexDirection:'column', justifyContent:'flex-start', gap:20}}>
            <Text style={styles.texteFormule}>Choisissez une formule pour avoir un dessert et/ou une boisson</Text>
            <TouchableOpacity style={{marginRight:10}} onPress={openFormuleQuiche} activeOpacity={0.8}>
                    <Image
                            source={require('../../assets/Formule22.jpg')} 
                            style={{ width: 305, height: 200, resizeMode:'center' }}
                            />
                    <View style={styles.cardTitle}>
                        <Text style={styles.titleFormule}>Formule Quiche</Text>
                        <Text style={styles.textFormule}>Une quiche, un dessert et une boisson</Text>
                    </View>
                </TouchableOpacity>
          </View>
        </View>
       
        </ScrollView>

        {/* redirection vers formule*/}

       
        <View style={{...style.menu, marginBottom:65}}>
                <View>
                <View style={style.bandeauFormule}>
                    <Text style={{ fontWeight:"bold"}}>{productCount < 2 ? 'Prix du produit' : 'Prix des produits'}</Text>
                   <Text>{totalPrice.toFixed(2)} €</Text>
                </View>
                <View style={style.bandeauFormule}>
                    <View style={{flexDirection:'row'}}>
                    <Text>Avec</Text><Image source={require('../../assets/SUN.png')} style={{ width: 50, height: 20, resizeMode:'contain' }}/>
                    </View>
               <Text style={{color:colors.color2, fontWeight:"bold"}}>{(totalPrice*0.8).toFixed(2)}€</Text>
                </View>
                </View>
            <Button
                        style={style.btn}
                        textColor={'white'} 
                        // disabled={!selectedSandwich}
                        onPress={handleCart}
                        >Allez au panier</Button>
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
        fontWeight: "600",
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
        fontWeight: "400",
        textAlign:'center',
        paddingVertical:5
    },
    sousTexte:{
        // fontFamily:fonts.font2,
        fontSize:14,
        fontWeight: "400"
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
    },
    qtyContainer:{
      flexDirection:'row',
      gap:5
    },
    decrement:{
      backgroundColor:colors.color3,
      flexDirection:'row',
      alignItems:'center'
    },
    qtyText:{
      backgroundColor:colors.color3,
      paddingHorizontal: 5
    },
    increment:{
      backgroundColor:colors.color2,
      flexDirection:'row',
      alignItems:'center'
    },
    bandeau:{
      backgroundColor:colors.color6,
      paddingVertical:10
    },
    textBandeau:{
      paddingLeft:30,
      fontFamily:fonts.font3,
      fontWeight: "600",
      fontSize:20
    },
    titleFormule: {
      color:colors.color2,
      fontSize:20,
      fontWeight: "bold",
     },
     textFormule:{
       color:colors.color1,
       fontSize:14,
       fontWeight: "500",
       width:250
     },
     cardTitle:{
       backgroundColor:'white',
       height:57,
       borderBottomLeftRadius:10,
       borderBottomRightRadius:10,
       justifyContent:'center',
       paddingHorizontal:10
     },
     texteFormule:{
      fontSize:14,
      fontWeight: "700",
      fontFamily:fonts.font2
     }
  }); 

export default PageQuiche