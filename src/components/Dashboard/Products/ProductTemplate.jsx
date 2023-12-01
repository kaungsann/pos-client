import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../Api";
import ProductList from "./ProductList";
import FilterBox from "./FilterBox";
import SearchBox from "./SearchBox";
import ExcelExportButton from "../../utils/ExcelExportButton";
import ExcelImportButton from "../../utils/ExcelImportButton";
import axios from "axios";

const COMPARISION = {
  LESS: "LESS",
  GREATER: "GREATER",
};

const PRODUCT_API = {
  INDEX: BASE_URL + "/product",
  IMPORT: BASE_URL + "/product/import-excel",
  EXPORT: BASE_URL + "/product/export-excel",
};

const ProductTemplate = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredKeywords, setFilteredKeywords] = useState({
    name: "",
    category: "",
    startDate: "",
    endDate: "",
    price: {
      value: 0,
      comparison: "",
    },
  });
  const token = useSelector((state) => state.IduniqueData);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(PRODUCT_API.INDEX, {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
            "Content-Type": "application/json",
          },
        });
        setProducts(response.data?.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    })();
  }, [token]);

  useEffect(() => {
    const uniqueCategories = [
      ...new Set(
        products.map((product) => product.category && product.category.name)
      ),
    ];
    setCategories(uniqueCategories);
  }, [products]);

  const handleFilterChange = (selected) => {
    setFilteredKeywords((prevFilter) => ({
      ...prevFilter,
      ...selected,
    }));
  };

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const { name, category, startDate, endDate, price } = filteredKeywords;

        const isStockValid = () => {
          if (!price.value || !price.comparison) return true;

          const salePrice = product.salePrice;

          return (
            (price.comparison === COMPARISION.LESS &&
              salePrice < price.value) ||
            (price.comparison === COMPARISION.GREATER &&
              salePrice > price.value)
          );
        };

        return (
          product.name.toLowerCase().includes(name.toLowerCase()) &&
          product.category &&
          product.category.name
            .toLowerCase()
            .includes(category.toLowerCase()) &&
          (!startDate || new Date(product.expiredAt) >= new Date(startDate)) &&
          (!endDate || new Date(product.expiredAt) <= new Date(endDate)) &&
          isStockValid()
        );
      }),
    [products, filteredKeywords]
  );

  return (
    <>
      <FilterBox categories={categories} onFilter={handleFilterChange} />
      <SearchBox
        keyword={filteredKeywords.name}
        onSearch={handleFilterChange}
      />
      <ExcelExportButton
        token={token.accessToken}
        apiEndpoint={PRODUCT_API.EXPORT}
      />
      <ExcelImportButton
        token={token.accessToken}
        apiEndpoint={PRODUCT_API.IMPORT}
      />
      <ProductList products={filteredProducts} />
    </>
  );
};

export default ProductTemplate;
