import { applyMiddleware, createStore } from "redux";

import reducers from "./reducers";

import thunk from "redux-thunk";

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "main-root",
  storage,
};

const persitedReducer = persistReducer(persistConfig, reducers);

const store = createStore(persitedReducer, {}, applyMiddleware(thunk));

const persistor = persistStore(store);

export { persistor };
export default store;
