import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { BASE_URL } from "../Api";
import ProductList from "./ProductList";
import FilterBox from "./FilterBox";
import SearchBox from "./SearchBox";
import ExcelExportButton from "../ExcelExportButton";
import ExcelImportButton from "../ExcelImportButton";
import axios from "axios";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";

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
  const [showBox, setShowBox] = useState(false);

  console.log("product all is", products);
  console.log("category s all is", categories);

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
        products.map((product) => product?.category?.name).filter(Boolean)
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

        const isCategory = () => {
          if (!category) {
            return true;
          }

          if (product?.category) {
            return product.category?.name
              .toLowerCase()
              .includes(category.toLowerCase());
          }

          return false;
        };

        return (
          product.name.toLowerCase().includes(name.toLowerCase()) &&
          (!startDate || new Date(product.expiredAt) >= new Date(startDate)) &&
          (!endDate || new Date(product.expiredAt) <= new Date(endDate)) &&
          isCategory() &&
          isStockValid()
        );
      }),
    [products, filteredKeywords]
  );

  const handleShowBox = () => {
    setShowBox(!showBox);
  };

  return (
    <>
      {/* <h2 className="lg:text-2xl font-bold mb-3">Categorys</h2> */}
      {showBox && (
        <FilterBox
          show={handleShowBox}
          categories={categories}
          onFilter={handleFilterChange}
        />
      )}

      <div className="flex justify-between items-center my-3">
        <div className="flex">
          <Link to="/admin/products/create">
            <div className="font-bold rounded-sm shadow-sm flex items-center text-blue-700 border-blue-500 border-2 hover:opacity-75 text-sm hover:text-white hover:bg-blue-700 px-3 py-1.5">
              Add
            </div>
          </Link>
          <div
            onClick={handleShowBox}
            className="rounded-sm ml-3 transition shadow-sm flex items-center text-[#4338ca] border-[#4338ca] border-2 hover:opacity-75 text-sm hover:text-white hover:bg-[#4338ca] font-bold px-3 py-1.5"
          >
            <Icon icon="basil:filter-outline" className="text-lg" />
            <h4>Filter</h4>
          </div>
          <ExcelExportButton
            token={token.accessToken}
            apiEndpoint={PRODUCT_API.EXPORT}
          />
          <ExcelImportButton
            token={token.accessToken}
            apiEndpoint={PRODUCT_API.IMPORT}
          />
        </div>
        <SearchBox
          keyword={filteredKeywords.name}
          onSearch={handleFilterChange}
        />
      </div>
      <ProductList products={filteredProducts} />
    </>
  );
};

export default ProductTemplate;
