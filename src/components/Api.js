//const BASE_URL = "http://18.143.238.45";
export const BASE_URL = "http://127.0.0.1:8000";
// "https://x1czilrsii.execute-api.ap-southeast-1.amazonaws.com";
// export const BASE_URL =
  //"https://80a2e3emcc.execute-api.ap-southeast-1.amazonaws.com";

export const getApi = async (route, token = null) => {
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${route}`, {
    headers,
  });

  // if (!response.ok) {
  //   console.log("res daata is", response);
  //   throw new Error("Failed to fetch data");
  // }

  const resData = await response.json();

  return resData;
};

export const FormPostApi = async (route, data, token) => {
  const response = await fetch(`${BASE_URL}${route}`, {
    method: "POST",
    body: data,
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
  let resData = await response.json();
  return resData;
};

export const FormPathApi = async (route, data, token) => {
  const response = await fetch(`${BASE_URL}${route}`, {
    method: "PATCH",
    body: data,
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
  let result = await response.json();
  return result;
};

export const sendJsonToApi = async (route, data, token) => {
  const response = await fetch(`${BASE_URL}${route}`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  });

  const resData = await response.json();
  return resData;
};

export const PathData = async (route, data, token) => {
  const response = await fetch(`${BASE_URL}${route}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    //{name , ref , expiredate , description , stockQty , category , price}
    body: JSON.stringify(data),
  });

  const resData = await response.json();
  return resData;
};

export const deleteApi = async (route) => {
  const response = await fetch(`${BASE_URL}${route}`, {
    method: "DELETE",
    headers: {
      "content-type": "application/json",
    },
  });
  let resData = await response.json();
  return resData;
};

export const deleteMultiple = async (route, ids, token) => {
  const response = await fetch(`${BASE_URL}${route}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(ids),
  });
  let resData = await response.json();
  return resData;
};

export const orderConfirmApi = async (route, token) => {
  const response = await fetch(`${BASE_URL}${route}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  });

  const resData = await response.json();
  return resData;
};
