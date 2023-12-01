import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { getApi } from "../../Api";
import ProductList from "./ProductList";
import FilterBox from "./FilterBox";
import SearchBox from "./SearchBox";

const COMPARISION = {
  LESS: "LESS",
  GREATER: "GREATER",
}

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
        const response = await getApi(`/product`, token.accessToken);
        setProducts(response?.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    })();
  }, [token.accessToken]);

  useEffect(() => {
    const uniqueCategories = [
      ...new Set(products.map((product) => product.category.name)),
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
            (price.comparison === COMPARISION.LESS && salePrice < price.value) ||
            (price.comparison === COMPARISION.GREATER && salePrice > price.value)
          );
        };

        return (
          product.name.toLowerCase().includes(name.toLowerCase()) &&
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
      <ProductList products={filteredProducts} />
    </>
  );
};

export default ProductTemplate;
