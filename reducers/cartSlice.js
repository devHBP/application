import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cart: [],
  cartTotal: {},
  freeProducts: [], 
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
      //pour les pizzas
      else if (product.offre && product.offre.startsWith('offre31_')) {
        state.cart.push({ ...product, qty: 1, isFree: false });
        
        const sameOfferProducts = state.cart.filter(item => item.offre === product.offre);
        
        if (sameOfferProducts.length % 4 === 0) {
            // Marquez la dernière pizza de cette offre comme gratuite
            sameOfferProducts[sameOfferProducts.length - 1].isFree = true;
            sameOfferProducts[sameOfferProducts.length - 1].prix_unitaire = 0;
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
            state.cart.push({ ...product, qty: 1, isFree: false,});
          }
          
      }
  },

    addFreeProductToCart: (state, action) => {
      const product = action.payload;
    
      if (product.offre && product.offre.startsWith('offre31')) {
        state.cart.push({ ...product, prix_unitaire: 0, qty: 1, isFree: true});
      }
    },

    makeLastSmallPizzaFree: (state, action) => {
      //console.log('jeneleve le prix dune pizza')
      const lastPizzaIndex = state.cart.length - 1;
  if (lastPizzaIndex !== -1) {
    const lastPizza = state.cart[lastPizzaIndex];
    if (lastPizza.offre && lastPizza.offre.startsWith('offre31_Petite')) {
      lastPizza.prix_unitaire = 0;
      lastPizza.isFree = true;
    }
  }
    },
    makeLastBigPizzaFree: (state, action) => {
      //console.log('jeneleve le prix dune pizza')
      const lastPizzaIndex = state.cart.length - 1;
  if (lastPizzaIndex !== -1) {
    const lastPizza = state.cart[lastPizzaIndex];
    if (lastPizza.offre && lastPizza.offre.startsWith('offre31_Grande')) {
      lastPizza.prix_unitaire = 0;
      lastPizza.isFree = true;
    }
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
      //console.log('cart avant suppression', state.cart);
      //console.log("Removing one product:", action.payload.productId);
      const productId = action.payload.productId;
      state.cart = state.cart.filter((item) => !item.productId || item.productId !== productId);
      //console.log('cart apres suppression', state.cart);
    },
    
  removeMultipleFromCart: (state, action) => {
      const formuleId = action.payload.formuleId;
      //console.log("Removing formule:", formuleId);
      state.cart = state.cart.filter((item) => !(item.type === 'formule' && item.id === formuleId));
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
      },
  updateCartTotal: (state, action) => {
    state.cartTotal = {
      groupedItems: action.payload.groupedItemsArray,
      formules: action.payload.formules
    };
  },
  addPromo: (state, action) => {
    state.promotionId = action.payload;
  },
  resetPromo: (state) => {
    state.promotionId = null; 
  },
},
});

export const { addToCart, removeFromCart, updateCart, clearCart, addDate, clearDate,addTime,resetDateTime,clearTime,
   addPaiement, decrementOrRemoveFromCart, addFreeProductToCart, incrementProductQty, updateCartTotal, removeMultipleFromCart, 
   makeLastSmallPizzaFree, makeLastBigPizzaFree, addPromo, resetPromo } = cartSlice.actions;
export default cartSlice.reducer;
