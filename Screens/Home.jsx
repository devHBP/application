import {View, Text, Pressable, ScrollView , StyleSheet, TouchableOpacity } from 'react-native'
import  Picker  from 'react-native-picker-select';
import { defaultStyle} from '../styles/styles'
import React, {useState, useEffect,  createRef  } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { logoutUser, updateSelectedStore, updateUser} from '../reducers/authSlice';
import { addDate, addTime, clearCart, resetDateTime} from '../reducers/cartSlice';
import ProductCard from '../components/ProductCard'
import axios from 'axios'
import Icon from 'react-native-vector-icons/MaterialIcons'
import DatePicker from 'react-native-date-picker'
import { Badge } from 'react-native-paper';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import AsyncStorage from '@react-native-async-storage/async-storage'
import FooterProfile from '../components/FooterProfile';
import { SearchBar } from 'react-native-elements';


const Home =  ({navigation}) => {

  const [date, setDate] = useState(null)
  const [openDate, setOpenDate] = useState(false)
  const [time, setTime] = useState()
  const [openTime, setOpenTime] = useState(false)
  const [stores, setStores] = useState([]);
  const [role, setRole] = useState('');
  const [ selectedCategory, setSelectedCategory] = useState(null)
  const [ products, setProducts] = useState([])
  const [ categories, setCategories] = useState([])
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products); // Replace 'products' with your actual product data
  const dateRedux = useSelector((state) => state.cart.date)
  const timeRedux = useSelector((state) => state.cart.time)
  const user = useSelector((state) => state.auth.user);
  //console.log('user Home', user)
  //const cart = useSelector((state) => state.cart.cart);
  const selectedStore = useSelector((state) => state.auth.selectedStore);

  const dispatch = useDispatch();
  const scrollViewRef = createRef();

  const allStores = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8080/getAllStores');
      // console.log('all stores', response.data)
      setStores(response.data);
    } catch (error) {
      console.error("Une erreur s'est produite :", error);
    }
  };

  useEffect(() => {
    allStores();
    setFilteredProducts(products)
  }, [products]);

  useEffect(() => {
    // Effectuez une requête GET pour récupérer le rôle de l'utilisateur
    axios.get(`http://127.0.0.1:8080/getOne/${user.userId}`)
      .then(response => {
        //console.log(response.data.role)
        const role  = response.data.role;
         setRole(role); 
         dispatch(updateUser(response.data))
      })
      .catch(error => {
        console.error('Erreur lors de la récupération du rôle de l\'utilisateur:', error);
      });
  }, [])

  useEffect(() => {
    // Fonction pour récupérer les données de la base de données
    const fetchData = async () => {
      try {
      const response = await axios.get('http://127.0.0.1:8080/getAllProducts');
    
      const updatedProducts = response.data.map((product) => ({
        ...product,
        qty: 0, 
      }));
      //console.log('all products', updatedProducts)
      setProducts(updatedProducts);
      setCategories([...new Set(updatedProducts.map((product) => product.categorie)), 'Tous']);
      //setCategories(updatedProducts.map((product) => product.categorie));
      } catch (error) {
        console.error('Une erreur s\'est produite :', error);
      }
    };
    fetchData(); // Appel de la fonction fetchData lors du montage du composant
  }, []);


//filtrage par catégorie
  const categoryButtonHandler = (categorie) => {

    if (categorie === 'Tous') {
      setFilteredProducts(products);
      setSelectedCategory(null)
    } else {
      const filtered = products.filter((product) => product.categorie === categorie);
      setFilteredProducts(filtered);
      setSelectedCategory(categorie)
    }
  }
 
  //deconnexion
  const handleLogout = () => {
    dispatch(resetDateTime())
    setDate(null)
    setTime(null)
    dispatch(logoutUser(selectedStore)); 
    dispatch(clearCart())
    navigation.navigate('app')
  }

  //date formatée ou pas ? 
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    //const hours = date.getHours().toString().padStart(2, '0');
    //const minutes = date.getMinutes().toString().padStart(2, '0');
    //const seconds = date.getSeconds().toString().padStart(2, '0');
    //return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    
    return `${year}-${month}-${day}`;
    //attention ici au format de la date - a bien verifier dans le order_ctrl (moment.js)

  };
  // heure non formaté pour l'instant - inutile pour les collaborateurs
  const formatTime = (dateString) => {
    const time = new Date(dateString);
    //const day = date.getDate().toString().padStart(2, '0');
    //const month = (date.getMonth() + 1).toString().padStart(2, '0');
    //const year = date.getFullYear().toString();
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    //return `${day}-${month}-${year} ${hours}h${minutes}`;
    return `${hours}h${minutes}`;
  };

  //commande possible jusqu'à la veille au soir
  const isTomorrowOrLater = (selectedDate) => {
    const currentDate = new Date();
    currentDate.setHours(23, 59, 0, 0); // Set current date to today at 23:59
    return selectedDate >= currentDate;
  };

  const handleNavigateToCart = async () => {
    const token = await AsyncStorage.getItem('userToken');
    //console.log('token', token)
     // Send request to verify token
     axios.get('http://localhost:8080/verifyToken', {
      headers: {
          'x-access-token': token
      }
    })
    .then(response => {
      if (response.data.auth) {
          // Token is valid, continue with discount application...
          // console.log('token valide')
          navigation.navigate('panier')
      } 
  })
  .catch(error => {
    handleLogout()
    //console.log('token invalide catch')
    return Toast.show({
      type: 'error',
      text1: 'Session expirée',
      text2: 'Veuillez vous reconnecter'
    });
      // console.error('Une erreur s\'est produite lors de la vérification du token :', error);
  });
  
};

//direction vers la page de détails
const handleProductPress = (product) => {
  navigation.navigate('details', { product });
};

//search via searchbar
const handleSearch = (query) => {
  setSearchQuery(query);

  if (query) {
    const filtered = products.filter((product) =>
      product.libelle ? product.libelle.toLowerCase().includes(query.toLowerCase()) : false
    );
    setFilteredProducts(filtered);
  } else {
    setFilteredProducts(products);
  }
};

//classement par catégories
const groupedAndSortedProducts = filteredProducts.reduce((acc, cur) => {
  (acc[cur.categorie] = acc[cur.categorie] || []).push(cur);
  return acc;
}, {});

const sortedCategories = Object.keys(groupedAndSortedProducts).sort();

//scrolltop
const scrollToTop = () => {
  if (scrollViewRef.current) {
    scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
  }
};

  return (
    <>
    <View style={{...defaultStyle, flex:1, paddingHorizontal:5, paddingVertical:20}}>
   
      <View style={style.bandeau}>
      <View>
        {
          user && <Text>Bonjour {user.firstname} {user.lastname} </Text>
        }
         {/* <Text>Point choisi: {selectedStore.nom_magasin}</Text> */}

        
          <Picker
              placeholder={{
                  label: "Choisissez un magasin"
                }}
              value={selectedStore.nom_magasin}
              onValueChange={(value) => {
                const selected = stores.find((store) => store.nom_magasin === value);
                //console.log('user', user)

                if (selected) {
                  dispatch(updateSelectedStore(selected));
                // dispatch(updateUser({ ...user, id_magasin: selected.id_magasin }));
                dispatch(updateUser({ ...user, storeId: selected.storeId }));

                axios.put(`http://127.0.0.1:8080/updateOneUser/${user.userId}`, {storeId: selected.storeId})
                .then(response => {
                  // console.log('Le choix du magasin a été mis à jour avec succès dans la base de données');
                  // console.log(response.data)
                })
                .catch(error => {
                  console.error('Erreur lors de la mise à jour du choix du magasin dans la base de données - erreur ici:', error);
                });
              }
            else {
              console.log('pas de magasin selectionné encore')
            }}
            }
              items={stores.map((store) => ({
                label: store.nom_magasin,
                value: store.nom_magasin,
              }))}
            /> 

       {/* // Selection Jour  */}
         <TouchableOpacity onPress={() => setOpenDate(true)} >
         {/* <Text>{dateRedux ? <Text style={style.picker}>{dateRedux}</Text> : "Choisissez votre jour"}</Text>  */}
            <Text>
            {date ? (
                isTomorrowOrLater(date) ? (
                <Text style={style.picker}>{formatDate(date)}</Text>
                ) : (
                "Il est trop tard pour commander pour  demain"
                )
            ) : (
                "Choisissez votre jour"
            )}
            </Text>
        </TouchableOpacity> 
        
               <DatePicker
                modal
                open={openDate}
                date={date ? new Date(date) : new Date()}
                mode="date"
                onConfirm={(date) => {
                  setOpenDate(false)

                //test date
                if (isTomorrowOrLater(date)) {
                  setDate(date);
                  dispatch(addDate(formatDate(date.toISOString())));
                  console.log('date', formatDate(date.toISOString()))
                  return Toast.show({
                    type: 'success',
                    text1: 'Succès',
                    text2: `Commande prévue pour ${formatDate(date)}`
                  });
                } else {
                  setDate(null)
                  dispatch(addDate(null))
                  console.log('La date sélectionnée doit être supérieure ou égale à demain');
                  return Toast.show({
                    type: 'error',
                    text1: 'Erreur, Vous arrivez trop tard pour demain',
                    text2: 'Veuillez selectionner une nouvelle date'
                  });
                } 
                }}
                onCancel={() => {
                  setOpenDate(false)
                }}
                minimumDate={new Date()}
                
              /> 

        {/* Selection Heure */}
        {/* non visible pour les collaborateurs car heure = tournée du camion */}
        
         {role !== 'collaborateur' && (
       <TouchableOpacity onPress={() => setOpenTime(true)} >
        <Text>{timeRedux ? <Text style={style.picker}>{timeRedux}</Text> : "Choisissez votre heure"}</Text>
        </TouchableOpacity>
        )}
        {role !== 'collaborateur' && (
              <DatePicker
                modal
                open={openTime}
                date={time ? new Date(time) : new Date()}
                mode="time"
                onConfirm={(time) => {
                  setOpenTime(false)
                  setTime(time)
                  dispatch(addTime(formatTime(time.toISOString())));
                  //converti en chaine de caractères
                  console.log('heure commande',formatTime(time))
                  //console.log('selection date store redux:', selectedDateString)
                  //console.log('selection date chaine de caractère:', selectedDateString)
                }}
                onCancel={() => {
                  setOpenTime(false)
                }}
              /> 
        )} 
      </View>

      <View style={style.logos}>
        <Icon name="shopping-cart" size={30} color="#000" onPress={handleNavigateToCart} style={style.container}/>
        <Icon name="logout" size={30} color="#000" onPress={() => handleLogout()} />
      </View>

    </View>

      {/* categories */}
      <View style={style.categories}>
          {/* <ScrollView horizontal showsHorizontalScrollIndicator={false}> */}
          {
            categories.map((item, index) => (
              <Pressable title="button" 
                style={{...style.btn_categorie, 
                backgroundColor: item === selectedCategory ? 'lightgrey' : 'white'} }
                key={index}
                onPress={() => categoryButtonHandler(item)}
              >
                <Text style={{fontSize:12, }}>{item}</Text>
              </Pressable>
            ))
          }
          {/* </ScrollView> */}
        </View>

        {/* SearchBar */}
        <SearchBar
          placeholder="Search products..."
          onChangeText={handleSearch}
          value={searchQuery}
          containerStyle={style.searchBarContainer}
          inputContainerStyle={style.searchBarInputContainer}
        />

          {/* card products */}
        
        <ScrollView vertical showsVerticalScrollIndicator={false}  ref={scrollViewRef}
      >
          <View style={style.cardScrollview}>
            {sortedCategories
            
            .map((category) => (
              <React.Fragment key={category}>
                <Text style={style.categoryTitle}>{category}</Text>
                {groupedAndSortedProducts[category]
                .sort((a, b) => a.libelle.localeCompare(b.libelle))
                .map((item, index) => (
                  <View key={item.productId} style={style.productContainer}>
                    <TouchableOpacity
                      key={item.productId}
                      onPress={() => handleProductPress(item)}
                    >
                      <ProductCard
                        libelle={item.libelle}
                        key={item.productId}
                        id={item.productId}
                        index={index}
                        image={item.image}
                        prix={item.prix_unitaire}
                        qty={item.qty}
                        stock={item.stock}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </React.Fragment>
            ))}
          </View >
          <TouchableOpacity onPress={scrollToTop} >
          <Icon name="arrow-upward" size={30} style={style.scrollTop}   />
          </TouchableOpacity>
         
        </ScrollView>
       

    </View>
    <FooterProfile />
   
    </>
  )
}
const style = StyleSheet.create({
  container: {
    position: 'relative',
    marginRight: 10,
  },
  bandeau:{
    flexDirection:'row', 
    width: "100%", 
    justifyContent:"space-around", 
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: 40,
  },
  logos:{
    flexDirection:'row', 
    gap: 10, 
  },
  picker:{
    color:'red',
    fontWeight:'bold'
  },
  categories:{
    flexDirection: "row", 
    flexWrap:"wrap", 
    justifyContent:'center', 
    marginVertical: 20,
  },
  btn_categorie:{
    borderRadius:50,
    height:30,
    marginVertical:5,
    marginHorizontal:10,
    paddingHorizontal:10,
    justifyContent:'center',
    alignItems:'center',
    borderColor:'lightgray',
    borderWidth:1,  
  },
  categoryTitle:{
    width:"100%",
    marginVertical:10,
  },
  cardScrollview:{
    flexDirection: 'row', 
    flexWrap: 'wrap',
    width:"100%",
    paddingBottom:40 ,
  },
  productContainer: {
    width: '50%', 
    padding: 5,
  },
  searchBarContainer: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    paddingHorizontal: 10,
    paddingVertical: 5,
    width:"100%"
  },
  searchBarInputContainer: {
    backgroundColor: '#e0e0e0',
  },
  scrollTop:{
   marginBottom:100, textAlign:'center'
  }
});

export default Home


  // const products = [
  //   {
  //     id_produit: "1",
  //     nom:"Le parisien",
  //     prix: 10,
  //     categorie:"Sandwich",
  //     source:{ uri : require('../assets/sandwich.png')}
  //   },
  // ]
 