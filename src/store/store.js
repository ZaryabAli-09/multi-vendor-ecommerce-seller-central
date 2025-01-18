import { configureStore, createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, // Stores user data
  isAuthenticated: false, // when dont have JWT or not login successfuly this will be false
  isLoading: false, // Tracks the loading state
  error: null, // Stores error messages
};

const AuthSlice = createSlice({
  name: "AuthSlice",

  initialState: initialState,

  reducers: {
    loginStart(state, action) {
      state.isLoading = true;
    },
    loginSuccess(state, action) {
      state.user = action.payload; // Payload: { user, token }
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },
    loginFailure(state, action) {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = action.payload; // Payload:{error e.g invalid email}
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.isLoading = false;
    },
  },
});

const store = configureStore({
  auth: AuthSlice.reducer,
});

export { store };
