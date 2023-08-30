import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect, useState} from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { style } from '../../styles/formules'; 
import { styles } from '../../styles/produits'
import axios from 'axios'
import { fonts, colors} from '../../styles/styles'
import { Button} from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux';
import FooterProfile from '../../components/FooterProfile';
import { addToCart, decrementOrRemoveFromCart } from '../../reducers/cartSlice';
import Svg, { Path } from 'react-native-svg';
import ArrowLeft from '../../SVG/ArrowLeft';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
//call API
import { checkStockForSingleProduct } from '../../CallApi/api.js';
import ProductCard from '../../components/ProductCard';
import {  API_BASE_URL, API_BASE_URL_ANDROID, API_BASE_URL_IOS } from '@env';


const PagePainBagnat = ({navigation}) => {

  //pour les test
if (__DEV__) {
  if (Platform.OS === 'android') {
      API_BASE_URL = API_BASE_URL_ANDROID;
  } else if (Platform.OS === 'ios') {
      API_BASE_URL = API_BASE_URL_IOS;  
  }
}

    const [products, setProducts] = useState([]); 
    const [selectedProduct, setSelectedProduct] = useState(null); 
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
      const totalPrice = products.reduce((acc, product) => {
        const qtyInCart = getProductQtyInCart(product.productId); 
        return acc + (qtyInCart * product.prix_unitaire);
      }, 0);
      setTotalPrice(totalPrice);
    }, [products, cart]);
    
    useEffect(() => {
      const totalCount = cart.reduce((acc, product) => acc + product.qty, 0);
      setProductCount(totalCount);
    }, [cart]);
   
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
            const response = await axios.get(`${API_BASE_URL}/getAllProducts`);
        
          const updatedProducts = response.data.map((product) => ({
            ...product,
            qty: 0, 
          }));
       
      
        const products = updatedProducts.filter(product => product.categorie === "Pains Bagnat");
        setProducts(products)
          
          } catch (error) {
            console.error('Une erreur s\'est produite, error products :', error);
          }
        };
        fetchData(); 
      }, []);
    
    //increment
    // const incrementHandler = async (productId) => {
    //   const product = products.find(p => p.productId === productId);
    //   setProductCount(productCount + 1);

    //   if (!product) {
    //     console.error(`Product with ID ${productId} not found.`);
    //     return;
    //   }

    //   const { libelle, image, prix_unitaire, offre} = product; // Déstructurez le produit
    //   //console.log(product.productId);

    //   const productStock = stock.find(item => item.productId === product.productId);
      
    //   // Obtenir la quantité en stock pour ce produit
    //   const productQuantity = productStock ? productStock.quantite : 0;
    //   console.log(`The quantity in stock for product ${productId} is ${productQuantity}`);

    //   //si plus de stock
    //   if(productQuantity === 0){
    //     return Toast.show({
    //       type: 'error',
    //       text1: `Victime de son succès`,
    //       text2: 'Plus de stock disponible' 
    //     });
    //   }
    //   try{
    //     const stockAvailable = await checkStockForSingleProduct(product.productId);
    //     console.log(stockAvailable)

    //     const remainingStock = stockAvailable[0].quantite - product.qty;
    //     console.log(remainingStock)

    //     if (stockAvailable.length > 0 && remainingStock > 0) {
    //       console.log(`Ajout au panier: ${product.libelle}, prix: ${product.prix_unitaire}, quantité: 1`);
    //       dispatch(addToCart({ productId: product.productId, libelle: product.libelle, image: product.image, prix_unitaire: product.prix_unitaire, qty: 1 , offre: product.offre}));
  
    //       setProducts((prevProducts) =>
    //       prevProducts.map((product) =>
    //         product.productId === productId ? { ...product, qty: product.qty + 1 } : product
    //       )
    //     );
    //       if (product.offre && product.offre.startsWith('offre31')) {
    //         const updatedCart = [...cart, { productId: product.productId, libelle: product.libelle, image: product.image, prix_unitaire: product.prix, qty: 1 , offre: product.offre}];
    //         const sameOfferProducts = updatedCart.filter((item) => item.offre === product.offre);
    //         const totalQuantity = sameOfferProducts.reduce((total, product) => total + product.qty, 0);
            
    //         if (totalQuantity === 3 || (totalQuantity - 3) % 4 === 0) {
    //           setModalVisible(true);

    //         }
    //       }
    //     } else {
    //       return Toast.show({
    //         type: 'error',
    //         text1: `Victime de son succès`,
    //         text2: `Quantité maximale: ${stockAvailable[0].quantite}` 
    //       });
    //     }
        
    //   }catch (error) {
    //     console.error("Une erreur s'est produite lors de l'incrémentation du stock :", error);
    //   }
    // };

  //   const decrementhandler = async (productId) => {
  //     const product = products.find(p => p.productId === productId);
  //     setProductCount(productCount - 1);
  //     if (!product) {
  //       console.error(`Product with ID ${productId} not found.`);
  //       return;
  //     }
  
  //     if (product.qty <= 0) {
  //       console.error(`Product with ID ${productId} already has a quantity of 0.`);
  //       return;
  //     }
  
  //     dispatch(decrementOrRemoveFromCart({ productId: product.productId}));
  
  //     setProducts(prevProducts =>
  //       prevProducts.map((product) =>
  //         product.productId === productId ? { ...product, qty: product.qty - 1 } : product
  //       )
  //     );
      
  // };

    const openFormulePainBagnat = () => {
      navigation.navigate('formulepainbagnat')
  }
  const handleCart = () => {
    navigation.navigate('panier')
  }


    //pour capitaliser la premiere lettre
    const capitalizeFirstLetter = (string) => {
      return string.charAt(0).toUpperCase() + string.slice(1);
  }
  const capitalizeIngredients = (ingredients) => {
      return ingredients.split(', ').map(capitalizeFirstLetter).join(',  ');
  }

  return (
    <View style={{marginBottom:150}} >
       <ScrollView>
        <View>
            <Image
                    source={require('../../assets/painbagnat.jpg')} 
                    style={{ width: "100%", height: 330, resizeMode:'cover' }}
                />
             <Text style={styles.titleProduct}>Pain Bagnat</Text>
             <TouchableOpacity  onPress={handleBack} activeOpacity={1} style={{position:'absolute', right:20, top:20, backgroundColor:'black', borderRadius:25}}>
                    <ArrowLeft fill="white"/>
              </TouchableOpacity>
        </View>
        

        {/* les options */}
        <View style={{marginHorizontal:30, marginVertical:20}}>
            <Text style={styles.titleOptions}>Les options</Text>
            <ScrollView horizontal={true} style={{marginVertical:20}}>
            {products.map((product, index) => (
                <TouchableOpacity key={index} onPress={() => setSelectedProduct(product)}>
                {/* <View style={{marginHorizontal:20, flexDirection:'column', alignItems:'center'}} key={index}>
                    <Image
                    key={index}
                    source={{ uri: `${API_BASE_URL}/${product.image}` }}
                    style={styles.imageOptions}
                    />
                    <Text style={styles.libelle}>{product.libelle}</Text>
                    
                    <View style={{flexDirection:'row', gap:5}}>
                    <TouchableOpacity
                        onPress={() => decrementhandler(product.productId)}
                        style={styles.container_gray}
                    >
                      <Svg width={7} height={4} viewBox="0 0 7 4">
                        <Path
                          d="M0.666748 3.8V0.733337H6.80008V3.8H0.666748Z"
                          fill="#273545"
                        />
                      </Svg>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.container_gray}>
                      <Text>{getProductQtyInCart(product.productId)}</Text>

                  </TouchableOpacity> 

                  <TouchableOpacity
                        onPress={() => incrementHandler(product.productId)}
                        style={{...styles.container_gray, backgroundColor:colors.color2}}
                    >
                       <Svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <Path d="M10 4.05197V6.48141H6.63702V9.86669H4.14375V6.48141H0.800049V4.05197H4.14375V0.666687H6.63702V4.05197H10Z" fill="#ECECEC"/>
                      </Svg>
                    </TouchableOpacity>

          </View>
                </View> */}
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
                      />
                    </View>
                </TouchableOpacity>
            ))}
            </ScrollView >
            <Text style={{marginHorizontal:10}}>
          {selectedProduct ? selectedProduct.descriptionProduit : "Sélectionnez un produit pour avoir sa description"}
          </Text>         
          </View>


       {/* les ingredients */}
       <View style={{marginHorizontal:30}}>
            <Text style={styles.titleOptions}>Ingrédients</Text>
            <Text style={styles.libelle}>{selectedProduct ? selectedProduct.libelle : ""}</Text> 
            {/* {selectedProduct && selectedProduct.ingredients && ( */}
        <View style={styles.ingredients}>
        <Text style={styles.listeIngredients}>
        {selectedProduct ? capitalizeIngredients(selectedProduct.ingredients) : "Veuillez sélectionner un produit pour voir ses ingrédients."}
          {/* {selectedProduct ? selectedProduct.ingredients : "Veuillez sélectionner un produit pour voir ses ingrédients."} */}
        </Text>
      </View>


            {/* {selectedProduct && <Text>{selectedProduct.description}</Text>} */}
            {
                selectedProduct && 
                selectedProduct.description && 
                selectedProduct.description.toLowerCase().includes('halal') && 
                <View style={styles.description}>
                    <Image
                    source={require('../../assets/halal.png')}
                    style={{ width: 42, height: 42, resizeMode:'cover' }}
                    />
                    <Text>Ce produit est certifié Halal !</Text>
                </View>
            }
            {
                selectedProduct && 
                selectedProduct.description && 
                selectedProduct.description.toLowerCase().includes('vegan') && 
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
            <TouchableOpacity style={{marginRight:10}} onPress={openFormulePainBagnat} activeOpacity={0.8}>
            <View style={{width:320}}>
                    <Image
                            source={require('../../assets/Formule28.jpg')} 
                            style={{ resizeMode:'cover',  width: 320, height: 200, }}                            />
                    <View style={styles.cardTitle}>
                        <Text style={styles.titleFormule}>Formule Pain Bagnat</Text>
                        <Text style={styles.textFormule}>Un pain bagnat, un dessert et une boisson</Text>
                    </View>
              </View>
                </TouchableOpacity>
          </View>
        </View>
       
        </ScrollView>

        {/* redirection vers formule*/}

       
        <View style={{...style.menu, marginBottom:40, paddingBottom:40}}>
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



export default PagePainBagnat