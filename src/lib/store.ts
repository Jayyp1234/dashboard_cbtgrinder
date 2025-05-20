// src/lib/store.ts
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import storage from "./persistStorage"; // ✅ Fixes SSR issues
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

// ✅ Your existing APIs
import { api } from "./services/api"; // Auth API
import { questionBank } from "./services/questionBank"; // Question Bank API

// Combine all reducers
const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  [questionBank.reducerPath]: questionBank.reducer,
  // Add other reducers/slices here if needed
});

// Persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ['auth','Question'], // persist both APIs api.reducerPath, questionBank.reducerPath
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Store setup
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(api.middleware, questionBank.middleware),
});

setupListeners(store.dispatch);

// Exports
export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
