import { applyMiddleware, legacy_createStore as createStore } from "redux";

import reducers from "./reducers";

import thunk from "redux-thunk";

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "main-root",
  storage,
  whitelist: ["IduniqueData", "loginData"],
};

const persitedReducer = persistReducer(persistConfig, reducers);

const store = createStore(
  persitedReducer,
  applyMiddleware(thunk),
  // typeof window !== "undefined"
  //   ? window.__REDUX_DEVTOOLS_EXTENSION__ &&
  //       window.__REDUX_DEVTOOLS_EXTENSION__()
  //   : null
);

const persistor = persistStore(store);

export { persistor };
export default store;
