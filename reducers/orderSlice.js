import { createSlice } from '@reduxjs/toolkit';

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    numero_commande: '',
    productIds: [],
    products: [],
  },
  reducers: {
    setNumeroCommande: (state, action) => {
      state.numero_commande = action.payload;
    },
    setProductIds: (state, action) => {
      state.productIds = action.payload;
    },
    setProducts: (state, action) => { // Ajoutez ceci
      state.products = action.payload;
    },
  },
});

export const { setNumeroCommande, setProductIds, setProducts } = orderSlice.actions;
export default orderSlice.reducer;