import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from "@reduxjs/toolkit";
import authReducer from "./auth.js";
import sideBarReducer from "./sideBar.js";
import themeReducer from "./theme.js";
import playerReducer from "./player.js";
import searchReducer from "./search.js";
import windowReducer from "./window.js";
import purchaseReducer from "./purchase.js"
import storage from "redux-persist/lib/storage";
import sessionStorage from "redux-persist/lib/storage/session";
import artistUploadReducer from "./artistUpload.js";
import songQueueReducer from "./songQueue.js"
import { persistStore, persistReducer } from "redux-persist";
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "theme"],
};
const persistSessionConfig = {
  key: "session",
  storage: sessionStorage,
  whitelist: ["songQueue"]
}
//them vao sau khi viet xong slice
const rootReducer = combineReducers({
  auth: authReducer,
  sideBar: sideBarReducer,
  theme: themeReducer,
  player: playerReducer,
  artistUpload: artistUploadReducer,
  search: searchReducer,
  window: windowReducer,
  purchase: purchaseReducer,
  songQueue: persistReducer(persistSessionConfig, songQueueReducer)
});
const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true,
      serializableCheck: false,
    }),
});
export const persistor = persistStore(store);
