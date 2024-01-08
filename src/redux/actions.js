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
