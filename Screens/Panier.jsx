import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Linking,
  Image,
  Platform,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import axios from 'axios';
import {
  updateCart,
  addToCart,
  clearCart,
  addPromo,
  resetPromo,
  acceptOffer,
} from '../reducers/cartSlice';
import {setNumeroCommande, setProducts} from '../reducers/orderSlice';
import CartItem from '../components/CardItems';
import CardItemFormule from '../components/CardItemsFormule';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import {
  checkStockFormule,
  checkStockForSingleProduct,
  getFamilyOfProduct,
  checkIfUserOrderedOffreSUNToday,
  fetchAllProductsClickAndCollect,
  updateAntigaspiStock,
  updateStock,
  getPrefCommande,
  getCart,
} from '../CallApi/api';
import FooterProfile from '../components/FooterProfile';
import ModaleOffre31 from '../components/ModaleOffre31';
import PulseAnimation from '../components/PulseAnimation';
import {fonts, colors} from '../styles/styles';
import StorePicker from '../components/StorePicker';
import CustomDatePicker from '../components/CustomDatePicker';
import {style} from '../styles/formules';
import {styles} from '../styles/panier';
import {stylesInvite} from '../styles/invite';
import ArrowLeft from '../SVG/ArrowLeft';
import Signup from '../SVG/Signup';
import {DeleteCode} from '../SVG/DeleteCode';
import {ApplyCode} from '../SVG/ApplyCode';
import CardPaiement from '../SVG/CardPaiement';
import LottieView from 'lottie-react-native';
import {API_BASE_URL} from '../config';
// import {API_BASE_URL, API_BASE_URL_ANDROID, API_BASE_URL_IOS} from '@env';
import Svg, {Path} from 'react-native-svg';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useCountdown} from '../components/CountdownContext';
import CartItemAntigaspi from '../components/CardItemsAntiGaspi';
import ModaleOffreSUN from '../components/ModaleOffreSUN';
import ModaleModifProfile from '../components/ModaleModifProfile';
import CartItemSUN from '../components/CardItemsSUN';
//fonctions
import {
  decrementhandler,
  incrementhandler,
  removehandler,
  removeCartCountDown,
  removehandlerafterCountdown,
  handleOfferCalculation,
  createOrder,
  openStripe,
  checkPaymentStatus,
  formatToDateISO,
  handleApplyDiscount,
  handleRemoveDiscount,
} from '../Fonctions/fonctions';
import LogoSun from '../SVG/LogoSun';
import InputPromo from '../components/InputPromo';

const Panier = ({navigation}) => {
  const dispatch = useDispatch();
  const webViewRef = useRef(null);
  const [promoCode, setPromoCode] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [orderInfo, setOrderInfo] = useState(null);
  const [checkoutSession, setCheckoutSession] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [productFamilies, setProductFamilies] = useState({});
  const [paiement, setPaiement] = useState('online');
  const [loading, setLoading] = useState(false);
  const [selectStore, setSelectStore] = useState('');
  const [isModalSunVisible, setIsModalSunVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [erreurCodePromo, setErreurCodePromo] = useState(false);
  const [usedPromoCodes, setUsedPromoCodes] = useState([]);
  const [erreurCodePromoUsed, setErreurCodePromoUsed] = useState(false);
  const [modalProfile, setModalProfile] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [currentPromoCode, setCurrentPromoCode] = useState(null);

  // const cart = useSelector(state => state.cart.cart); //ou cartItems
  const [cart, setCart] = useState(null);
  const promotionId = useSelector(state => state.cart.promotionId);
  const user = useSelector(state => state.auth.user);
  const cartTotal = useSelector(state => state.cart.cartTotal);
  const selectedDateString = useSelector(state => state.cart.date);
  const selectedTime = useSelector(state => state.cart.time);
  const numero_commande = useSelector(state => state.order.numero_commande);

  const {countDownNull, countdown, resetCountdown, resetForPaiementCountdown} =
    useCountdown();

  // panier vide
  // const isCartEmpty = cart.length === 0;

  let userRole = user.role;
  const emailConfirmOrder = user.email;
  const firstnameConfirmOrder = user.firstname;


  const handleBack = () => {
    navigation.navigate('home');
  };

  useEffect(() => {
    const fetchCart = async () => {
      const cart = await getCart(user.userId);
      setCart(cart);
      console.log('Panier', cart);
    };

    if (user.userId) {
      fetchCart();
    }
  }, [user.userId]);
  /** offre 3+1 */
  const handleAcceptOffer = () => {
    //console.log('je valide loffre 3+1)
  };
  const handlePress = async () => {
    const allProductsClickandCollect = await fetchAllProductsClickAndCollect();
    const offreSunProduct = allProductsClickandCollect.find(
      product => product.type_produit === 'offreSUN',
    );
    // offre dans le panier déja présente ?
    const isOffreSunInCart = cart.some(
      item => item.type_produit === 'offreSUN',
    );
    // je veux ajouter le produit : offreSunProduct si pas encore présent dans le panier
    if (offreSunProduct && !isOffreSunInCart) {
      setIsModalSunVisible(true);
      setSelectedProduct(offreSunProduct);
    }
    if (isOffreSunInCart) {
      return Toast.show({
        type: 'error',
        text1: 'Offre déjà ajoutée',
        text2: "Vous avez déjà une baguette 'offreSUN' dans votre panier",
      });
    }
  };
  /** fin offre 3+1 */

  // family produits - si une formule = famille "Formules"
  //va chercher le store à chaque changement dans le store picker
  // useEffect(() => {
  //   const fetchFamilies = async () => {
  //     const productIds = cart
  //       .map(item => {
  //         //formule separement
  //         if (item.type === 'formule') {
  //           return null;
  //         }
  //         return item.productId;
  //       })
  //       .filter(id => id !== null);

  //     const fetchedFamilies = await Promise.all(
  //       productIds.map(async id => {
  //         const data = await getFamilyOfProduct(id);
  //         return {
  //           productId: id,
  //           family: data.FamillyProduct.nom_famille_produit,
  //         };
  //       }),
  //     );

  //     const familiesObject = fetchedFamilies.reduce((acc, item) => {
  //       acc[item.productId] = item.family;
  //       return acc;
  //     }, {});

  //     // famille "Formules" pour les formules
  //     cart.forEach(item => {
  //       if (item.type === 'formule') {
  //         familiesObject[item.productId] = 'Formules';
  //       }
  //     });
  //     const getStore = async () => {
  //       try {
  //         const response = await axios.get(
  //           `${API_BASE_URL}/getOne/${user.userId}`,
  //         );
  //         setSelectStore(response.data.storeId);
  //       } catch (error) {
  //         console.error(error);
  //         throw new Error('Erreur lors de la recupération du store');
  //       }
  //     };
  //     getStore();
  //     setProductFamilies(familiesObject);
  //   };

  //   fetchFamilies();
  // }, [cart, user.storeId]);

  // modale choix preference commande : remboursement ou remplacement
  const verfiPrefCommande = async userId => {
    const prefCommande = await getPrefCommande(userId);
    if (prefCommande.preference_commande == null) {
      setModalProfile(true);
    }
  };
  useEffect(() => {
    verfiPrefCommande(user.userId);
  }, []);

  // 1. je clicque sur le bouton "En ligne"
  const handleConfirm = async newPaiement => {
    // verif si presence de la date
    if (!selectedDateString) {
      Toast.show({
        type: 'error',
        text1: 'Date manquante',
        text2: 'Veuillez sélectionner une date avant de confirmer.',
      });
      return;
    }
    // verif du role
    if (user.role === 'client') {
      return Toast.show({
        type: 'error',
        text1: `Le Click and collect n'est pas disponible`,
        text2: `Nous vous préviendrons très vite par email`,
      });
    }

    setPaiement(newPaiement);
    dispatch(setProducts(cart));

    console.log('je commande en ligne');
  };

  const handleSignup = () => {
    navigation.navigate('signup');
  };

  // useEffect(() => {
  //   if (countdown === 0) {
  //     // removeCartCountDown(cart, countdown, dispatch);
  //     console.log(
  //       'jeleve les produits et je remets en stock a lexpiration du compteur',
  //     );
  //   }
  //   if (isCartEmpty) {
  //     countDownNull();
  //   }
  // }, [countdown, cart]);

  //transforme le countdown en minutes
  const formatCountdown = seconds => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} min ${
      remainingSeconds < 10 ? '0' : ''
    }${remainingSeconds}`;
  };

  return (
    <>
      <SafeAreaProvider style={styles.safeAreaProvider}>
        <View style={styles.contentSafeArea}>
          {loading ? (
            <LottieView
              source={require('../assets/loaderpaiment.json')}
              autoPlay
              loop
              style={styles.lottieJson}
            />
          ) : (
            <>
              <View style={styles.headerCart}>
                <Text style={styles.contentHeader}>Votre Panier</Text>
                <TouchableOpacity
                  onPress={handleBack}
                  activeOpacity={1}
                  style={{backgroundColor: 'white', borderRadius: 25}}>
                  <ArrowLeft fill={colors.color1} />
                </TouchableOpacity>
              </View>

              <View style={styles.contentPickers}>
                <View>
                  <StorePicker />
                </View>
                <View>
                  <CustomDatePicker />
                </View>
              </View>

              <ScrollView
                style={{marginVertical: 10, flex: 1}}
                showsVerticalScrollIndicator={false}>
                {/* <InputPromo/> */}
              </ScrollView>

              {/* {!isCartEmpty && (
                <View style={style.contentGlobal}>
                  <View style={style.contentCountDown}>
                    <Text style={style.countDown}>
                      Délai du panier: {formatCountdown(countdown)}
                    </Text>
                  </View>
                </View>
              )} */}

              <View
                style={[
                  style.menu,
                  Platform.OS === 'android' && style.androidMenu,
                ]}>
                <View style={styles.contentTotalMenu}>
                  <View>
                    <Text style={styles.boldText}>Votre total</Text>
                    {/* {cart.length !== 1 || antigaspiProductsCount !== 1 ?  */}
                    {/* ( */}
                      <Text style={{color: colors.color2}}>
                        Total Avec
                        <Image
                          source={require('../assets/sun.jpg')}
                          style={{width: 50, height: 20, resizeMode: 'contain'}}
                        />
                      </Text>
                    {/* ) */}
                     {/* : null} */}
                  </View>
                  <View style={styles.contentTotalPrice}>
                    <Text style={{color: colors.color1}}>
                      {/* {totalPrice.toFixed(2)}€ */}
                      Valeur Prix total
                    </Text>
                    {/* {cart.length !== 1 || antigaspiProductsCount !== 1 ?  */}
                    {/* ( */}
                      <Text style={styles.orangeBoldText}>
                        {/* {totalPriceCollab.toFixed(2)}€ */}
                        Valeur Prix collab
                      </Text>
                    {/* )  */}
                    {/* : null} */}
                  </View>
                </View>
                <View>
                  {user.role == 'invite' ? (
                    <View style={{width: 180, gap: 5}}>
                      <TouchableOpacity
                        style={stylesInvite.btn}
                        onPress={handleSignup}>
                        <Signup />
                        <Text style={stylesInvite.textBtn}>Inscription</Text>
                      </TouchableOpacity>
                      <Text style={{fontSize: 11}}>
                        Inscrivez vous pour commander et profiter de tout les
                        avantages !
                      </Text>
                    </View>
                  ) : (
                    <View style={{gap: 10}}>
                      <TouchableOpacity
                        onPress={() => handleConfirm('online')}
                        style={styles.buttonOnline}>
                        <CardPaiement />
                        <Text style={styles.whiteBoldText}>En ligne</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
                {modalProfile && (
                  <ModaleModifProfile
                    modalVisible={modalProfile}
                    setModalVisible={setModalProfile}
                  />
                )}
              </View>

              <PulseAnimation onPress={handlePress} />

              <ModaleOffre31
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                handleAcceptOffer={handleAcceptOffer}
              />

              <ModaleOffreSUN
                modalVisible={isModalSunVisible}
                setModalVisible={setIsModalSunVisible}
                product={selectedProduct}
              />

              <FooterProfile />
            </>
          )}
        </View>
      </SafeAreaProvider>
    </>
  );
};
export default Panier;
