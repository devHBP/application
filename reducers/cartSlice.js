import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cart: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
 
    // addToCart: (state, action) => {
    //   const product = action.payload;
      
    //   const existingProductIndex = state.cart.findIndex(
    //     (item) => item.productId === product.productId && item.offre === product.offre
    //   );
    
    //   if (existingProductIndex !== -1) {
    //     state.cart[existingProductIndex].qty += 1;
    //   } else {
    //     state.cart.push({ ...product, qty: 1, isFree: false });
    //   }
    // },
    addToCart: (state, action) => {
      const product = action.payload;
  
      // Si c'est une formule
      if (product.type === "formule") {
          const existingFormuleIndex = state.cart.findIndex(
            (item) => item.id === product.id
          );
  
          if (existingFormuleIndex !== -1) {
            state.cart[existingFormuleIndex].qty += 1;
          } else {
            state.cart.push(product);
          }
      } 
      // Pour les autres produits
      else {
          const existingProductIndex = state.cart.findIndex(
            (item) => item.productId === product.productId && item.offre === product.offre
          );
  
          if (existingProductIndex !== -1) {
            state.cart[existingProductIndex].qty += 1;
          } else {
            state.cart.push({ ...product, qty: 1, isFree: false });
          }
      }
  },
  

    addFreeProductToCart: (state, action) => {
      const product = action.payload;
    
      if (product.offre && product.offre.startsWith('offre31')) {
        state.cart.push({ ...product, prix_unitaire: 0, qty: 1, isFree: true });
      }
    },
    
    //   decrementOrRemoveFromCart: (state, action) => {
    //     const product = action.payload;
    //     console.log("Decrement or remove product:", product);

    //     const existingProductIndex = state.cart.findIndex(
    //       (item) => item.productId === product.productId
    //     );
    //     if (existingProductIndex !== -1) {
    //       if (state.cart[existingProductIndex].qty > 1) {
    //         state.cart[existingProductIndex].qty -= 1;
    //       } else {
    //         state.cart = state.cart.filter((item) => item.productId !== product.productId);
    //       }
    //     }
    // },

    decrementOrRemoveFromCart: (state, action) => {
      const product = action.payload;
      const existingProductIndex = state.cart.findIndex(
        (item) => Array.isArray(item.productIds) ? item.productIds[0] === product.productId : item.productId === product.productId
      );
      if (existingProductIndex !== -1) {
        if (state.cart[existingProductIndex].qty > 1) {
          state.cart[existingProductIndex].qty -= 1;
        } else {
          state.cart = state.cart.filter((item) => Array.isArray(item.productIds) ? item.productIds[0] !== product.productId : item.productId !== product.productId);
        }
      }
  },
  
    incrementProductQty: (state, action) => {
      const productId = action.payload;
      
      const productInCart = state.cart.find((item) => item.productId === productId);
      
      if (productInCart) {
        productInCart.qty += 1;
      }
    },
    removeFromCart: (state, action) => {
        const productId = action.payload;
        state.cart = state.cart.filter((item) => item.productId !== productId);
      },
    updateCart(state, action) {
        state.cart = action.payload;
      },
    clearCart: (state) => {
        state.cart = [];
      },
    addDate: (state, action) => {
        state.date = action.payload;
      },
      clearDate: (state) => {
        state.date = null; 
      },
    addTime: (state, action) => {
        state.time = action.payload;
      },
    clearTime: (state) => {
        state.time = null; 
      },
    resetDateTime: (state) => {
        state.date = null;
        state.time = null;
      },
    addPaiement: (state, action) => {
        state.paiement = action.payload
      }
  },
});

export const { addToCart, removeFromCart, updateCart, clearCart, addDate, clearDate,
addTime,resetDateTime,clearTime, addPaiement, decrementOrRemoveFromCart, addFreeProductToCart, incrementProductQty } = cartSlice.actions;
export default cartSlice.reducer;
