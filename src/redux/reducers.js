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
    case "applyDiscount": {
      let { productId, discountId, discount } = payload;

      return state.map((item) => {
        if (item._id === productId) {
          return {
            ...item,
            discount: {
              id: discountId,
              name: discount.name,
              amount: discount.amount,
            },
          };
        }
        return item;
      });
    }

    case "removeDiscountItem": {
      let { productID } = payload;
      return state.map((item) => {
        if (item.id === productID) {
          const { ...itemWithoutDiscount } = item;
          return itemWithoutDiscount;
        }
        return item;
      });
    }
    case "removeAllOrders":
      return [];
    default:
      return state;
  }
};

const INIT_SALEORDER_STATE = {
  orderDate: new Date().toISOString().split('T')[0],
  user: null,
  partner: null,
  location: null,
  lines: [],
  note: "",
  taxTotal: 0,
  discountTotal: 0,
  total: 0,
};

const saleOrderReducer = (state = INIT_SALEORDER_STATE, { type, payload }) => {
  switch (type) {
    case "addDateToSaleOrder": {
      let { orderDate } = payload;
      return { ...state, orderDate };
    }
    case "addPartnerToSaleOrder": {
      let { customer } = payload;
      return { ...state, partner: customer };
    }
    case "addLocationToSaleOrder": {
      let { location } = payload;
      return { ...state, location: location };
    }
    case "addNoteToSaleOrder": {
      let { note } = payload;
      return { ...state, note: note };
    }
    case "addLineToSaleOrder": {
      let { line } = payload;

      const existingLineIndex = state.lines.findIndex(
        (existingLine) => existingLine.product.id === line.product.id
      );

      if (existingLineIndex !== -1) {
        const updatedLines = [...state.lines];
        updatedLines[existingLineIndex] = {
          ...updatedLines[existingLineIndex],
          qty: updatedLines[existingLineIndex].qty + line.qty,
          subTotal: updatedLines[existingLineIndex].subTotal + line.subTotal,
          subTaxTotal:
            updatedLines[existingLineIndex].subTaxTotal + line.subTaxTotal,
          subDiscountTotal:
            updatedLines[existingLineIndex].subDiscountTotal +
            line.subDiscountTotal,
        };

        const newTotal = updatedLines.reduce(
          (total, line) => total + line.subTotal,
          0
        );

        const newTaxTotal = updatedLines.reduce(
          (total, line) => total + line.subTaxTotal,
          0
        );

        const newDiscountTotal = updatedLines.reduce(
          (total, line) => total + line.subDiscountTotal,
          0
        );

        return {
          ...state,
          lines: updatedLines,
          total: newTotal,
          discountTotal: newDiscountTotal,
          taxTotal: newTaxTotal,
        };
      } else {
        const newTotal = state.total + line.subTotal;
        const newTaxTotal = state.taxTotal + line.subTaxTotal;
        const newDiscountTotal = state.discountTotal + line.subDiscountTotal;

        return {
          ...state,
          lines: [...state.lines, line],
          total: newTotal,
          taxTotal: newTaxTotal,
          discountTotal: newDiscountTotal,
        };
      }
    }
    case "removeLineFromSaleOrder": {
      let { productID } = payload;
      console.log(productID);
      const lineToRemove = state.lines.find(
        (line) => line.product.id === productID
      );

      return {
        ...state,
        lines: state.lines.filter((item) => item.product.id !== productID),
        total: state.total - lineToRemove.subTotal,
        taxTotal: state.taxTotal - lineToRemove.subTaxTotal,
      };
    }
    case "removeAllLinesFromSaleOrder":
      return INIT_SALEORDER_STATE;
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
  saleOrder: saleOrderReducer,
});

export default reducers;
