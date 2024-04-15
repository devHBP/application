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
import {
  setNumeroCommande,
  setProducts,
} from '../reducers/orderSlice';
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
} from '../CallApi/api';
import FooterProfile from '../components/FooterProfile';
import ModaleOffre31 from '../components/ModaleOffre31';
import PulseAnimation from '../components/PulseAnimation';
import {fonts, colors} from '../styles/styles';
import StorePicker from '../components/StorePicker';
import CustomDatePicker from '../components/CustomDatePicker';
import {style} from '../styles/formules';
import {stylesInvite} from '../styles/invite';
import ArrowLeft from '../SVG/ArrowLeft';
import LottieView from 'lottie-react-native';
import {API_BASE_URL} from '../config';
// import {API_BASE_URL, API_BASE_URL_ANDROID, API_BASE_URL_IOS} from '@env';
import Svg, {Path} from 'react-native-svg';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {useCountdown} from '../components/CountdownContext';
import CartItemAntigaspi from '../components/CardItemsAntiGaspi';

//fonctions
import {
  decrementhandler,
  removehandler,
  removeCart,
  handleOfferCalculation,
} from '../Fonctions/fonctions';
import CardPaiement from '../SVG/CardPaiement';
import ModaleOffreSUN from '../components/ModaleOffreSUN';
import {DeleteCode} from '../SVG/DeleteCode';
import {ApplyCode} from '../SVG/ApplyCode';
import ModaleModifProfile from '../components/ModaleModifProfile';
import CartItemSUN from '../components/CardItemsSUN';

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

  const cart = useSelector(state => state.cart.cart); //ou cartItems
  const promotionId = useSelector(state => state.cart.promotionId);
  const user = useSelector(state => state.auth.user);
  const cartTotal = useSelector(state => state.cart.cartTotal);
  const selectedDateString = useSelector(state => state.cart.date);
  const selectedTime = useSelector(state => state.cart.time);
  const numero_commande = useSelector(state => state.order.numero_commande);

  const {countDownNull, countdown, resetCountdown, resetForPaiementCountdown} =
    useCountdown();

  // panier vide
  const isCartEmpty = cart.length === 0;

  let userRole = user.role;
  const emailConfirmOrder = user.email;
  const firstnameConfirmOrder = user.firstname;

  //console.log('cart panier', cart)

  let totalPrice = Number(
    cart
      .reduce((total, item) => {
        const prix = item.prix || item.prix_unitaire;

        return total + item.qty * prix;
      }, 0)
      .toFixed(2),
  );

  let totalPriceCollab = cart.reduce((total, product) => {
    let adjustedPrice = product.prix || product.prix_unitaire;

    if (user.role === 'SUNcollaborateur' && !product.antigaspi) {
      adjustedPrice *= 0.8;
    }

    return total + adjustedPrice * product.qty;
  }, 0);

  totalPriceCollab = Number(totalPriceCollab.toFixed(2));

  const antigaspiProductsCount = cart.filter(
    product => product.antigaspi,
  ).length;

  const totalQuantity = cart.reduce((total, item) => total + item.qty, 0);

  const aggregatedCartItems = cart.reduce((accumulator, currentItem) => {
    // Vérifiez si le produit a une offre avant de continuer
    if (!currentItem.offre) {
      return accumulator; // Si le produit n'a pas d'offre, ignorez-le simplement
    }

    // Recherchez l'article dans l'accumulateur par idProduct
    const existingItem = accumulator.find(
      item => item.productId === currentItem.productId,
    );

    if (existingItem) {
      // Si l'article existe déjà dans l'accumulateur, ajoutez simplement la quantité
      existingItem.qty += currentItem.qty;

      // Si l'élément actuel est gratuit, ajoutez une note à l'élément existant
      if (currentItem.isFree) {
        existingItem.isFree = true;
        existingItem.freeCount += currentItem.qty; // ajoutez la quantité de produits gratuits
      }

      // Conservez le nom de l'offre du produit (vous pouvez ajouter d'autres logiques si nécessaire)
      existingItem.offre = currentItem.offre;
    } else {
      // Sinon, ajoutez un nouvel élément à l'accumulateur
      accumulator.push({
        ...currentItem,
        freeCount: currentItem.isFree ? currentItem.qty : 0, // Initialisez freeCount
      }); // Utilisez la déstructuration pour éviter les références croisées
    }

    return accumulator;
  }, []);

  const handleBack = () => {
    navigation.navigate('home');
  };

  // fonction valide l'offre3+1
  const handleAcceptOffer = () => {
    const lastProductAdded = cart[cart.length - 1];

    const freeProduct = {
      ...lastProductAdded,
      qty: 1,
      prix_unitaire: 0,
    };
    dispatch(
      acceptOffer({productId: freeProduct.productId, offre: freeProduct.offre}),
    );
    updateStock({...freeProduct, qty: 1});
  };

  // fonction ajout de produit (icone +)
  const incrementhandler = async (productIds, offre, type, item) => {
    // console.log('productIds', productIds);
    // console.log('offre', offre);
    // console.log('type', type);
    // console.log('item', item);
    resetCountdown();
    const id = Array.isArray(productIds) ? productIds[0] : productIds; // Si productIds est un tableau, prenez le premier élément. Sinon, prenez productIds tel quel.

    const productInCart = cart.find(item =>
      Array.isArray(item.productIds)
        ? item.productIds[0] === id
        : item.productId === id,
    );
    // console.log('productInCart', productInCart);
    const type_produit = productInCart ? productInCart.type_produit : null;

    const isCurrentProductOffreSun = type_produit === 'offreSUN';
    const isOffreSunInCart = cart.some(
      item => item.type_produit === 'offreSUN',
    );

    if (isCurrentProductOffreSun && isOffreSunInCart) {
      Toast.show({
        type: 'error',
        text1: 'Offre déjà ajoutée',
        text2: "Vous avez déjà une baguette 'offreSUN' dans votre panier",
      });
      return;
    }

    try {
      if (type === 'formule') {
        // verif des stocks pour chaque produit
        const stocks = await checkStockFormule(item.productIds);

        // console.log('stocks', stocks);

        const productsOutOfStocks = stocks
          .filter(stock => stock[0].quantite < 1)
          .map(stock => stock[0].productId);

        // console.log('produitsEnRupture', productsOutOfStocks);

        if (productsOutOfStocks.length > 0) {
          const idsQuery = productsOutOfStocks.join(',');
          try {
            const response = await axios.get(
              `${API_BASE_URL}/getLibelleProduct?ids=${idsQuery}`,
            );
            const libelles = response.data.map(obj => obj.libelle);

            return Toast.show({
              type: 'error',
              text1: `Victime de son succès`,
              text2: `Plus de stock disponible pour : ${libelles.join(', ')}`,
            });
          } catch (error) {
            console.error(
              'Erreur lors de la récupération des libellés des produits:',
              error,
            );
          }
        }

        item.productIds.forEach(productId => {
          // console.log('productId dans la formule:', productId);
          updateStock({productId: productId, qty: 1});
        });
        dispatch(addToCart(item));
      } else if (type === 'petitepizza') {
        const stockAvailable = await checkStockForSingleProduct(id);
        // console.log(`stock pour ${id}`, stockAvailable);

        const productsOutOfStocks = stockAvailable
          .filter(stock => stock.quantite < 1)
          .map(stock => stock.productId);

        // console.log('produitsEnRupture', productsOutOfStocks);

        if (productsOutOfStocks.length > 0) {
          return Toast.show({
            type: 'error',
            text1: `Victime de son succès`,
            text2: `Plus de stock disponible`,
          });
        }

        dispatch(addToCart(item));

        await updateStock({productId: item.productId, qty: 1});

        const updatedCart = [...cart, {...item, qty: 1}]; // Simuler l'ajout de l'item au panier pour la mise à jour

        // Appel de handleOfferCalculation avec le panier mis à jour et dispatch
        handleOfferCalculation(updatedCart, dispatch);
      } else if (type === 'product') {
        const stockAvailable = await checkStockForSingleProduct(id);

        const productsOutOfStocks = stockAvailable
          .filter(stock => stock.quantite < 1)
          .map(stock => stock.productId);

        if (productsOutOfStocks.length > 0) {
          return Toast.show({
            type: 'error',
            text1: `Victime de son succès`,
            text2: `Plus de stock disponible`,
          });
        }

        if (offre && offre.startsWith('offre31')) {
          const totalQuantity = cart
            .filter(item => item.offre === offre)
            .reduce((total, product) => total + product.qty, 0);

          // Inclure le produit actuellement en cours d'ajout pour calculer la future quantité totale
          const futureTotalQuantity = totalQuantity + 1;

          // Si la quantité future est un multiple de 4, cela signifie que nous devons ajouter un produit gratuit ensuite
          if (futureTotalQuantity % 4 === 0) {
            // Déclencher la modal pour offrir le produit gratuit
            setModalVisible(true);
          } else {
            // Ajouter le produit au panier et mettre à jour le stock normalement.
            dispatch(addToCart({...item, qty: 1}));
            await updateStock({productId: item.productId, qty: 1});
          }
        } 
        else {
          dispatch(addToCart({...item, qty: 1}));
          await updateStock({productId: item.productId, qty: 1});
        }
      } else if (type === 'antigaspi') {
        console.log('cas antigaspi');
      }
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de l'incrémentation du stock :",
        error,
      );
    }
  };

  // family produits - si une formule = famille "Formules"
  //va chercher le store à chaque changement dans le store picker
  useEffect(() => {
    const fetchFamilies = async () => {
      const productIds = cart
        .map(item => {
          //formule separement
          if (item.type === 'formule') {
            return null;
          }
          return item.productId;
        })
        .filter(id => id !== null);

      const fetchedFamilies = await Promise.all(
        productIds.map(async id => {
          const data = await getFamilyOfProduct(id);
          return {
            productId: id,
            family: data.FamillyProduct.nom_famille_produit,
          };
        }),
      );

      const familiesObject = fetchedFamilies.reduce((acc, item) => {
        acc[item.productId] = item.family;
        return acc;
      }, {});

      // famille "Formules" pour les formules
      cart.forEach(item => {
        if (item.type === 'formule') {
          familiesObject[item.productId] = 'Formules';
        }
      });
      const getStore = async () => {
        try {
          const response = await axios.get(
            `${API_BASE_URL}/getOne/${user.userId}`,
          );
          setSelectStore(response.data.storeId);
        } catch (error) {
          console.error(error);
          throw new Error('Erreur lors de la recupération du store');
        }
      };
      getStore();
      setProductFamilies(familiesObject);
    };

    fetchFamilies();
  }, [cart, user.storeId]);

  const createOrder = async orderData => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/createorder`,
        orderData,
      );
      // console.log('response', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la creation de la commande :', error);
    }
  };
  const openStripe = async orderInfo => {
    try {
      const response = await axios.post(`${API_BASE_URL}/checkout_session`, {
        orderInfo,
        platform: Platform.OS,
        isDev: __DEV__,
      });
      const sessionUrl = response.data.session;
      const sessionId = response.data.id;
      setSessionId(sessionId);
      const stripeCheckoutUrl = `${sessionUrl}`;
      setCheckoutSession(stripeCheckoutUrl);
      Linking.openURL(sessionUrl);
      return sessionId;
    } catch (error) {
      console.error("Erreur lors de l'ouverture de la session Stripe :", error);
      return null;
    }
  };
  const checkPaymentStatus = async sessionId => {
    const intervalId = setInterval(async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/paiementStatus?sessionId=${sessionId}`,
        );
        const {status, transactionId, method, orderID} = response.data;
        // retour : response data {"status": "paid", "transactionId": "pi_3NOFjcGnFAjiWNhK0KP6l8Nl"}

        // si status paid - je stop la boucle
        if (status === 'paid') {
          // le countdown passe a null
          countDownNull();
          navigation.navigate('success');
          clearInterval(intervalId);

          // vider le panier
          dispatch(clearCart());

          // mets à jour la colonne freeBaguettePerDay dans la table si offre baguette gratuite

        } else if (status === 'unpaid') {
          // si status unpaid - retour en arriere
          navigation.navigate('cancel');
          clearInterval(intervalId);
          // je reset le countdown
          resetCountdown();

          // annulation de la suppression de la commande (orderId)
          // const deleteResponse = await axios.delete(
          //   `${API_BASE_URL}/deleteOneOrder/${orderID}`,
          // );
        } else {
          console.log(`Status du paiement en attente ou inconnu: ${status}`);
        }
      } catch (error) {
        console.error(
          "Erreur lors de la vérification de l'état du paiement :",
          error,
        );
      }
    }, 5000);
  };

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

      //formater la date chaine de caractère -> format ISO
    // à l'heure 0:00
    const [day, month, year] = selectedDateString.split('/').map(Number);
    const formattedDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
    const dateForDatabase = formattedDate.toISOString();
    // verif si une baguette gratuite à deja était prise pour la date de la commande
    // console.log('date pour la commande', dateForDatabase)
    const checkOffreSUN = await checkIfUserOrderedOffreSUNToday(user.userId, dateForDatabase);

    console.log('offre deja prise ?', checkOffreSUN)

    if (checkOffreSUN) {
      // Vérifier si le panier actuel contient le produit 'offreSUN'
      const offreSUNInCart = cart.some(
        item => item.type_produit === 'offreSUN',
      );

      if (offreSUNInCart) {
        // L'utilisateur a déjà commandé 'offreSUN' aujourd'hui et tente de le commander à nouveau
        return Toast.show({
          type: 'error',
          text1: 'Baguette gratuite déja commandée ...',
          text2: "Reviens demain pour bénéficier de l'offre à nouveau",
        });
      }
    }

    setPaiement(newPaiement);

    dispatch(setProducts(cart));

  
    //prix Sun si collaborateur
    // totalPrice = user.role === 'SUNcollaborateur' ? (totalPrice * 0.80).toFixed(2) : totalPrice;

    //pour ne pas cumuler deux offres
    let adjustedTotalPrice = 0;
    cart.forEach(product => {
      // Utilisez product.prix si c'est une formule, sinon utilisez product.prix_unitaire
      let adjustedPrice =
        product.type === 'formule' ? product.prix : product.prix_unitaire;

      //si pas de produit anti gaspi
      if (user.role === 'SUNcollaborateur' && !product.antigaspi) {
        adjustedPrice *= 0.8;
      }

      adjustedTotalPrice += adjustedPrice * product.qty;
    });

    totalPrice = adjustedTotalPrice.toFixed(2);

    // si présence baguette gratuite  : baguette seule
    // pas de minimum d'achat,
    // je n'ouvre pas stripe
    // je crée la commande
    // je ne fais pas de paiement
    // page de success

    if (totalPrice === '0.00') {
      // Vérifier si le panier contient au moins un produit de type "offreSUN"
      const hasOffreSUN = cart.some(
        produit => produit.type_produit === 'offreSUN',
      );

      if (hasOffreSUN) {
        //console.log("Panier contient 'offreSUN' avec un totalPrice de 0.00");
        // je n'ai que la baguette gratuite ici
        const orderData = {
          cart: cart,
          userRole: user.role,
          firstname_client: user.firstname,
          lastname_client: user.lastname,
          prix_total: totalPrice,
          date: dateForDatabase,
          heure: selectedTime,
          userId: user.userId,
          storeId: selectStore,
          slotId: null,
          promotionId: null,
          // paymentMethod: 'card' ? 'online' : 'onsite',

          products: (() => {
            let products = [];
            let processedProductIds = []; // Pour garder une trace des IDs de produits déjà traités

            cart.forEach(item => {
              // Si l'ID du produit a déjà été traité, sautez ce produit
              //pour eviter les doublons dans le panier
              if (processedProductIds.includes(item.productId)) return;

              if (!item.offre || (item.offre && item.qty < 4)) {
                if (item.productId) {
                  products.push({
                    productId: item.productId,
                    quantity: item.qty,
                    prix_unitaire: item.prix_unitaire,
                  });
                }
              }
            });

            return products;
          })(),
        };

        const createorder = await createOrder(orderData);

        const numero_commande = createorder.numero_commande;
        dispatch(setNumeroCommande(numero_commande));
        const callApi = await axios.get(
          `${API_BASE_URL}/getOneStore/${user.storeId}`,
        );
        // console.log('data', callApi.data);
        const point_de_vente = callApi.data.nom_magasin;

        const res = await axios.post(`${API_BASE_URL}/confirmOrder`, {
          email: emailConfirmOrder,
          firstname: firstnameConfirmOrder,
          numero_commande,
          date: orderData.date,
          point_de_vente,
        });

        cart.forEach(async item => {
          await updateStock(item);
        });

        setLoading(true);

        setTimeout(() => {
          navigation.navigate('success');
          setLoading(false);
        }, 2000);

        return;
      } else {
        return Toast.show({
          type: 'error',
          text1: `Montant inférieur à 50 centimes`,
          text2: `N'hésitez pas à ajouter des articles `,
        });
      }
    } else if (totalPrice < 0.5) {
      return Toast.show({
        type: 'error',
        text1: `Montant inférieur à 50 centimes`,
        text2: `N'hésitez pas à ajouter des articles `,
      });
    } else {
      //remets 20 min sur le countdown pour le paiement
      resetForPaiementCountdown();

      const checkStock = async () => {
        for (const item of cart) {
          if (item.type === 'formule') {
            // Gérer les éléments de formule
            for (let i = 1; i <= 3; i++) {
              const option = item[`option${i}`];
              if (option && option.productId) {
                const isStockAvailable = await checkProductStock(
                  option.productId,
                  option.qty,
                );
                if (!isStockAvailable) return false;
              }
            }
          } else {
            // Gérer les produits standards
            if (!item.antigaspi) {
              const isStockAvailable = await checkProductStock(
                item.productId,
                item.qty,
              );
              if (!isStockAvailable) return false;
            }
          }
        }
        return true; // pas de souci de stock
      };

      const checkProductStock = async (productId, qty) => {
        try {
          const response = await axios.get(
            `${API_BASE_URL}/getStockByProduct/${productId}`,
          );
          const stockInfo = response.data.find(
            stock => stock.productId === productId,
          );
          // console.log('stockInfo', stockInfo);

          if (!stockInfo || stockInfo.quantite < qty) {
            Toast.show({
              type: 'error',
              text1: `Le produit ${stockInfo.libelle} n'est plus disponible`,
              text2: `Victime de son succès, quantité restante: ${
                stockInfo?.quantite ?? 0
              }`,
            });
            return false; // stock insuffisant
          }
          return true; // stock suffisant
        } catch (error) {
          console.error(
            `Erreur lors de la vérification du stock pour le produit ${productId}`,
            error,
          );
          return false;
        }
      };

      // checkStock();
      const stockIsOk = await checkStock();
      // console.log('stockIsOk', stockIsOk)
      if (!stockIsOk) {
        return; // Arrêtez le processus si le stock n'est pas suffisant
      }

      // creation de la commande
      const [day, month, year] = selectedDateString.split('/').map(Number);
      const formattedDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
      const dateForDatabase = formattedDate.toISOString();

      //pour ne pas cumuler deux offres
      let adjustedTotalPrice = 0;
      cart.forEach(product => {
        // Utilisez product.prix si c'est une formule, sinon utilisez product.prix_unitaire
        let adjustedPrice =
          product.type === 'formule' ? product.prix : product.prix_unitaire;

        //si pas de produit anti gaspi
        if (user.role === 'SUNcollaborateur' && !product.antigaspi) {
          adjustedPrice *= 0.8;
        }

        adjustedTotalPrice += adjustedPrice * product.qty;
      });

      totalPrice = adjustedTotalPrice.toFixed(2);
      const orderData = {
        // je veux rajouter le paymentID dans orderData -
        // qui est dans la reponse de la fonction createPaiement: paiement data {"createdAt": "2024-01-06T00:59:24.922Z",
        // "method": "card", "paymentId": 26, "status": "paid", "transactionId": "pi_3OVDcWGnFAjiWNhK0Nv3ym6l", "updatedAt": "2024-01-06T00:59:24.922Z"}
        cart: cart,
        userRole: user.role,
        firstname_client: user.firstname,
        lastname_client: user.lastname,
        prix_total: totalPrice,
        date: dateForDatabase,
        heure: selectedTime,
        userId: user.userId,
        storeId: selectStore,
        slotId: null,
        promotionId: promotionId,
        paymentMethod: 'card' ? 'online' : 'onsite',

        products: (() => {
          let products = [];
          let processedProductIds = []; // Pour garder une trace des IDs de produits déjà traités

          // Traitement des produits fusionnés avec des offres (3+1)
          aggregatedCartItems.forEach(item => {
            const productData = {
              productId: item.productId,
              quantity: item.qty,
              prix_unitaire: item.prix_unitaire,
            };

            if (item.isFree) {
              productData.offre = item.offre;
            }

            products.push(productData);
            processedProductIds.push(item.productId); // Ajoutez l'ID du produit à la liste des produits traités
          });

          cart.forEach(item => {
            // Si l'ID du produit a déjà été traité, sautez ce produit
            //pour eviter les doublons dans le panier
            if (processedProductIds.includes(item.productId)) return;

            // Traitement des produits de type 'formule'
            if (item.type === 'formule') {
              ['option1', 'option2', 'option3'].forEach(option => {
                if (item[option]) {
                  products.push({
                    productId: item[option].productId,
                    quantity: item.qty,
                    formule: item.libelle,
                    category: item[option].categorie,
                  });
                }
              });
            }

            // Traitement des produits réguliers (qui n'ont pas d'offre ou dont l'offre n'a pas été utilisée ou quil y es tune offre, mais c'est un produit antigaspi donc un seul produit)
            else if (!item.offre || (item.offre && item.qty < 4)) {
              if (item.productId) {
                products.push({
                  productId: item.productId,
                  quantity: item.qty,
                  prix_unitaire: item.prix_unitaire,
                });
              }
            }
          });

          return products;
        })(),
      };
      //console.log('orderdata', orderData);
      setCurrentPromoCode(null); // je remets à null l'utilisation des codes promo
      const createorder = await createOrder(orderData);
      //console.log('createOrder', createorder);
      const orderId = createorder.orderId;
      const numero_commande = createorder.numero_commande;

      // 4. je prépare les infos pour stripe : orderinfo
      const info = {
        userRole,
        cart,
        user,
        selectStore,
        totalPrice,
        totalQuantity,
        dateForDatabase,
        paiement,
        orderId,
        numero_commande,
      };
      dispatch(resetPromo());

      // 5. j'envoi ces info pouvrir une session Stripe
      if (paiement === 'online') {
        const sessionId = await openStripe(info);
        // console.log('sessionId handleconfirm', sessionId);

        // 6 . j'attends la validation de paiement - je check le status du paiement
        if (sessionId) {
          checkPaymentStatus(sessionId);
        }
      }
    }
  };

  // Test avec montant fixe et pourcentage
  const handleApplyDiscount = async () => {
    if (currentPromoCode) {
      alert('Un code promo est déjà appliqué à cette commande.');
      return;
    }
    try {
      const response = await axios.post(`${API_BASE_URL}/handleApplyDiscount`, {
        promoCode,
        cartItems: cart,
      });
      const updatedCart = response.data;
      dispatch(updateCart(updatedCart));
      setPromoCode('');
      // Déterminer le type de réduction et la stocker
      const updatedCartItems = response.data;
      const promoInfo = updatedCartItems[0].promo;

      let promoType, promoValue;
      if (promoInfo && promoInfo.percentage != null) {
        promoType = 'percentage';
        promoValue = promoInfo.percentage;
      } else if (promoInfo && promoInfo.fixedAmount != null) {
        promoType = 'fixedAmount';
        promoValue = promoInfo.fixedAmount;
      }
      // ajout du promotionId dans le store redux
      dispatch(addPromo(promoInfo.promotionId));

      setAppliedPromo({code: promoCode, type: promoType, value: promoValue});
      setCurrentPromoCode(promoCode);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // console.log(error.response.data.message);
        return Toast.show({
          type: 'error',
          text1: error.response.data.message,
        });
      } else {
        console.error("Erreur lors de l'application du code promo:", error);
      }
    }
  };

  // Restaurer le prix d'origine
  const handleRemoveDiscount = () => {
    const restoredCart = cart.map(item => ({
      ...item,
      prix_unitaire: item.originalPrice || item.prix_unitaire,
    }));

    dispatch(updateCart(restoredCart));
    setAppliedPromo(null);
    setCurrentPromoCode(null);
    setPromoCode('');
    // retire le promotionId dans le store redux
    dispatch(resetPromo());
  };

  //filtrage si formule ou produits
  const formules = cart.filter(item => item.type === 'formule');
  const produits = cart.filter(item => item.type !== 'formule');

  //Regroupez les articles par offre
  const groupedItems = produits.reduce((accumulator, item) => {
    let key;
    //pour différencier les produits par key
    if (item.offre) {
      key = item.offre;
    } else {
      key = 'product-' + item.productId;
    }

    if (!accumulator[key]) {
      // accumulator[key] = [item];
      accumulator[key] = {
        items: [item],
        freeCount: item.isFree ? 1 : 0,
      };
    } else {
      // accumulator[key].push(item);
      accumulator[key].items.push(item);
      if (item.isFree) accumulator[key].freeCount++;
    }
    return accumulator;
  }, {});

  const groupedItemsArray = Object.values(groupedItems);

  const itemsGroupedByFamily = groupedItemsArray.reduce((acc, group) => {
    if (group.items[0].type !== 'formule') {
      const familyName = productFamilies[group.items[0].productId];
      if (!acc[familyName]) {
        acc[familyName] = [];
      }
      acc[familyName].push(group);
    }
    return acc;
  }, {});

  // useEffect(() => {
  //   if (orderInfo && paiement === 'onsite') {
  //     setLoading(true);
  //     setTimeout(() => {
  //       setLoading(false);
  //       navigation.navigate('success');
  //     }, 3000);
  //   }
  // }, [orderInfo, paiement]);

  const handleSignup = () => {
    navigation.navigate('signup');
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

  useEffect(() => {
    if (countdown === 0) {
      removeCart(cart, countdown, dispatch);
    }
    if (isCartEmpty) {
      countDownNull();
    }
  }, [countdown, cart]);

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
      <SafeAreaProvider
        style={{flex: 1, paddingTop: 50, backgroundColor: colors.color4}}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            backgroundColor: colors.color4,
          }}>
          {loading ? (
            <LottieView
              source={require('../assets/loaderpaiment.json')}
              autoPlay
              loop
              style={{
                width: 300,
                aspectRatio: 300 / 600,
                flexGrow: 1,
                alignSelf: 'center',
              }}
            />
          ) : (
            <>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginVertical: 30,
                  paddingHorizontal: 30,
                  justifyContent: 'space-between',
                  width: '100%',
                }}>
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: 'bold',
                    marginLeft: 10,
                    fontFamily: fonts.font1,
                    color: colors.color1,
                  }}>
                  Votre Panier
                </Text>
                <TouchableOpacity
                  onPress={handleBack}
                  activeOpacity={1}
                  style={{backgroundColor: 'white', borderRadius: 25}}>
                  <ArrowLeft fill={colors.color1} />
                </TouchableOpacity>
              </View>

              <View
                style={{
                  width: '100%',
                  height: 80,
                  backgroundColor: 'white',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  paddingHorizontal: 10,
                }}>
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
                {/* - formules - */}
                {formules.length > 0 && (
                  <Text
                    style={{
                      paddingVertical: 5,
                      fontWeight: 'bold',
                      color: colors.color1,
                    }}>
                    Formules
                  </Text>
                )}

                {formules.map((item, index) => {
                  if (item.type === 'formule') {
                    return (
                      <View
                        key={item.id}
                        style={{
                          backgroundColor: 'white',
                          borderRadius: 10,
                          marginVertical: 5,
                        }}>
                        <CardItemFormule
                          option1={item.option1}
                          option2={item.option2}
                          option3={item.option3}
                          prix_unitaire={item.prix}
                          incrementhandler={() =>
                            incrementhandler(
                              item.productIds,
                              item.offre,
                              'formule',
                              item,
                            )
                          }
                          decrementhandler={() =>
                            decrementhandler('formule', item.id, item, dispatch)
                          }
                          removehandler={() =>
                            removehandler(
                              'formule',
                              item.id,
                              item,
                              dispatch,
                              item.qty,
                            )
                          }
                          image={item.formuleImage}
                          qty={item.qty}
                          title={item.libelle}
                          // key={item.id}
                        />
                      </View>
                    );
                  }
                })}

                {/* - produits seuls ou avec offre - */}
                {Object.entries(itemsGroupedByFamily).map(
                  ([familyName, items], index) => {
                    // console.log('Famille:', familyName); // Affiche la famille actuelle
                    // console.log('Items:', items);
                    return (
                      <View key={familyName}>
                        <Text
                          style={{
                            paddingVertical: 5,
                            fontWeight: 'bold',
                            color: colors.color1,
                          }}>
                          {familyName}
                        </Text>
                        {items.map((group, groupIndex) => {
                          // console.log('group', group)

                          const consolidatedItems = group.items.reduce(
                            (acc, item) => {
                              // Clé unique pour chaque combinaison de produit et offre.
                              const key = `${item.productId}_${item.offre}_${item.type}`;
                              if (!acc[key]) {
                                // Si c'est le premier item de ce type, l'initialiser.
                                acc[key] = {
                                  ...item,
                                  qty: 0,
                                  totalFree: 0,
                                  totalPrice: 0,
                                };
                              }
                              // Ajouter la quantité de cet item à la quantité totale.
                              acc[key].qty += item.qty;
                              // S'assurer que le prix total est correct (quantité totale * prix unitaire).
                              // acc[key].prix_unitaire = item.prix_unitaire;
                              if (item.prix_unitaire > 0) {
                                acc[key].totalPrice +=
                                  item.prix_unitaire * item.qty;
                              }
                              // Comptez le nombre d'items gratuits.
                              if (item.prix_unitaire === 0) {
                                acc[key].totalFree += item.qty;
                              }
                              return acc;
                            },
                            {},
                          );

                          // On transforme ensuite l'objet en tableau pour le rendu.
                          // const consolidatedItemsArray = Object.values(consolidatedItems);
                          const consolidatedItemsArray = Object.values(
                            consolidatedItems,
                          ).map(item => {
                            const nonFreeQty = item.qty - item.totalFree; // Calculer la quantité d'éléments non gratuits.
                            return {
                              ...item,
                              // Diviser le prix total par la quantité d'éléments non gratuits pour obtenir le prix_unitaire moyen.
                              prix_unitaire:
                                nonFreeQty > 0
                                  ? item.totalPrice / nonFreeQty
                                  : 0,
                            };
                          });

                          return (
                            <View key={groupIndex}>
                              {consolidatedItemsArray.map((item, itemIndex) => {
                                // console.log('Item:', item);
                                const qty = item.qty;
                                const itemKey = `item-${item.productId}-${itemIndex}-${item.type}`;
                                if (item.type === 'antigaspi') {
                                  return (
                                    <CartItemAntigaspi
                                      key={itemKey}
                                      libelle={item.libelle}
                                      prix_unitaire={item.prix_unitaire}
                                      qty={qty}
                                      removehandler={() =>
                                        removehandler(
                                          'antigaspi',
                                          item.productId,
                                          group,
                                          dispatch,
                                          qty,
                                        )
                                      }
                                      index={index}
                                      isFree={item.isFree}
                                      freeCount={item.totalFree}
                                    />
                                  );
                                } else if (item.type === 'product') {
                                  // console.log('item cardItem', item)
                                  return (
                                    <CartItem
                                      key={itemKey}
                                      libelle={item.libelle}
                                      prix_unitaire={item.prix_unitaire}
                                      qty={qty}
                                      incrementhandler={() =>
                                        incrementhandler(
                                          item.productId,
                                          item.offre,
                                          'product',
                                          item,
                                        )
                                      }
                                      decrementhandler={() =>
                                        decrementhandler(
                                          'product',
                                          item.productId,
                                          group,
                                          dispatch,
                                        )
                                      }
                                      removehandler={() =>
                                        removehandler(
                                          'product',
                                          item.productId,
                                          group,
                                          dispatch,
                                          item.qty,
                                        )
                                      }
                                      index={index}
                                      isFree={item.isFree}
                                      // isFree={item.isFree}
                                      freeCount={item.totalFree}
                                    />
                                  );
                                } else if (item.type === 'offreSUN') {
                                  return (
                                    <CartItemSUN
                                      key={itemKey}
                                      libelle={item.libelle}
                                      qty={qty}
                                      removehandler={() =>
                                        removehandler(
                                          'offreSUN',
                                          item.productId,
                                          group,
                                          dispatch,
                                          item.qty,
                                        )
                                      }
                                    />
                                  );
                                } else if (item.type === 'petitepizza') {
                                  return (
                                    <CartItem
                                      key={itemKey}
                                      libelle={item.libelle}
                                      prix_unitaire={item.prix_unitaire}
                                      qty={qty}
                                      incrementhandler={() =>
                                        incrementhandler(
                                          item.productId,
                                          item.offre,
                                          'petitepizza',
                                          item,
                                        )
                                      }
                                      decrementhandler={() =>
                                        decrementhandler(
                                          'petitepizza',
                                          item.productId,
                                          group,
                                          dispatch,
                                        )
                                      }
                                      removehandler={() =>
                                        removehandler(
                                          'petitepizza',
                                          item.productId,
                                          group,
                                          dispatch,
                                          item.qty,
                                        )
                                      }
                                      index={index}
                                      isFree={item.isFree}
                                      // isFree={item.isFree}
                                      freeCount={item.totalFree}
                                    />
                                  );
                                } else {
                                  return null;
                                }
                              })}
                            </View>
                          );
                        })}
                      </View>
                    );
                  },
                )}
                {/* partie code promo à revoir */}
                <View
                  style={{
                    width: '100%',
                    marginVertical: 15,
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 10,
                      justifyContent: 'center',
                      marginVertical: 10,
                    }}>
                    <TextInput
                      value={promoCode}
                      onChangeText={value => setPromoCode(value)}
                      placeholder="Code promo"
                      style={{
                        width: 150,
                        borderWidth: 1,
                        borderColor: colors.color3,
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                        borderRadius: 5,
                        color: colors.color1,
                        fontWeight: 'bold',
                        fontSize: 14,
                        textAlignVertical: 'center',
                        backgroundColor: colors.color6,
                      }}
                    />
                    <TouchableOpacity
                      onPress={handleApplyDiscount}
                      disabled={isCartEmpty}>
                      <ApplyCode
                        color={isCartEmpty ? colors.color3 : colors.color9}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={handleRemoveDiscount}
                      disabled={isCartEmpty}>
                      <DeleteCode
                        color={isCartEmpty ? colors.color3 : colors.color5}
                      />
                    </TouchableOpacity>
                  </View>
                  {appliedPromo && !isCartEmpty && (
                    <Text style={{color: colors.color2, fontSize: 12}}>
                      Réduction de{' '}
                      {appliedPromo.type === 'percentage'
                        ? `${appliedPromo.value}%`
                        : `${appliedPromo.value}€`}{' '}
                      sur votre panier
                    </Text>
                  )}
                  <View>
                    {erreurCodePromo && promoCode && (
                      <Text style={{color: colors.color8}}>
                        Code promo non valide !
                      </Text>
                    )}
                    {erreurCodePromoUsed && promoCode && (
                      <Text style={{color: colors.color8}}>
                        Code promo déja utilisé !{' '}
                      </Text>
                    )}
                  </View>
                </View>
              </ScrollView>

              {!isCartEmpty && (
                <View style={style.contentGlobal}>
                  <View style={style.contentCountDown}>
                    <Text style={style.countDown}>
                      Délai du panier: {formatCountdown(countdown)}
                    </Text>
                  </View>
                </View>
              )}

              <View
                style={[
                  style.menu,
                  Platform.OS === 'android' && style.androidMenu,
                ]}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: 20,
                  }}>
                  <View>
                    <Text style={{fontWeight: 'bold', color: colors.color1}}>
                      Votre total
                    </Text>
                    {cart.length !== 1 || antigaspiProductsCount !== 1 ? (
                      <Text style={{color: colors.color2}}>
                        Total Avec
                        <Image
                          source={require('../assets/sun.jpg')}
                          style={{width: 50, height: 20, resizeMode: 'contain'}}
                        />
                      </Text>
                    ) : null}
                  </View>
                  <View
                    style={{
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      alignItems: 'flex-end',
                      marginRight: 10,
                    }}>
                    <Text style={{color: colors.color1}}>
                      {totalPrice.toFixed(2)}€
                    </Text>
                    {cart.length !== 1 || antigaspiProductsCount !== 1 ? (
                      <Text style={{color: colors.color2, fontWeight: 'bold'}}>
                        {totalPriceCollab.toFixed(2)}€
                      </Text>
                    ) : null}
                  </View>
                </View>
                <View>
                  {user.role == 'invite' ? (
                    <View style={{width: 180, gap: 5}}>
                      <TouchableOpacity
                        style={stylesInvite.btn}
                        onPress={handleSignup}>
                        <Svg
                          width="17"
                          height="17"
                          viewBox="0 0 17 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg">
                          <Path
                            d="M8.5 8C10.7091 8 12.5 6.20914 12.5 4C12.5 1.79086 10.7091 0 8.5 0C6.29086 0 4.5 1.79086 4.5 4C4.5 6.20914 6.29086 8 8.5 8Z"
                            fill="#ECECEC"
                          />
                          <Path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M13 20C11.35 20 10.525 20 10.013 19.487C9.5 18.975 9.5 18.15 9.5 16.5C9.5 14.85 9.5 14.025 10.013 13.513C10.525 13 11.35 13 13 13C14.65 13 15.475 13 15.987 13.513C16.5 14.025 16.5 14.85 16.5 16.5C16.5 18.15 16.5 18.975 15.987 19.487C15.475 20 14.65 20 13 20ZM13.583 14.944C13.583 14.7894 13.5216 14.6411 13.4122 14.5318C13.3029 14.4224 13.1546 14.361 13 14.361C12.8454 14.361 12.6971 14.4224 12.5878 14.5318C12.4784 14.6411 12.417 14.7894 12.417 14.944V15.917H11.444C11.2894 15.917 11.1411 15.9784 11.0318 16.0878C10.9224 16.1971 10.861 16.3454 10.861 16.5C10.861 16.6546 10.9224 16.8029 11.0318 16.9122C11.1411 17.0216 11.2894 17.083 11.444 17.083H12.417V18.056C12.417 18.2106 12.4784 18.3589 12.5878 18.4682C12.6971 18.5776 12.8454 18.639 13 18.639C13.1546 18.639 13.3029 18.5776 13.4122 18.4682C13.5216 18.3589 13.583 18.2106 13.583 18.056V17.083H14.556C14.7106 17.083 14.8589 17.0216 14.9682 16.9122C15.0776 16.8029 15.139 16.6546 15.139 16.5C15.139 16.3454 15.0776 16.1971 14.9682 16.0878C14.8589 15.9784 14.7106 15.917 14.556 15.917H13.583V14.944Z"
                            fill="#ECECEC"
                          />
                          <Path
                            d="M12.178 11.503C11.705 11.508 11.264 11.526 10.88 11.577C10.237 11.664 9.533 11.87 8.952 12.452C8.37 13.033 8.164 13.737 8.078 14.38C8 14.958 8 15.664 8 16.414V16.586C8 17.336 8 18.042 8.078 18.62C8.138 19.071 8.258 19.552 8.525 20H8.5C0.5 20 0.5 17.985 0.5 15.5C0.5 13.015 4.082 11 8.5 11C9.826 11 11.077 11.181 12.178 11.503Z"
                            fill="#ECECEC"
                          />
                        </Svg>
                        <Text style={stylesInvite.textBtn}>Inscription</Text>
                      </TouchableOpacity>
                      <Text style={{fontSize: 11}}>
                        Inscrivez vous pour commander et profiter de tout les
                        avantages !
                      </Text>
                    </View>
                  ) : (
                    <View style={{gap: 10}}>
                      {/* <TouchableOpacity
                        onPress={() => handleConfirm('onsite')}
                        style={{
                          ...style.btnPaiement,
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-around',
                        }}>
                        <Image
                          source={require('../assets/paiementsurplace.png')}
                          style={{width: 20, height: 20, resizeMode: 'contain'}}
                        />
                        <Text
                          style={{
                            color: colors.color6,
                            fontFamily: fonts.font3,
                          }}>
                          {' '}
                          Sur place
                        </Text>
                      </TouchableOpacity> */}
                      <TouchableOpacity
                        onPress={() => handleConfirm('online')}
                        style={{
                          ...style.btnPaiement,
                          // backgroundColor: colors.color3,
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-around',
                        }}>
                        <CardPaiement />
                        <Text
                          style={{
                            color: colors.color6,
                            fontFamily: fonts.font3,
                            fontWeight: 'bold',
                            fontSize: 14,
                          }}>
                          {' '}
                          En ligne
                        </Text>
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
