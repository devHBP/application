import { checkStockForSingleProduct } from '../CallApi/api.js';
import { addToCart, decrementOrRemoveFromCart, addFreeProductToCart } from '../reducers/cartSlice.js'
import Toast from 'react-native-toast-message';


export const decrementhandler = (id, dispatch) => {

    dispatch(decrementOrRemoveFromCart({ productId: id, qty: 1 }));
  };