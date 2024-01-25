import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../Api";
import StockList from "./StockList";
import SearchCompo from "../utils/SearchCompo";
import ExcelExportButton from "../ExcelExportButton";
import FilterBox from "./FilterBox";

export default function StockTemplate() {
  const [stocks, setStocks] = useState([]);

  const COMPARISION = {
    LESS: "LESS",
    GREATER: "GREATER",
  };

  let [filteredKeywords, setFilteredKeywords] = useState({
    name: "",
    location: "",
    onhand: {
      value: 0,
      comparison: "",
    },
  });

  const token = useSelector((state) => state.IduniqueData);

  const STOCK_API = {
    INDEX: BASE_URL + "/stock",
    IMPORT: BASE_URL + "/stock/import-excel",
    EXPORT: BASE_URL + "/stock/export-excel",
  };

  const fetchStockData = async () => {
    try {
      const response = await axios.get(STOCK_API.INDEX, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
          "Content-Type": "application/json",
        },
      });
      const filteredStock = response.data?.data.filter(
        (ct) => ct.active === true
      );
      setStocks(filteredStock);
    } catch (error) {
      console.error("Error fetching stocks:", error);
    }
  };

  useEffect(() => {
    fetchStockData();
  }, [token]);

  const handleFilterChange = (selected) => {
    setFilteredKeywords((prevFilter) => ({
      ...prevFilter,
      ...selected,
    }));
  };

  const filteredStock = useMemo(
    () =>
      stocks.filter((stk) => {
        const { name, location, onhand } = filteredKeywords;

        const isOnHand = () => {
          if (!stk.onHand || !onhand.comparison) return true;

          const QTY = stk.onHand || 0;

          return (
            (onhand.comparison === COMPARISION.LESS && QTY < onhand.value) ||
            (onhand.comparison === COMPARISION.GREATER && QTY > onhand.value)
          );
        };

        return (
          stk.product.name.toLowerCase().includes(name.toLowerCase()) &&
          stk.location.name.toLowerCase().includes(location.toLowerCase()) &&
          isOnHand()
        );
      }),
    [filteredKeywords, stocks]
  );

  return (
    <div>
      <div className="flex justify-between items-center my-3">
        <SearchCompo
          keyword={filteredKeywords.name}
          onSearch={handleFilterChange}
          text="Search by product name"
        />

        <div className="flex">
          <FilterBox onFilter={handleFilterChange} />
          <div className="mx-3">
            <ExcelExportButton
              token={token.accessToken}
              apiEndpoint={STOCK_API.EXPORT}
            />
          </div>
        </div>
      </div>
      <StockList stocks={filteredStock} />
    </div>
  );
}
