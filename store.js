import { configureStore } from "@reduxjs/toolkit";
import authReducer from './reducers/authSlice'

const store = configureStore({
    reducer: {
        auth: authReducer,
        // cart: cartReducer
      },
})
export default store;