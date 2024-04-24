import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {addToCart, acceptOffer} from '../reducers/cartSlice';
import {checkStockForSingleProduct, updateStock} from '../CallApi/api.js';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import FooterProfile from '../components/FooterProfile';
import ModaleOffre31 from '../components/ModaleOffre31';
import ArrowLeft from '../SVG/ArrowLeft';
import {colors, fonts} from '../styles/styles';
import Svg, {Path} from 'react-native-svg';
import {style} from '../styles/formules';
import {styles} from '../styles/productdetails';
import {Button} from 'react-native-paper';
import {API_BASE_URL} from '../config';
// import {  API_BASE_URL, API_BASE_URL_ANDROID, API_BASE_URL_IOS } from '@env';
import FastImage from 'react-native-fast-image';
import {useCountdown} from '../components/CountdownContext';

//fonctions
import {
  incrementhandler,
  decrementhandler,
  handleOfferCalculation,
} from '../Fonctions/fonctions';
import InfoProduct from '../SVG/InfoProduct';
import ModaleIngredients from '../components/ModaleIngredients';
import LogoSun from '../SVG/LogoSun';
import Decrement from '../SVG/Decrement';
import Increment from '../SVG/Increment';

const ProductDetails = ({navigation, route}) => {
  const {product} = route.params;
  const [currentStock, setCurrentStock] = useState(product.stock);
  const [modalVisible, setModalVisible] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [modalVisibleIngredients, setModalVisibleIngredients] = useState(false);
  const {resetCountdown} = useCountdown();

  const handleBack = () => {
    navigation.navigate('home');
  };

  const handleCart = () => {
    navigation.navigate('panier');
  };
  const openIngredients = () => {
    setModalVisibleIngredients(true);
  };
  return (
    <>
      <View style={{flex: 1}}>
        <View style={{paddingTop: 50}}></View>
        <ScrollView style={{marginBottom: 20}}>
          <View>
            {/* <Image source={{ uri: `${API_BASE_URL}/${product.image}` }} style={{width: "100%", height:300, resizeMode:'cover'}} /> */}
            <FastImage
              style={{width: '100%', height: 300, resizeMode: 'cover'}}
              source={{
                uri: `${API_BASE_URL}/${product.image}`,
                priority: FastImage.priority.high,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
            {/* info product n'apparait pas pour les boissons */}
            {product.categorie !== 'Boissons' &&
              product.ingredients != '' &&
              product.allergenes != '' && (
                <TouchableOpacity
                  style={{position: 'absolute', bottom: 10, right: 10}}
                  onPress={openIngredients}>
                  <InfoProduct />
                </TouchableOpacity>
              )}
            <View style={styles.contentTitle}>
              <Text style={styles.titleProduct}>{product.libelle}</Text>
              <TouchableOpacity
                onPress={handleBack}
                activeOpacity={1}
                style={{backgroundColor: colors.color1, borderRadius: 25}}>
                <ArrowLeft fill="white" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.details}>
            <Text style={{color: colors.color1}}>
              {product.descriptionProduit}
            </Text>
          </View>

          <View
            style={styles.contentLibelle}>
            <View style={{flexDirection: 'column'}}>
              <Text style={{fontWeight: 'bold', color: colors.color1}}>
                {product.libelle}
              </Text>
              <Text style={{fontWeight: '200', color: colors.color1}}>
                {product.prix_unitaire} €
              </Text>
            </View>
            <View
              style={{
                width: 1,
                backgroundColor: colors.color3,
                marginVertical: 5,
              }}
            />
            <View style={{flexDirection: 'column', justifyContent: 'flex-end'}}>
              <LogoSun />
              <Text style={styles.prixSun}>
                {(product.prix_unitaire * 0.8).toFixed(2)}€
              </Text>
            </View>
          </View>

          {/* <View style={{ marginVertical:20, marginHorizontal:30}}>
                <Text style={{fontFamily:fonts.font2, fontWeight:"700"}}>Ingrédients</Text>
              </View>

              <View style={{backgroundColor:colors.color6, marginHorizontal:30, borderRadius:10, padding: 10, flexDirection:'row', justifyContent:'space-between'}}>
              <Text>{product.ingredients}</Text>
              </View> */}
        </ScrollView>
        {/* <ModaleOffre31
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          handleAcceptOffer={handleAcceptOffer}
        /> */}
      </View>

      <View style={{...style.menu, height: 120, justifyContent: 'center'}}>
        <View style={{flexDirection: 'column', gap: 20}}>
          <View style={{flexDirection: 'row'}}>
            <Text style={{fontWeight: 'bold', color: colors.color1}}>
              Ajouter le produit au panier:{' '}
            </Text>
            <View style={styles.qtyContainer}>
              <TouchableOpacity
                onPress={() => decrementhandler()}
                style={styles.container_gray}
                // disabled={productQuantity === 0}
              >
                <Decrement />
              </TouchableOpacity>

              <View style={styles.container_gray}>
                <Text style={styles.qtyText}></Text>
              </View>
              <TouchableOpacity
                onPress={() => incrementhandler()}
                style={{
                  ...styles.container_gray,
                  backgroundColor: colors.color2,
                }}>
                <Increment />
              </TouchableOpacity>
            </View>
          </View>

          <View style={{flexDirection: 'row', gap: 10}}>
            <View>
              <View style={style.bandeauFormule}>
                <Text style={{fontWeight: 'bold', color: colors.color1}}>
                  {productCount < 2 ? 'Prix du produit' : 'Prix des produits'}
                </Text>
                <Text style={{color: colors.color1}}>
                  {totalPrice.toFixed(2)} €
                </Text>
              </View>
              <View style={style.bandeauFormule}>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{color: colors.color1}}>Avec</Text>
                  <Image
                    source={require('../assets/sun.jpg')}
                    style={{width: 50, height: 20, resizeMode: 'contain'}}
                  />
                </View>
                <Text style={{color: colors.color2, fontWeight: 'bold'}}>
                  {(totalPrice * 0.8).toFixed(2)}€
                </Text>
              </View>
            </View>

            <Button
              style={style.btn}
              textColor={'white'}
              // disabled={!selectedProduct}
              onPress={handleCart}>
              Allez au panier
            </Button>
          </View>
        </View>
      </View>
      <ModaleIngredients
        modalVisibleIngredients={modalVisibleIngredients}
        setModalVisibleIngredients={setModalVisibleIngredients}
        product={product.ingredients}
        allergenes={product.allergenes}
      />

      <FooterProfile />
    </>
  );
};

export default ProductDetails;
