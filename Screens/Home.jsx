import {
  View,
  Text,
  Pressable,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  StyleSheet,
} from 'react-native';
import {fonts, colors} from '../styles/styles';
import {styles} from '../styles/home';
import React, {
  useState,
  useEffect,
  createRef,
  useRef,
  useCallback,
} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {linkFromSUN, updateUser} from '../reducers/authSlice';
import {getCart} from '../reducers/cartSlice';

import axios from 'axios';
import FooterProfile from '../components/FooterProfile';
import FormulesSalees from '../components/FormulesSalees';
import FormulesPetitDejeuner from '../components/FormulesPetitDejeuner';
import LinkOffres from '../components/LinkOffres';
import EnvieSalee from '../components/EnvieSalee';
import Catalogue from '../components/Catalogue';
import StorePicker from '../components/StorePicker';
import CustomDatePicker from '../components/CustomDatePicker';
import ArrowDown from '../SVG/ArrowDown';
import LoaderHome from './LoaderHome';
import SearchModal from '../components/SearchModal';
// import {API_BASE_URL} from '@env';
import {API_BASE_URL} from '../config';
import Search from '../SVG/Search';
import ProductFlatList from '../components/ProductFlatList';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import LogoFond from '../SVG/LogoFond';
import {useRoute, useFocusEffect} from '@react-navigation/native';
import {
  getAllStores,
  fetchAllProductsClickandCollect,
  fetchAllProductsClickAndCollect,
  getPrefCommande,
  getStatusSUN,
  checkIfUserOrderedOffreSUNToday,
} from '../CallApi/api';
import ModaleOffreSUN from '../components/ModaleOffreSUN';
import ModaleModifProfile from '../components/ModaleModifProfile';
import FastImage from 'react-native-fast-image';
import Location from '../SVG/Location';

import Picker from 'react-native-picker-select';
import SelectDropdown from 'react-native-select-dropdown';
import { formatToDateISO } from '../Fonctions/fonctions';

const Home = ({navigation}) => {
  // console.log('lancement de la page home')
  const [stores, setStores] = useState([]);
  const [role, setRole] = useState('');
  const [selectedOnglet, setSelectedOnglet] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [visible, setVisible] = useState(false);
  const [positionsY, setPositionsY] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isManualScrolling, setIsManualScrolling] = useState(false);
  const [isModalSunVisible, setIsModalSunVisible] = useState(false);
  const [cartLoaded, setCartLoaded] = useState(false); // Flag pour indiquer que le panier est chargé
  const [hasSeenOffer, setHasSeenOffer] = useState(false); // Flag pour éviter les réaffichages
  const [hasOrderedOffreSun, setHasOrderedOffreSun] = useState(false);
  const [isModalProfileVisible, setIsModalProfileVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isPref, setIsPref] = useState(null);
  const [orders, setOrders] = useState([]);
  const [readyOrders, setReadyOrders] = useState([]);
  const [selectedStoreDetails, setSelectedStoreDetails] = useState({});

  const user = useSelector(state => state.auth.user);
  const cart = useSelector(state => state.cart.cart);
  const dispatch = useDispatch();

  // Chargement de la date du lendemain pour vérifier les commande passées
  const getTomorrowISODate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1); // J+1
    return tomorrow.toISOString().split('T')[0]; // On prend juste la date sans l'heure
  };
  

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true); // Activer le loader au début

      try {
        // Définir les promesses pour les différentes données à charger
        const productsPromise = fetchAllProductsClickandCollect();
        const storesPromise = getAllStores();

        // Chargement du panier
        await dispatch(getCart(user.userId));
        setCartLoaded(true);

        //const delayPromise = new Promise(resolve => setTimeout(resolve, 5000));

        // Attendre que toutes les données soient chargées en parallèle
        const [products, stores] = await Promise.all([productsPromise, storesPromise]);

        const updatedProducts = products.map(product => ({
          ...product,
          qty: 0,
        }));

        setProducts(updatedProducts);
        setCategories([
          ...new Set(updatedProducts.map(product => product.categorie)),
          'Tous',
        ]);
        setStores(stores);
      } catch (error) {
        console.error(
          'Erreur lors du chargement des données initiales:',
          error,
        );
      }

      const delay = 3000;
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, delay);

      return () => {
        clearTimeout(timer);
      };
    };

    loadInitialData();
  }, [dispatch, user.userId]);

  useEffect(() => {
    if (user && user.role) {
      axios
        .post(`${API_BASE_URL}/getStore`, {
          role: user.role,
          storeId: user.storeId,
        })
        .then(response => {
          if (response.data.stores) {
            setStores(response.data.stores);
          }
          if (response.data.selectedStore) {
            setSelectedStoreDetails(response.data.selectedStore);
          }
        })
        .catch(error => {
          console.error('Erreur lors de la récupération des données :', error);
        });
    }
  }, [user.role, user.storeId]);

  useEffect(()=>{
    const checkOffreSun = async () => {

      // Verification de la consommation de l'offre SUN avant presentation de la modale
      const checkFreeOrderToday = await checkIfUserOrderedOffreSUNToday(
        user.userId,
        getTomorrowISODate()
      );

      // on vient setter le state en fonction de si oui ou non l'utilisateur à déja utilisé l'offre SUN
      setHasOrderedOffreSun(checkFreeOrderToday);
      
      if(!cartLoaded || hasSeenOffer || checkFreeOrderToday) return; // on affiche pas l'offre si le panier n'est pas chargé

      const isOffreSunInCart = cart.some((item) => item.typeProduit === "offreSUN" );

      if(!isOffreSunInCart){
        const allProductClickandCollect = await fetchAllProductsClickAndCollect();
        const offreSunProduct = allProductClickandCollect.find(
          (product) => product.type_produit === "offreSUN"
        );
        setSelectedProduct(offreSunProduct);
        setIsModalSunVisible(true)
      }
      setHasSeenOffer(true);
    };
    checkOffreSun();
  }, [cartLoaded, cart, hasSeenOffer]);

  const route = useRoute();

  // a revoir
  const totalPrice = Number(
    cart
      .reduce((total, item) => {
        const prix = item.unitPrice;
        return total + item.quantity * prix;
      }, 0)
      .toFixed(2),
  );

  const scrollViewRef = createRef();
  const horizontalScrollViewRef = useRef(null);

  //retour en haut de page au click sur bouton Home
  useFocusEffect(
    React.useCallback(() => {
      if (route.params?.shouldScrollToTop) {
        scrollToTop();
      }
      if (route.params?.shouldScrollToTop) {
        route.params.shouldScrollToTop = false;
      }
    }, [route.params?.shouldScrollToTop]),
  );

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/getOne/${user.userId}`)
      .then(response => {
        const role = response.data.role;
        setRole(role);
        dispatch(updateUser(response.data));
      })
      .catch(error => {
        console.log(
          "Erreur lors de la récupération du rôle de l'utilisateur page Home:",
          error,
        );
      });
  }, []);

  //redirection vers la page de détails
  const handleProductPress = product => {
    navigation.navigate('details', {product});
  };

  //search
  const handleSearch = query => {
    setSearchQuery(query);

    const filtered = products.filter(product =>
      product.libelle
        ? product.libelle.toLowerCase().includes(query.toLowerCase())
        : false,
    );

    setFilteredProducts(filtered);
  };

  const handleSelectProduct = product => {
    setIsModalVisible(false);
    navigation.navigate('details', {product});
  };

  //classement par catégories
  // const groupedAndSortedProducts = filteredProducts.reduce((acc, cur) => {
  const groupedAndSortedProducts = products.reduce((acc, cur) => {
    (acc[cur.categorie] = acc[cur.categorie] || []).push(cur);
    return acc;
  }, {});

  const sortedCategories = Object.keys(groupedAndSortedProducts).sort();


  //scrolltop
  const scrollToTop = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({x: 0, y: 0, animated: true});
    }
    if (horizontalScrollViewRef.current) {
      horizontalScrollViewRef.current.scrollTo({x: 0, y: 0, animated: true});
    }
  };

  //contenu visible
  const toggleVisibility = () => {
    setVisible(!visible);
  };

  //liste d'onglets differents si collab ou non
  const refs = {
    Promos: useRef(null),
    Baguettes: useRef(null),
    Viennoiseries: useRef(null),
    Formules: useRef(null),
    'Produits Salés': useRef(null),
    'Plats Chauds': useRef(null),
    Pâtisseries: useRef(null),
    'Boules et Pains Spéciaux': useRef(null),
    'Petits déjeuners': useRef(null),
    Tartes: useRef(null),
    Boissons: useRef(null),
    // 'Tarterie': useRef(null),
  };

  const onglets = Object.keys(refs);

  const handleLayout = useCallback(
    onglet => event => {
      const {y} = event.nativeEvent.layout;
      setPositionsY(prev => ({...prev, [onglet]: y}));
    },
    [],
  );

  const ongletButtonHandler = onglet => {
    setIsManualScrolling(true);
    setSelectedOnglet(onglet);

    const positionY = positionsY[onglet];
    if (scrollViewRef.current && positionY !== undefined) {
      scrollViewRef.current.scrollTo({x: 0, y: positionY, animated: true});
    }
    setTimeout(() => {
      setIsManualScrolling(false);
    }, 1500);

    // // Pour déplacer l'onglet actif vers la gauche de l'écran

    const tabIndex = onglets.indexOf(onglet);
    const tabWidth = 170; // Remplacez par la largeur de vos onglets si elle est constante
    const positionX = tabIndex * tabWidth;
    horizontalScrollViewRef.current?.scrollTo({x: positionX, animated: true});
  };

  const handleScroll = event => {
    if (isManualScrolling) return; // Ignorez les mises à jour si un défilement manuel est en cours

    const paddingTop = 50;
    const scrollY = event.nativeEvent.contentOffset.y + paddingTop;

    let currentOnglet = null;

    // Parcourez les positionsY pour déterminer l'onglet actuellement visible
    for (let i = 0; i < onglets.length; i++) {
      const onglet = onglets[i];
      const nextOnglet = onglets[i + 1];

      if (
        scrollY >= positionsY[onglet] &&
        (!nextOnglet || scrollY < positionsY[nextOnglet])
      ) {
        currentOnglet = onglet;
        break;
      }
    }

    // Si l'onglet actuellement visible est différent de l'onglet sélectionné, mettez à jour
    if (currentOnglet && currentOnglet !== selectedOnglet) {
      setSelectedOnglet(currentOnglet);

      // Déplacez l'onglet actif vers la gauche de l'écran
      const tabIndex = onglets.indexOf(currentOnglet);
      const tabWidth = 170;
      const positionX = tabIndex * tabWidth;
      horizontalScrollViewRef.current?.scrollTo({x: positionX, animated: true});
    }
  };

  //fin scroll onglets

  //appel des produits categories
  
  const renderCategoryProducts = categoryName => {
    const categoryProducts = groupedAndSortedProducts[categoryName];
    let sortedProducts = categoryProducts;
    if (categoryName === 'Baguettes') {
      // je n'affiche pas la baguette gratuite
      sortedProducts = sortedProducts.filter(
        product => product.type_produit !== 'offreSUN',
      );
    }
    //Monster et redbull en dernier sur la liste des boissons
    if (categoryName === 'Boissons') {
      sortedProducts = [...categoryProducts].sort((a, b) =>
        a.libelle === 'Monster' || a.libelle === 'Redbull'
          ? 1
          : b.libelle === 'Monster' || b.libelle === 'Redbull'
          ? -1
          : 0,
      );
    }
    if (categoryName === 'Pâtisseries') {
      const dessertProducts = groupedAndSortedProducts['Desserts'] || [];
      sortedProducts = [...sortedProducts, ...dessertProducts];
    }
    //si la catégorie est "Pâtisseries" je souhaite également ajouter les produits de la catégorie "Desserts"
    return (
      // categoryProducts &&
      sortedProducts && (
        <View
          key={categoryName}
          onLayout={handleLayout(categoryName)}
          style={styles.paddingProduct}>
          <ProductFlatList
            category={categoryName}
            products={sortedProducts}
            handleProductPress={handleProductPress}
          />
        </View>
      )
    );
  };

  return (
    <>
      <View style={{flex: 1}}>
        {isLoading ? (
          <LoaderHome />
        ) : (
          <SafeAreaProvider
            style={{flex: 1, paddingTop: 50, backgroundColor: colors.color4}}>
            <ScrollView
              vertical={true}
              style={{flex: 1, backgroundColor: colors.color4}}
              ref={scrollViewRef}
              stickyHeaderIndices={[1]}
              onScroll={handleScroll}
              scrollEventThrottle={16}>
              <View>
                <View style={styles.bandeau}>
                  <View style={{flexDirection: 'row'}}>
                    {user && (
                      <View
                        style={{
                          paddingVertical: 20,
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-around',
                          width: '100%',
                        }}>
                        <View>
                          <Text
                            style={{
                              fontFamily: fonts.font1,
                              fontSize: 32,
                              color: colors.color1,
                            }}>
                            Bonjour{' '}
                          </Text>
                          <Text
                            style={{
                              fontSize: 18,
                              fontFamily: fonts.font2,
                              color: colors.color1,
                              fontWeight: '700',
                            }}>
                            {user.firstname}
                          </Text>
                        </View>

                        {/* Connexion SUN */}
                        {/* <TouchableOpacity
                          onPress={() => {
                            if (status === 'en attente sun') {
                              navigation.navigate('sunconnect');
                            } else {
                              navigation.navigate('pdjconnect');
                            }
                          }}
                          activeOpacity={0.8}
                          style={{
                            backgroundColor: colors.color6,
                            borderRadius: 50,
                            width: 50,
                            height: 50,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <>
                            {badgeStyle && (
                              <Badge size={18} style={badgeStyle}></Badge>
                            )}
                          </>
                          <FastImage
                            source={require('../assets/start_union.jpg')}
                            style={{width: 30, height: 30, resizeMode: 'cover'}}
                          />
                        </TouchableOpacity> */}

                        {/* SearchBar */}
                        <TouchableOpacity
                          onPress={() => setIsModalVisible(true)}
                          activeOpacity={0.8}
                          style={{
                            backgroundColor: colors.color3,
                            borderRadius: 50,
                            width: 50,
                            height: 50,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Search colors={colors.color2} />
                        </TouchableOpacity>

                        <SearchModal
                          isVisible={isModalVisible}
                          products={filteredProducts}
                          onSelectProduct={handleSelectProduct}
                          onClose={() => setIsModalVisible(false)}
                          handleSearch={handleSearch}
                          searchQuery={searchQuery}
                        />
                      </View>
                    )}
                  </View>
                </View>

                {/*  bandeau header */}
                <View
                  style={{
                    width: '100%',
                    height: 80,
                    backgroundColor: 'white',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  {/* <View style={{ flexDirection:'row', alignItems:'center',justifyContent:'center', width:"100%"}}> */}

                  <View>
                    {/* <StorePicker /> */}
                    <View
                      style={{
                        width: 160,
                        height: 80,
                        backgroundColor: 'white',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <View style={{flexDirection: 'column'}}>
                        {user.role == 'SUNcollaborateur' && (
                          <View
                            style={{
                              flexDirection: 'row',
                              gap: 5,
                              alignItems: 'center',
                              justifyContent: 'center',
                              paddingBottom: Platform.OS === 'ios' ? 8 : 0,
                            }}>
                            <Location />
                            <Text
                              style={{
                                ...styles.textPickerDate,
                                textAlign: 'center',
                              }}>
                              Livraison
                            </Text>
                          </View>
                        )}
                        {Platform.OS === 'android' ? (
                          <SelectDropdown
                            key={selectedStoreDetails.nom_magasin}
                            data={stores.map(store => store.nom_magasin)}
                            onSelect={(selectedItem, index) => {
                              const selected = stores.find(
                                store => store.nom_magasin === selectedItem,
                              );
                              if (selected) {
                                dispatch(
                                  updateUser({
                                    ...user,
                                    storeId: selected.storeId,
                                  }),
                                );
                                // dispatch(updateSelectedStore(selected));
                                setSelectedStoreDetails(selected);
                                axios
                                  .put(
                                    `${API_BASE_URL}/updateOneUser/${user.userId}`,
                                    {storeId: selected.storeId},
                                  )
                                  .then(response => {
                                    // console.log('Le choix du magasin a été mis à jour avec succès dans la base de données');
                                  })
                                  .catch(error => {
                                    console.error(
                                      'Erreur lors de la mise à jour du choix du magasin dans la base de données - erreur ici:',
                                      error,
                                    );
                                  });
                              } else {
                                console.log(
                                  'pas de magasin sélectionné encore',
                                );
                              }
                            }}
                            buttonTextAfterSelection={(selectedItem, index) => {
                              // text represented after item is selected
                              // if data array is an array of objects then return selectedItem.property to render after item is selected
                              return selectedItem;
                            }}
                            rowTextForSelection={(item, index) => {
                              // text represented for each item in dropdown
                              // if data array is an array of objects then return item.property to represent item in dropdown
                              return item;
                            }}
                            buttonStyle={{
                              backgroundColor: 'transparent',
                              width: 160,
                              height: 30,
                              padding: 0,
                            }}
                            buttonTextStyle={{
                              fontSize: 10,
                              fontWeight: 700,
                              color: colors.color2,
                              padding: 0,
                            }}
                            // defaultButtonText={selectedStore.nom_magasin}
                            defaultButtonText={
                              selectedStoreDetails
                                ? selectedStoreDetails.nom_magasin
                                : 'faites votre choix'
                            }
                            rowTextStyle={{fontSize: 10}}
                            // rowStyle={{width:20}}
                          />
                        ) : (
                          <Picker
                            placeholder={{
                              label: 'Choisissez un magasin',
                            }}
                            value={selectedStoreDetails.nom_magasin}
                            // value={selectedStore.nom_magasin}
                            onValueChange={value => {
                              const selected = stores.find(
                                store => store.nom_magasin === value,
                              );

                              if (selected) {
                                // dispatch(updateSelectedStore(selected));
                                dispatch(
                                  updateUser({
                                    ...user,
                                    storeId: selected.storeId,
                                  }),
                                );
                                setSelectedStoreDetails(selected);
                                axios
                                  .put(
                                    `${API_BASE_URL}/updateOneUser/${user.userId}`,
                                    {storeId: selected.storeId},
                                  )
                                  .then(response => {
                                    // console.log('Le choix du magasin a été mis à jour avec succès dans la base de données');
                                  })
                                  .catch(error => {
                                    console.error(
                                      'Erreur lors de la mise à jour du choix du magasin dans la base de données (ici) - erreur ici:',
                                      error,
                                    );
                                  });
                              } else {
                                // console.log('pas de magasin selectionné encore')
                              }
                            }}
                            items={stores.map(store => ({
                              label: store.nom_magasin,
                              value: store.nom_magasin,
                            }))}
                            style={pickerSelectStyles}
                            doneText="OK"
                          />
                        )}

                        {user.role == 'client' ||
                          (user.role == 'invite' && (
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                              }}>
                              <View>
                                <Text
                                  style={{
                                    fontSize: 10,
                                    color: colors.color1,
                                    width: 130,
                                  }}>
                                  {selectedStoreDetails.adresse_magasin}
                                </Text>
                                <Text
                                  style={{fontSize: 10, color: colors.color1}}>
                                  {selectedStoreDetails.cp_magasin}{' '}
                                  {selectedStoreDetails.ville_magasin}
                                </Text>
                              </View>
                            </View>
                          ))}
                      </View>
                    </View>
                  </View>

                  <View>
                    <CustomDatePicker />
                  </View>

                  <View
                    style={{backgroundColor: 'white', marginHorizontal: 30}}>
                    <TouchableOpacity
                      onPress={toggleVisibility}
                      activeOpacity={1}>
                      <ArrowDown />
                    </TouchableOpacity>
                  </View>
                  {/* </View> */}
                </View>
                {visible && (
                  <View
                    style={{
                      width: '100%',
                      height: 'auto',
                      backgroundColor: 'white',
                      flexDirection: 'column',
                      paddingHorizontal: 25,
                      borderBottomLeftRadius: 10,
                      borderBottomRightRadius: 10,
                      paddingVertical: 10,
                    }}>
                    <Text style={{fontWeight: 'bold', color: colors.color1}}>
                      Vos articles:
                    </Text>
                    {cart.map((item, index) => (
                      <View key={index} style={{paddingLeft: 20}}>
                        <Text style={{color: colors.color1, fontSize: 12}}>
                          {' '}
                          {item.quantity} x {item.product || item.libelle} à{' '}
                          {item.unitPrice}€
                        </Text>
                      </View>
                    ))}
                    <Text
                      style={{
                        fontWeight: 'bold',
                        paddingVertical: 10,
                        color: colors.color1,
                      }}>
                      Votre total: {totalPrice}€
                    </Text>
                  </View>
                )}
              </View>

              {/* onglet ancres */}
              <View style={styles.categories}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  ref={horizontalScrollViewRef}>
                  {onglets.map((item, index) => (
                    <Pressable
                      title="button"
                      style={({pressed}) => [
                        styles.btn_categorie,
                        {
                          backgroundColor:
                            item === 'Promos'
                              ? colors.color2
                              : item === selectedOnglet
                              ? colors.color1
                              : 'white',
                          shadowColor: pressed
                            ? 'rgba(233, 82, 14, 0.5)'
                            : 'rgba(0, 0, 0, 0.3)',
                        },
                      ]}
                      key={index}
                      onPress={() => ongletButtonHandler(item)}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 6,
                        }}>
                        <Text
                          style={{
                            fontSize: 15,
                            fontFamily: fonts.font2,
                            fontWeight: '700',
                            textAlign: 'center',
                            color:
                              item === 'Promos'
                                ? colors.color6
                                : item === selectedOnglet
                                ? colors.color6
                                : colors.color1,
                          }}>
                          {item}
                        </Text>

                        {item === 'Promos' && (
                          <Image
                            source={require('../assets/promos.png')}
                            style={{width: 15, height: 15, resizeMode: 'cover'}}
                          />
                        )}
                      </View>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>

              {/* 1er logo */}
              <View
                style={{
                  position: 'absolute',
                  top: '10%',
                  left: '10%',
                  transform: [{translateX: -50}, {translateY: +60}],
                  zIndex: -1,
                }}>
                <LogoFond color={colors.color6} />
              </View>
              {/* 2e logo */}
              <View
                style={{
                  position: 'absolute',
                  top: '10%',
                  right: '10%',
                  transform: [{translateX: +150}, {translateY: +1000}],
                  zIndex: -1,
                }}>
                <LogoFond color={colors.color6} />
              </View>
              {/* 3e logo */}
              <View
                style={{
                  position: 'absolute',
                  top: '10%',
                  left: '10%',
                  transform: [{translateX: -200}, {translateY: +1700}],
                  zIndex: -1,
                }}>
                <LogoFond color={colors.color6} />
              </View>
              {/* 4e logo */}
              <View
                style={{
                  position: 'absolute',
                  top: '10%',
                  left: '10%',
                  transform: [{translateX: +100}, {translateY: +2250}],
                  zIndex: -1,
                }}>
                <LogoFond color={colors.color6} />
              </View>

              {/* link - anti gaspi -  */}
              <View
                onLayout={handleLayout('Promos')}
                style={styles.paddingProduct}>
                <LinkOffres hasOrderedOffreSun={hasOrderedOffreSun}/>
              </View>

              {renderCategoryProducts('Baguettes')}
              {renderCategoryProducts('Viennoiseries')}

              {/* fait ralentir la page */}
              {/* Link page Formule */}
              <View
                onLayout={handleLayout('Formules')}
                style={{...styles.paddingProduct, paddingTop: 60}}>
                <FormulesSalees />
                {/* <TestFormules /> */}
              </View>

              {/* envie de salé */}
              <View
                onLayout={handleLayout('Produits Salés')}
                style={{...styles.paddingProduct}}>
                <EnvieSalee />
                {/* <TestEnvieSalee /> */}
              </View>
              {/* Ajout du 18/10 , potentiellement Maj 3.31 */ }
              {renderCategoryProducts('Plats Chauds')}

              {renderCategoryProducts('Pâtisseries')}
              {renderCategoryProducts('Boules et Pains Spéciaux')}

              {/* Petites dejeuners */}
              <View
                onLayout={handleLayout('Petits déjeuners')}
                style={styles.paddingProduct}>
                <FormulesPetitDejeuner />
              </View>

              {renderCategoryProducts('Tartes')}
              {renderCategoryProducts('Boissons')}

              {/* catalogue */}
              <View style={styles.paddingProduct}>
                <Catalogue />
              </View>

              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <TouchableOpacity
                  style={styles.scrollTop}
                  onPress={scrollToTop}>
                  <ArrowDown />
                </TouchableOpacity>
              </View>
            </ScrollView>

            {user.role != 'invite' && (
              <ModaleOffreSUN
                modalVisible={isModalSunVisible}
                setModalVisible={setIsModalSunVisible}
                product={selectedProduct}
              />
            )}

            <FooterProfile />
          </SafeAreaProvider>
        )}
      </View>
    </>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 12,
    color: colors.color2,
    textAlign: 'center',
    marginVertical: 2,
  },
  inputAndroid: {
    fontSize: 18,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 8,
    color: colors.color1,
  },
});

const pickerStyles = Platform.select({
  ios: pickerSelectStyles.inputIOS, // Styles pour iOS
  android: pickerSelectStyles.inputAndroid, // Styles pour Android
});
export default Home;
