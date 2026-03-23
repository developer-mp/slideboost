import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./slices/userSlice";
import storageReducer from "./slices/storageSlice";
import dataReducer from "./slices/dataSlice";
import { appApi } from "./api/appApi";

const rootReducer = combineReducers({
  user: userReducer,
  fileStorage: storageReducer,
  dataStorage: dataReducer,
  [appApi.reducerPath]: appApi.reducer,
});

const persistConfig = {
  key: "root",
  storage,
  blacklist: [appApi.reducerPath],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/FLUSH",
          "persist/PAUSE",
          "persist/REMOVE",
          "persist/REGISTER",
        ],
        ignoredActionPaths: ["meta.arg", "payload.timestamp"],
        ignoredPaths: ["persist", appApi.reducerPath],
        warningThreshold: 100,
      },
    }).concat(appApi.middleware),
});

export const persistor = persistStore(store);
export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
