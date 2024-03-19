import {addStock, checkStockForSingleProduct, addStockAntigaspi} from '../CallApi/api.js';
import {
  addToCart,
  decrementOrRemoveFromCart,
  addFreeProductToCart,
  removeFromCart,
  removeMultipleFromCart,
  popLastItemOfType,
  makeLastSmallPizzaFree
} from '../reducers/cartSlice.js';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const configureAxiosHeaders = async () => {
  const token = await AsyncStorage.getItem('userToken');
  if (token) {
    axios.defaults.headers.common['x-access-token'] = token;
  }
  axios.defaults.headers.common['x-access-header'] = 'hbpclickandcollect';
};

export const decrementhandler = (type, id, group, dispatch) => {
  // console.log('type', type);
  // console.log('id', id);
  // console.log('group decrement', group);
  // const lastItem = (group.items).filter(item => item.productId === id).pop();
  let itemsArray;
  if (group.items) {
    // Si group a une propriété items, utilisez-la
    itemsArray = group.items;
  } else if (Array.isArray(group)) {
    // Si group est lui-même un tableau
    itemsArray = group;
  } else {
    // Si group représente un seul produit, créez un tableau avec ce produit
    itemsArray = [group];
  }

  const lastItem = itemsArray.filter(item => item.productId === id).pop();
  if (lastItem) {
    // console.log('offre', lastItem.offre);
  }

  if (type === 'product' || type === 'petitepizza') {
    // console.log('group type product', group)
    dispatch(popLastItemOfType({type, offre: lastItem.offre}));
    addStock({productId: id, qty: 1});
  }
  if (type === 'formule') {
    // console.log('on agit sur une formule');
    dispatch(decrementOrRemoveFromCart({id: group.id}));
    if (group.productIds && Array.isArray(group.productIds)) {
      group.productIds.forEach(productId => {
        // console.log('productId dans la formule:', productId);
        addStock({productId: productId, qty: 1});
      });
    }
  }
};


export const removehandler = (type, id, item, dispatch, qty  ) => {
  // console.log('type', type);
  // console.log('id', id);
  // console.log('item', item);
  //console.log('qty', qty);

  let lastItemOffre;

  // Si "item" contient une propriété "items", qui est un tableau, alors obtenez le dernier produit avec le "productId" correspondant.
  if (item.items && Array.isArray(item.items)) {
    const lastItem = item.items.filter(item => item.productId === id).pop();
    if (lastItem) {
      lastItemOffre = lastItem.offre;
    }
  }
  if (type === 'formule') {
    dispatch(removeMultipleFromCart({formuleId: id}));
    item.productIds.forEach(productId => {
      addStock({productId: productId, qty: qty});
      // console.log(`je remets le stock de ${qty} pour ${productId}`)
    });
  } 

  if (type === 'antigaspi'){
    dispatch(removeFromCart({productId: id, type}));
    addStockAntigaspi({productId: id, qty: qty});
    // console.log(`je remets le stock de ${qty} pour ${id}`)

  }

  if (type === 'product'){
    // console.log('item', item)
    dispatch(removeFromCart({productId: id, type}));
    addStock({productId: id, qty: qty});
    // console.log(`je remets le stock de ${qty} pour ${id}`)
  }
  if (type === 'offreSUN'){
    // console.log('item', item)
    dispatch(removeFromCart({productId: id, type}));
  }
  if (type === 'petitepizza'){
    //console.log('item', item)
    dispatch(removeFromCart({productId: id, type}));
    addStock({productId: id, qty: qty});
    // console.log(`je remets le stock de ${qty} pour ${id}`)
  }
};

//---STOCK---//

// Vérification des stocks
async function checkProductStock(checkStockForSingleProduct, productId) {
  try {
    const isAvailable = await checkStockForSingleProduct(productId);
    return isAvailable.find(item => item.productId === productId) || null;
  } catch (error) {
    console.error('Erreur lors de la vérification du stock:', error);
    return false;
  }
}

//Vérifie la quantité d'un produit dans le panier
function getProductQtyInCart(cart, productId) {
  let totalQty = 0;

  cart.forEach(item => {
    if (item.productIds && Array.isArray(item.productIds)) {
      totalQty += item.productIds.filter(id => id === productId).length;
    } else if (item.productId === productId) {
      totalQty += item.qty || 0;
    }
  });

  return totalQty;
}

// Vérifie la disponibilité d'un produit en prenant en compte les stocks et le panier
async function checkProductAvailability(
  product,
  checkStockForSingleProduct,
  cart,
) {
  const stockObject = await checkProductStock(
    checkStockForSingleProduct,
    product.productId,
  );
  if (!stockObject) {
    Toast.show({
      type: 'error',
      text1: `Erreur`,
      text2: `Erreur lors de la vérification du stock.`,
    });
    return false;
  }

  const stockAvailable = stockObject.quantite;
  const productInCartQty = getProductQtyInCart(cart, product.productId);

  const remainingStock = stockAvailable - productInCartQty;
  if (remainingStock <= 0) {
    Toast.show({
      type: 'error',
      text1: `Victime de son succès`,
      text2: `Plus de stock disponible`,
    });
    return false;
  }

  return true;
}


export const removeCart = (cart, countdown, dispatch) => {
  // console.log('countdown', countdown);
  if (countdown === 0) {
    // console.log('cart', cart);

    const groupedItems = cart.reduce((acc, item) => {
      // Déterminer le type de l'article
      let type = 'product'; // La valeur par défaut est 'product'
      let key;

      // Vérifier si l'article est de type 'antigaspi' ou 'formule', sinon garder 'product'
      if (item.antigaspi) {
        type = 'antigaspi';
        key = `${item.productId}-${type}`; // Utilisez productId pour antigaspi
      } else if (item.type && item.type === 'formule') {
        type = 'formule';
        const formuleId = item.id; // Assumption: item.id est l'identifiant unique de la formule
        key = `${formuleId}-${type}`; // Utilisez formuleId pour les formules
      }else if (item.type && item.type === 'petitepizza') {
        type = 'petitepizza';
        key = `${item.productId}-${type}`; // Utilisez formuleId pour les formules
      } else {
        key = `${item.productId}-${type}`; // Utilisez productId pour les produits standards
      }

      // Initialiser le groupe si nécessaire
      if (!acc[key]) {
        acc[key] = { ...item, qty: 0, type, id: item.id || item.productId }; // Inclure id pour gérer les formules
      }

      // Ajouter la quantité de l'article au total du groupe
      acc[key].qty += item.qty;

      return acc;
    }, {});

    // Maintenant, vous pouvez traiter chaque groupe d'articles
    Object.values(groupedItems).forEach(group => {
      // console.log('grouped item', group);
      // console.log('qty removecart', group.qty);

      // Ici, pour les formules, l'id doit être passé correctement à removehandler
      const idForHandler = group.type === 'formule' ? group.id : group.productId;
      removehandler(group.type, idForHandler, group, dispatch, group.qty);
    });
  }
};

export const  handleOfferCalculation = (cart, dispatch) => {
  // console.log('fonction handleoffre')
  const sameOfferProducts = cart.filter(
    item => item.offre && item.offre.startsWith('offre31_Petite'),
  );
  // Calculez la quantité totale pour cette offre spécifique
  const totalQuantity = sameOfferProducts.reduce((total, product) => total + product.qty, 0);

  // Si la quantité totale est un multiple de 4, rendez la dernière pizza ajoutée gratuite
  if (totalQuantity % 4 === 0) {
    // console.log('4e pizza gratuite');
    dispatch(makeLastSmallPizzaFree());
  }
}






export {
  checkProductStock,
  getProductQtyInCart,
  checkProductAvailability,
  configureAxiosHeaders,
};
