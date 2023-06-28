import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // user: null,
  user: {
    firstname: '',
    lastname: '',
    adresse: '',
    // Autres champs utilisateur
  },
  selectedStore: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    registerUser: (state, action) => {
      state.user = action.payload;
    },
    loginUser: (state, action) => {
      // state.user = action.payload;
      state.user = {
        ...state.user,
        ...action.payload,
      };
    },
    logoutUser: (state, action) => {
      // state.user = null;
      // state.user = {
      //   ...state.user,
      // };
      state.user = {
        firstname: '',
        lastname: '',
        adresse: '',
        
      };
    },
    updateSelectedStore: (state, action) => {
      // state.selectedStore = action.payload;
      state.selectedStore = action.payload
      // state.user.id_magasin = action.payload.id_magasin;

    },
    updateUser: (state, action) => {
      state.user = {
        ...state.user,
        ...action.payload,
      };
    },
  },
});

export const { registerUser, loginUser, logoutUser, updateSelectedStore, updateUser } = authSlice.actions;

export default authSlice.reducer;
