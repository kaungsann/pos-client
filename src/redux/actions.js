export const addData = (payload) => {
  return {
    type: "add",
    payload: payload,
  };
};

export const removeData = (payload) => {
  return {
    type: "remove",
    payload: payload,
  };
};

export const itemsAdd = (payload) => {
  return {
    type: "addorder",
    payload: payload,
  };
};

export const itemRemove = (payload) => {
  return {
    type: "removeorder",
    payload: payload,
  };
};
export const removeAllItems = () => {
  return {
    type: "removeAllOrders",
  };
};

export const updateItemQuantity = (productId, quantity) => ({
  type: "updateItemQuantity",
  payload: { productId, quantity },
});

export const add = (payload) => {
  return {
    type: "valid",
    payload: payload,
  };
};

export const remove = (payload) => {
  return {
    type: "notValid",
    payload: payload,
  };
};

export const idAdd = (payload) => {
  return {
    type: "idAdd",
    payload: payload,
  };
};

export const idRemove = (payload) => {
  return {
    type: "idRemove",
    payload: payload,
  };
};

export const pageRefresh = (payload) => {
  return {
    type: "refresh",
    payload: payload,
  };
};

export const applyDiscount = (productId, discountId, discount) => ({
  type: "applyDiscount",
  payload: {
    productId,
    discountId,
    discount,
  },
});

export const removeDiscountItem = (productID) => ({
  type: "removeDiscountItem",
  payload: {
    productID,
  },
});

export const removeDiscount = () => ({
  type: "removeDiscount",
});

export const addLineToSaleOrder = (line) => {
  return {
    type: "addLineToSaleOrder",
    payload: {
      line,
    },
  };
};

export const removeLineFromSaleOrder = (productID, uomID) => ({
  type: "removeLineFromSaleOrder",
  payload: {
    productID,
    uomID,
  },
});

export const removeAllLinesFromSaleOrder = () => ({
  type: "removeAllLinesFromSaleOrder",
});

export const addDateToSaleOrder = (orderDate) => {
  return {
    type: "addDateToSaleOrder",
    payload: {
      orderDate,
    },
  };
};

export const addCustomerToSaleOrder = (customer) => {
  return {
    type: "addPartnerToSaleOrder",
    payload: {
      customer,
    },
  };
};

export const addLocationToSaleOrder = (location) => {
  return {
    type: "addLocationToSaleOrder",
    payload: {
      location,
    },
  };
};

export const addNoteToSaleOrder = (note) => {
  return {
    type: "addNoteToSaleOrder",
    payload: {
      note,
    },
  };
};

export const addDateToPurchaseOrder = (orderDate) => {
  return {
    type: "addDateToPurchaseOrder",
    payload: {
      orderDate,
    },
  };
};

export const addCustomerToPurchaseOrder = (customer) => {
  return {
    type: "addPartnerToPurchaseOrder",
    payload: {
      customer,
    },
  };
};

export const addLocationToPurchaseOrder = (location) => {
  return {
    type: "addLocationToPurchaseOrder",
    payload: {
      location,
    },
  };
};

export const addNoteToPurchaseOrder = (note) => {
  return {
    type: "addNoteToPurchaseOrder",
    payload: {
      note,
    },
  };
};

export const addLineToPurchaseOrder = (line) => {
  return {
    type: "addLineToPurchaseOrder",
    payload: {
      line,
    },
  };
};

export const removeLineFromPurchaseOrder = (productID, uomID) => ({
  type: "removeLineFromPurchaseOrder",
  payload: {
    productID,
    uomID,
  },
});

export const removeAllLinesFromPurchaseOrder = () => ({
  type: "removeAllLinesFromPurchaseOrder",
});

export const filterLocations = (filteredLocations) => ({
  type: "FILTER_LOCATIONS",
  payload: filteredLocations,
});
