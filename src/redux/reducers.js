import { combineReducers } from "redux";

const initialState = {
  pageRefresh: false,
};

const idReducers = (state = null, { type, payload }) => {
  switch (type) {
    case "idAdd":
      return (state = payload);
    case "idRemove":
      return (state = payload);
    default:
      return state;
  }
};

const userReducers = (state = null, { type, payload }) => {
  switch (type) {
    case "add":
      return (state = payload);
    case "remove":
      return (state = payload);
    default:
      return state;
  }
};

const refreshReducer = (state = initialState, action) => {
  switch (action.type) {
    case "refresh":
      return {
        ...state,
        pageRefresh: !state.pageRefresh, // Toggle the value
      };
    // ... other cases
    default:
      return state;
  }
};

const orderValidReducers = (state = false, { type, payload }) => {
  switch (type) {
    case "valid":
      return (state = payload);
    case "notValid":
      return (state = payload);
    default:
      return state;
  }
};
const orderReducers = (state = [], { type, payload }) => {
  switch (type) {
    case "addorder":
      return [...state, payload];
    case "removeorder":
      return state.filter((item) => item.id !== payload);
    case "updateItemQuantity":
      return state.map((item) => {
        if (item._id === payload.productId) {
          return { ...item, quantity: payload.quantity };
        }
        return item;
      });
    case "removeAllOrders":
      return [];
    default:
      return state;
  }
};

const reducers = combineReducers({
  IduniqueData: idReducers,
  loginData: userReducers,
  orderData: orderReducers,
  orderCheck: orderValidReducers,
  refresh: refreshReducer,
});

export default reducers;
