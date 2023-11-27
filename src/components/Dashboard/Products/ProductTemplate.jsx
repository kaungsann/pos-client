import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getApi } from "../../Api";
import ProductList from "./ProductList";

const ProductTemplate = () => {
  const [products, setProducts] = useState([]);
  const token = useSelector((state) => state.IduniqueData);
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await getApi(`/product`, token.accessToken);
        setProducts(response?.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchRecords();
  }, [token.accessToken]);

  return (
    <div>
        <ProductList products={products}/>
    </div>
  );
};

export default ProductTemplate;
