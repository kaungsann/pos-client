//const BASE_URL = "http://18.143.238.45";
//const BASE_URL = "http://127.0.0.1:8080";
const BASE_URL = "http://3.0.102.114";
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

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

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

export const FormPathApi = async (route, data,token) => {
  const response = await fetch(`${BASE_URL}${route}`, {
    method: "PATCH",
    body: data,
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
  let resData = await response.json();
  return resData;
};

export const jsonStringPostData = async (route, data, token) => {
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
