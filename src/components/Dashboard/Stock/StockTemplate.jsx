import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../../Api";
import StockList from "./StockList";
import SearchCompo from "../../utils/SearchCompo";
import ExcelExportButton from "../../ExcelExportButton";
import ExcelImportButton from "../../ExcelImportButton";
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
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchStockData();
  }, [token]);

  const handleFilterChange = (selected) => {
    console.log("selected location name is a", selected);
    setFilteredKeywords((prevFilter) => ({
      ...prevFilter,
      ...selected,
    }));
  };

  const filteredStock = useMemo(
    () =>
      stocks.filter((stk) => {
        const { name, location, onhand } = filteredKeywords;

        const isName = () => {
          if (!name) {
            return true;
          }

          if (stk.product) {
            return stk.product.name.toLowerCase().includes(name.toLowerCase());
          }

          return false;
        };

        const isLocation = () => {
          console.log("Filter:", location);

          if (!location) {
            return true;
          }

          if (stk.location) {
            return stk.location.name
              .toLowerCase()
              .includes(location.toLowerCase());
          }
        };
        const isOnHand = () => {
          if (!stk.onHand || !onhand.comparison) return true;

          const QTY = stk.onHand || 0;

          return (
            (onhand.comparison === COMPARISION.LESS && QTY < onhand.value) ||
            (onhand.comparison === COMPARISION.GREATER && QTY > onhand.value)
          );
        };
        return isOnHand() && isName() && isLocation();
      }),
    [stocks, filteredKeywords]
  );

  console.log("stock filter is a", filteredStock);

  return (
    <div>
      <div className="flex justify-between items-center my-3">
        <SearchCompo
          keyword={filteredKeywords.name}
          onSearch={handleFilterChange}
        />

        <div className="flex">
          <FilterBox onFilter={handleFilterChange} />
          <div className="mx-3">
            <ExcelExportButton
              token={token.accessToken}
              apiEndpoint={STOCK_API.EXPORT}
            />
          </div>

          <ExcelImportButton
            token={token.accessToken}
            apiEndpoint={STOCK_API.IMPORT}
          />
        </div>
      </div>
      <StockList stocks={filteredStock} />
    </div>
  );
}
