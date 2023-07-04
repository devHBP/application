import { createSlice } from '@reduxjs/toolkit';

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    numero_commande: '',
    productIds: [],
  },
  reducers: {
    setNumeroCommande: (state, action) => {
      state.numero_commande = action.payload;
    },
    setProductIds: (state, action) => {
      state.productIds = action.payload;
    },
  },
});

export const { setNumeroCommande, setProductIds } = orderSlice.actions;
export default orderSlice.reducer;