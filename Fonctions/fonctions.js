import { checkStockForSingleProduct } from '../CallApi/api.js';
import { addToCart, decrementOrRemoveFromCart, addFreeProductToCart } from '../reducers/cartSlice.js'
import Toast from 'react-native-toast-message';


export const decrementhandler = (id, dispatch) => {

    dispatch(decrementOrRemoveFromCart({ productId: id, qty: 1 }));
  };
  

  //fonctionne pour les produits individuals - pas pour les formule
export  const incrementhandler = async (id, dispatch, cart, currentStock, offre) => {
      console.log({ id, dispatch, cart, currentStock, offre });

    if (currentStock === 0){
      return Toast.show({
        type: 'error',
        text1: `Victime de son succès`,
        text2: 'Plus de stock disponible' 
      });
    }
    try {
      const stockAvailable = await checkStockForSingleProduct(id);
      
      // Get the product from the cart
      const productInCart = cart.find((item) => item.productId === id);
     
      // Calculate the remaining stock after accounting for the items in the cart
    const remainingStock = stockAvailable[0].quantite - (productInCart ? productInCart.qty : 0);
  
  
      if (stockAvailable.length > 0 && remainingStock > 0) {
        // The stock is sufficient, add the product to the cart
        dispatch(addToCart({ productId: id, libelle, image, prix_unitaire: prix, qty: 1 , offre: offre}));
  
        if (offre && offre.startsWith('offre31')) {
          // Get a version of the cart that includes the new product
          const updatedCart = [...cart, { productId: id, libelle, image, prix_unitaire: prix, qty: 1 , offre: offre }];
      
          // Filter products that have the same offer as the currently added product
          const sameOfferProducts = updatedCart.filter((item) => item.offre === offre);
      
          // Calculate the total quantity for this specific offer
          const totalQuantity = sameOfferProducts.reduce((total, product) => total + product.qty, 0);
        
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
          text2: `Quantité maximale: ${stockAvailable[0].quantite}` 
        });
      }
    } catch (error) {
      console.error("Une erreur s'est produite lors de l'incrémentation du stock :", error);
    }
  };
     