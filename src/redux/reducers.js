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
        pageRefresh: !state.pageRefresh,
      };

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
  orderDate: new Date().toISOString().split("T")[0],
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
        (existingLine) =>
          existingLine.product._id === line.product._id &&
          existingLine.uom.id === line.uom.id
      );

      if (existingLineIndex !== -1) {
        const updatedLines = [...state.lines];
        updatedLines[existingLineIndex] = {
          ...updatedLines[existingLineIndex],
          qty: updatedLines[existingLineIndex].qty + line.qty,
          subTotal: updatedLines[existingLineIndex].subTotal + line.subTotal,
          subTaxTotal:
            updatedLines[existingLineIndex].subTaxTotal + line.subTaxTotal,
          subDiscTotal:
            updatedLines[existingLineIndex].subDiscTotal + line.subDiscTotal,
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
          (total, line) => total + line.subDiscTotal,
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
        const newDiscountTotal = state.discountTotal + line.subDiscTotal;

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
      let { productID, uomID } = payload;
      const lineToRemove = state.lines.find(
        (line) => line.product._id === productID && line.uom.id === uomID
      );

      return {
        ...state,
        lines: state.lines.filter(
          (item) => item.product._id !== productID || item.uom.id !== uomID
        ),
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

const INIT_PURCHASEORDER_STATE = {
  orderDate: new Date().toISOString().split("T")[0],
  user: null,
  partner: null,
  location: null,
  lines: [],
  note: "",
  taxTotal: 0,
  total: 0,
};

const purchaseOrderReducer = (
  state = INIT_PURCHASEORDER_STATE,
  { type, payload }
) => {
  switch (type) {
    case "addDateToPurchaseOrder": {
      let { orderDate } = payload;
      return { ...state, orderDate };
    }
    case "addPartnerToPurchaseOrder": {
      let { customer } = payload;
      return { ...state, partner: customer };
    }
    case "addLocationToPurchaseOrder": {
      let { location } = payload;
      return { ...state, location: location };
    }
    case "addNoteToPurchaseOrder": {
      let { note } = payload;
      return { ...state, note: note };
    }
    case "addLineToPurchaseOrder": {
      let { line } = payload;

      const existingLineIndex = state.lines.findIndex(
        (existingLine) =>
          existingLine.product.id === line.product.id &&
          existingLine.uom.id === line.uom.id
      );

      if (existingLineIndex !== -1) {
        const updatedLines = [...state.lines];
        updatedLines[existingLineIndex] = {
          ...updatedLines[existingLineIndex],
          qty: updatedLines[existingLineIndex].qty + line.qty,
          subTotal: updatedLines[existingLineIndex].subTotal + line.subTotal,
          subTaxTotal:
            updatedLines[existingLineIndex].subTaxTotal + line.subTaxTotal,
        };

        const newTotal = updatedLines.reduce(
          (total, line) => total + line.subTotal,
          0
        );

        const newTaxTotal = updatedLines.reduce(
          (total, line) => total + line.subTaxTotal,
          0
        );

        return {
          ...state,
          lines: updatedLines,
          total: newTotal,
          taxTotal: newTaxTotal,
        };
      } else {
        const newTotal = state.total + line.subTotal;
        const newTaxTotal = state.taxTotal + line.subTaxTotal;

        return {
          ...state,
          lines: [...state.lines, line],
          total: newTotal,
          taxTotal: newTaxTotal,
        };
      }
    }
    case "removeLineFromPurchaseOrder": {
      let { productID, uomID } = payload;

      const lineToRemove = state.lines.find(
        (line) => line.product.id === productID && line.uom.id === uomID
      );

      return {
        ...state,
        lines: state.lines.filter(
          (item) => item.product.id !== productID || item.uom.id !== uomID
        ),
        total: state.total - lineToRemove.subTotal,
        taxTotal: state.taxTotal - lineToRemove.subTaxTotal,
      };
    }
    case "removeAllLinesFromPurchaseOrder":
      return INIT_PURCHASEORDER_STATE;
    default:
      return state;
  }
};

export const locationsReducer = (state = [], action) => {
  switch (action.type) {
    case "FILTER_LOCATIONS":
      return action.payload;
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
  purchaseOrder: purchaseOrderReducer,
  location: locationsReducer,
});

export default reducers;
