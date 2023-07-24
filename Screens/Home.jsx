import {View, Text, Pressable, ScrollView , StyleSheet, TouchableOpacity, Image } from 'react-native'
import  Picker  from 'react-native-picker-select';
import { fonts, colors} from '../styles/styles'
import React, {useState, useEffect,  createRef  } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateSelectedStore, updateUser} from '../reducers/authSlice';
import { addDate, addTime} from '../reducers/cartSlice';
import ProductCard from '../components/ProductCard'
import axios from 'axios'
import Icon from 'react-native-vector-icons/MaterialIcons'
import DatePicker from 'react-native-date-picker'
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import AsyncStorage from '@react-native-async-storage/async-storage'
import FooterProfile from '../components/FooterProfile';
import { styles, pickerSelectStyles } from '../styles/home'; // Importez les styles depuis le fichier styles.js

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
  const [ visible, setVisible] = useState(false)
  const dateRedux = useSelector((state) => state.cart.date)
  const timeRedux = useSelector((state) => state.cart.time)
  const user = useSelector((state) => state.auth.user);
  const cart = useSelector((state) => state.cart.cart);
  const totalPrice = Number((cart.reduce((total, item) => {
    const prix = item.prix || item.prix_unitaire; 
    return total + item.qty * prix;
  }, 0)).toFixed(2));
  const selectedStore = useSelector((state) => state.auth.selectedStore);

  const dispatch = useDispatch();
  const scrollViewRef = createRef();

  const allStores = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8080/getAllStores');
      // console.log('all stores', response.data)
      setStores(response.data);
    } catch (error) {
      console.error("Une erreur s'est produite, erreur stores :", error);
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
        console.error('Une erreur s\'est produite, error products :', error);
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
    
    //return `${year}-${month}-${day}`;
    //test pour affichage dans le picker
    return `${day}-${month}-${year}`;

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

//contenu visible
const toggleVisibility = () => {
  setVisible(!visible)
}

//open Formule Sandwich
const openFormuleSandwich = () => {
  navigation.navigate('formulesandwich')
}

  return (
    <>
    <ScrollView vertical={true} style={{ flex:1, paddingVertical:20}} ref={scrollViewRef}>
   
    <View >

    <View style={styles.bandeau}>
      
        <View style={{flexDirection:'row'}}>
        {
          user && 
          <View style={{padding:30, flexDirection:'row', alignItems:'center', justifyContent:'center', gap:10}}>
            <View >
              <Text style={{fontFamily:fonts.font1, fontSize:32, color:colors.color1}}>Bonjour </Text>
              <Text style={{fontSize:18, fontFamily:fonts.font2, color:colors.color1}}>{user.firstname}</Text>
            </View>
              
               {/* SearchBar */}
              <SearchBar
              placeholder="Une petite faim ?"
              onChangeText={handleSearch}
              value={searchQuery}
              containerStyle={styles.searchBarContainer}
              inputContainerStyle={styles.searchBarInputContainer}
              inputStyle={{fontSize:16, }}
              placeholderTextColor={colors.color2}
            />
          </View>
        }
        </View>  
    </View>
   
      {/* test bandeau header */}
      <View style={{ width:"100%", height:80, backgroundColor:'white', flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal:20}}>
          <View style={{ flexDirection:'row', gap:5, alignItems:'center', }}>
              <Image
                  source={require('../assets/store.png')} 
                  style={{ width: 24, height: 25, resizeMode:'contain' }}
                />
            <View>   
              <Picker
                  placeholder={{
                      label: "Choisissez un magasin"
                    }}
                  value={selectedStore.nom_magasin}
                  onValueChange={(value) => {
                    const selected = stores.find((store) => store.nom_magasin === value);

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
                      console.error('Erreur lors de la mise à jour du choix du magasin dans la base de données (ici) - erreur ici:', error);
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
                  style={pickerSelectStyles}
                /> 
                {
                  <View style={{flexDirection:'row'}}>
                  
                    <View >
                      <Text style={{fontSize:12}}>
                        {selectedStore.adresse_magasin}   
                      </Text>
                      <Text  style={{fontSize:12}}>{selectedStore.cp_magasin} {selectedStore.ville_magasin}</Text>
                    </View>
                    
                  </View>  
                }

          </View>
          </View>


          <View >
          
       {/* // Selection Jour  */}
    

         <TouchableOpacity onPress={() => setOpenDate(true)}  style={styles.bordersPicker}>
         {/* <Text>{dateRedux ? <Text style={style.picker}>{dateRedux}</Text> : "Choisissez votre jour"}</Text>  */}
            <Text>
            {date ? (
                isTomorrowOrLater(date) ? (
                <Text style={styles.picker}>{formatDate(date)}</Text>
                ) : (
                  <Text style={styles.picker} >
                  trop tard</Text>
                )
            ) : (
              <Text style={styles.picker} >
                Votre jour</Text>
               
            )}
            </Text>
        </TouchableOpacity> 
        </View>
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
                  console.log('date console', date)
                  dispatch(addDate(formatDate(date.toISOString())));
                  console.log('date', formatDate(date.toISOString()))
                  return Toast.show({
                    type: 'success',
                    text1: 'Succès',
                    text2: `Commande choisie pour le ${formatDate(date)}`
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
        <Text>{timeRedux ? <Text style={styles.picker}>{timeRedux}</Text> : "Choisissez votre heure"}</Text>
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

         
          <View style={{backgroundColor:'lightgrey', borderRadius:25, justifyContent:'center'}}> 
              <TouchableOpacity  onPress={toggleVisibility} activeOpacity={1}>
                  <Icon name="keyboard-arrow-down" size={28} color="#FFF"  />
              </TouchableOpacity>
          </View>
        </View>
        {
          visible && (
            <View style={{ width:"100%", height:'auto', backgroundColor:'white', flexDirection:'column', paddingHorizontal:25, borderBottomLeftRadius:10, borderBottomRightRadius:10, paddingVertical:10}}> 
              <Text style={{fontWeight:'bold'}}>Vos articles:</Text>
            {cart.map((item, index) => (
                <View key={index} style={{paddingLeft:20}}>
                    <Text> {item.qty} x {item.libelle}</Text>
                </View>
            ))}
            <Text style={{fontWeight:'bold', paddingVertical:10}}>Votre total: {totalPrice}€</Text>

            </View>
          )
        }
      
      </View>

      {/* categories */}
      <View style={styles.categories} >
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} >
        {
          categories.map((item, index) => (
            <Pressable title="button" 
              style={{...styles.btn_categorie, 
              backgroundColor: item === selectedCategory ? colors.color2 : 'white', 
             
            }}
              key={index}
              onPress={() => categoryButtonHandler(item)}
            >
              <Text style={{fontSize:16, fontFamily:fonts.font2,fontWeight:'600',
                color: item ===selectedCategory ? 'white' : colors.color1
                }}>{item}</Text>
            </Pressable>
          ))
        }
        </ScrollView>
      </View>
    
        
     
      

          {/* Link page Formule */}
          <View style={{marginLeft:30}}>
              <Text>Notre sélection de</Text>
              <Text>snack et formules</Text>
              
              <ScrollView horizontal={true} style={{marginVertical:10}}>
                <TouchableOpacity style={{marginRight:10}} onPress={openFormuleSandwich} activeOpacity={0.8}>
                  <Image
                          source={require('../assets/Formule36.jpg')} 
                          style={{ width: 315, height: 200, resizeMode:'center', borderRadius:5 }}
                          />
                  <Text style={styles.titleFormule}>Formule sandwich</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{marginRight:10}} onPress={openFormuleSandwich} activeOpacity={0.8}>
                  <Image
                          source={require('../assets/Formule36.jpg')} 
                          style={{ width: 315, height: 200, resizeMode:'center', borderRadius:5 }}
                          />
                </TouchableOpacity>
                  
              </ScrollView>
          </View>
          
        
           {/* card products */}
          {/* <View style={style.cardScrollview}> */}
          
            {sortedCategories
              .filter(category => category === 'Baguettes')
              .map((category) => (
              <React.Fragment key={category}>
                <Text style={styles.categoryTitle}>{category}</Text>

                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.scrollHorizontal} >
                {groupedAndSortedProducts[category]
                //ajouter un ordre de catégorie peut etre ?
                //.sort((a, b) => a.libelle.localeCompare(b.libelle))
                .map((item, index) => (
                  <View key={item.productId} style={styles.productContainer}>
                    <TouchableOpacity
                      key={item.productId}
                      onPress={() => handleProductPress(item)}
                      activeOpacity={1}
                    >
                      <ProductCard
                        libelle={item.libelle}
                        key={item.productId}
                        id={item.productId}
                        index={index}
                        image={item.image}
                        prix={item.prix_unitaire}
                        prixSUN={item.prix_remise_collaborateur}
                        qty={item.qty}
                        stock={item.stock}
                        offre={item.offre}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              
              </ScrollView>
              </React.Fragment>
            ))}
          {/* </View > */}

                  {sortedCategories
              .filter(category => category ===  'Viennoiseries')
              .map((category) => (
              <React.Fragment key={category}>
                <Text style={styles.categoryTitle}>{category}</Text>

                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.scrollHorizontal} >
                {groupedAndSortedProducts[category]
                //ajouter un ordre de catégorie peut etre ?
                //.sort((a, b) => a.libelle.localeCompare(b.libelle))
                .map((item, index) => (
                  <View key={item.productId} style={styles.productContainer}>
                    <TouchableOpacity
                      key={item.productId}
                      onPress={() => handleProductPress(item)}
                      activeOpacity={1}
                    >
                      <ProductCard
                        libelle={item.libelle}
                        key={item.productId}
                        id={item.productId}
                        index={index}
                        image={item.image}
                        prix={item.prix_unitaire}
                        prixSUN={item.prix_remise_collaborateur}
                        qty={item.qty}
                        stock={item.stock}
                        offre={item.offre}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              
              </ScrollView>
              </React.Fragment>
            ))}

                  {/* pause */}
                  <Text>Pause</Text>

              {sortedCategories
              .filter(category => category ===  'Pâtisseries')
              .map((category) => (
              <React.Fragment key={category}>
                <Text style={styles.categoryTitle}>{category}</Text>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.scrollHorizontal} >
                {groupedAndSortedProducts[category]
                //ajouter un ordre de catégorie peut etre ?
                //.sort((a, b) => a.libelle.localeCompare(b.libelle))
                .map((item, index) => (
                  <View key={item.productId} style={styles.productContainer}>
                    <TouchableOpacity
                      key={item.productId}
                      onPress={() => handleProductPress(item)}
                      activeOpacity={1}
                    >
                      <ProductCard
                        libelle={item.libelle}
                        key={item.productId}
                        id={item.productId}
                        index={index}
                        image={item.image}
                        prix={item.prix_unitaire}
                        prixSUN={item.prix_remise_collaborateur}
                        qty={item.qty}
                        stock={item.stock}
                        offre={item.offre}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
              </React.Fragment>
            ))}

              {sortedCategories
              .filter(category => category ===  'Boules et Pains spéciaux')
              .map((category) => (
              <React.Fragment key={category}>
                <Text style={styles.categoryTitle}>{category}</Text>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.scrollHorizontal} >
                {groupedAndSortedProducts[category]
                //ajouter un ordre de catégorie peut etre ?
                //.sort((a, b) => a.libelle.localeCompare(b.libelle))
                .map((item, index) => (
                  <View key={item.productId} style={styles.productContainer}>
                    <TouchableOpacity
                      key={item.productId}
                      onPress={() => handleProductPress(item)}
                      activeOpacity={1}
                    >
                      <ProductCard
                        libelle={item.libelle}
                        key={item.productId}
                        id={item.productId}
                        index={index}
                        image={item.image}
                        prix={item.prix_unitaire}
                        prixSUN={item.prix_remise_collaborateur}
                        qty={item.qty}
                        stock={item.stock}
                        offre={item.offre}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
              </React.Fragment>
            ))}

              {sortedCategories
              .filter(category => category ===  'Boissons')
              .map((category) => (
              <React.Fragment key={category}>
                <Text style={styles.categoryTitle}>{category}</Text>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.scrollHorizontal} >
                {groupedAndSortedProducts[category]
                //ajouter un ordre de catégorie peut etre ?
                //.sort((a, b) => a.libelle.localeCompare(b.libelle))
                .map((item, index) => (
                  <View key={item.productId} style={styles.productContainer}>
                    <TouchableOpacity
                      key={item.productId}
                      onPress={() => handleProductPress(item)}
                      activeOpacity={1}
                    >
                      <ProductCard
                        libelle={item.libelle}
                        key={item.productId}
                        id={item.productId}
                        index={index}
                        image={item.image}
                        prix={item.prix_unitaire}
                        prixSUN={item.prix_remise_collaborateur}
                        qty={item.qty}
                        stock={item.stock}
                        offre={item.offre}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
              </React.Fragment>
            ))}


          <TouchableOpacity onPress={scrollToTop} >
             <Icon name="arrow-upward" size={30} style={styles.scrollTop}   />
          </TouchableOpacity>

    </ScrollView>
    <FooterProfile />
   
    </>
  )
}
 export default Home


