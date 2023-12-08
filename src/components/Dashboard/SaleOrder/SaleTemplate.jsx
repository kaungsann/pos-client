import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../../Api";
import SaleList from "./SaleList";

export default function SaleTemplate() {
  const [sales, setSales] = useState([]);
  const token = useSelector((state) => state.IduniqueData);

  const SALE_API = {
    INDEX: BASE_URL + "/sale",
    IMPORT: BASE_URL + "/sale/import-excel",
    EXPORT: BASE_URL + "/sale/export-excel",
  };

  const fetchSaleData = async () => {
    try {
      const response = await axios.get(SALE_API.INDEX, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
          "Content-Type": "application/json",
        },
      });
      const filteredSale = response.data?.data.filter(
        (sale) => sale.active === true
      );
      setSales(filteredSale);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchSaleData();
  }, [token]);

  return (
    <>
      <SaleList sales={sales} />
    </>
  );
}
