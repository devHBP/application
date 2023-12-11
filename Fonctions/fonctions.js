import {checkStockForSingleProduct} from '../CallApi/api.js';
import {
  addToCart,
  decrementOrRemoveFromCart,
  addFreeProductToCart,
  removeFromCart,
  removeMultipleFromCart,
} from '../reducers/cartSlice.js';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Platform} from 'react-native';


const configureAxiosHeaders = async () => {
  const token = await AsyncStorage.getItem('userToken');
  if (token) {
    axios.defaults.headers.common['x-access-token'] = token;
  }
  axios.defaults.headers.common['x-access-header'] = 'hbpclickandcollect';
};

export const decrementhandler = (id, dispatch) => {
  // console.log("Decrementing product with ID:", id);
  const productId = Array.isArray(id) ? id[0] : id;

  dispatch(decrementOrRemoveFromCart({productId: productId, qty: 1}));
};

// export const removehandler = (id, dispatch) => {
//   // console.log("Decrementing product with ID:", id);
//   const productId = Array.isArray(id) ? id[0] : id;

//     dispatch(removeFromCart({ productId: productId}));
//   };

//   export const removehandler = (ids, dispatch, type) => {
//     console.log('ids', ids);
//     if (type === "formule") {
//         // Supprimez la formule complète en utilisant son ID unique.
//         dispatch(removeMultipleFromCart({ formuleId: ids }));
//     } else  {
//         // Supprimez le produit individuel en utilisant son ID.
//         dispatch(removeFromCart({ productId: ids }));
//     }
// };

export const removehandler = (id, dispatch, type = 'product') => {
  if (type === 'formule') {
    dispatch(removeMultipleFromCart({formuleId: id}));
  } else {
    if (Array.isArray(id)) {
      id.forEach(productId => {
        dispatch(removeFromCart({productId}));
      });
    } else {
      dispatch(removeFromCart({productId: id}));
    }
  }
};

//fonctionne pour les produits individuals - pas pour les formule
export const incrementhandler = async (
  id,
  dispatch,
  cart,
  currentStock,
  offre,
) => {
  if (currentStock === 0) {
    return Toast.show({
      type: 'error',
      text1: `Victime de son succès`,
      text2: 'Plus de stock disponible',
    });
  }
  try {
    const stockAvailable = await checkStockForSingleProduct(id);

    // Get the product from the cart
    const productInCart = cart.find(item => item.productId === id);

    // Calculate the remaining stock after accounting for the items in the cart
    const remainingStock =
      stockAvailable[0].quantite - (productInCart ? productInCart.qty : 0);

    if (stockAvailable.length > 0 && remainingStock > 0) {
      // The stock is sufficient, add the product to the cart
      dispatch(
        addToCart({
          productId: id,
          libelle,
          image,
          prix_unitaire: prix,
          qty: 1,
          offre: offre,
        }),
      );

      if (offre && offre.startsWith('offre31')) {
        // Get a version of the cart that includes the new product
        const updatedCart = [
          ...cart,
          {
            productId: id,
            libelle,
            image,
            prix_unitaire: prix,
            qty: 1,
            offre: offre,
          },
        ];

        // Filter products that have the same offer as the currently added product
        const sameOfferProducts = updatedCart.filter(
          item => item.offre === offre,
        );

        // Calculate the total quantity for this specific offer
        const totalQuantity = sameOfferProducts.reduce(
          (total, product) => total + product.qty,
          0,
        );

        // if (totalQuantity > 0 && totalQuantity % 3 === 0)
        if (totalQuantity === 3 || (totalQuantity - 3) % 4 === 0) {
          //MODALE 4E produit
          setModalVisible(true);
        }
      }
    } else {
      // The stock is insufficient
      //console.log(`Le stock est insuffisant pour ajouter la quantité spécifiée.,Quantités max: ${stockAvailable[0].quantite}`);
      return Toast.show({
        type: 'error',
        text1: `Victime de son succès`,
        text2: `Quantité maximale: ${stockAvailable[0].quantite}`,
      });
    }
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de l'incrémentation du stock :",
      error,
    );
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
//--- FIN STOCK---//

//obtenir la version de l'app sur app store
async function getLatestAppVersionFromAppStore(bundleId) {
  if (Platform.OS === 'ios') {
    console.log('version ios');
    // Pour iOS, utilisez l'API iTunes Search
    const url = `https://itunes.apple.com/lookup?bundleId=${bundleId}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.resultCount === 0) {
        throw new Error('Aucune donnée trouvée pour ce Bundle ID');
      }
      return data.results[0].version;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération de la version de l'application:",
        error,
      );
      return null;
    }
  } else if (Platform.OS === 'android') {
    console.log('version android');
  }
}

export {
  checkProductStock,
  getProductQtyInCart,
  checkProductAvailability,
  configureAxiosHeaders,
  getLatestAppVersionFromAppStore,
};
