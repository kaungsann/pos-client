import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../../Api";
import StockList from "./StockList";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";

export default function StockTemplate() {
  const [stocks, setStocks] = useState([]);
  const token = useSelector((state) => state.IduniqueData);

  const STOCK_API = {
    INDEX: BASE_URL + "/stock",
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

  return (
    <div>
      <StockList stocks={stocks} />
    </div>
  );
}
