import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL, orderConfirmApi } from "../../Api";
import PurchaseList from "./PurchaseList";

export default function PurchaseTemplate() {
  const [purchases, setPurchases] = useState([]);
  const token = useSelector((state) => state.IduniqueData);

  const PURCHASE_API = {
    INDEX: BASE_URL + "/purchase",
    IMPORT: BASE_URL + "/purchase/import-excel",
    EXPORT: BASE_URL + "/purchase/export-excel",
  };

  const fetchPurchaseData = async () => {
    try {
      const response = await axios.get(PURCHASE_API.INDEX, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
          "Content-Type": "application/json",
        },
      });
      const filteredPurchase = response.data?.data.filter(
        (loca) => loca.active === true
      );
      setPurchases(filteredPurchase);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchPurchaseData();
  }, [token]);

  return (
    <>
      <PurchaseList purchases={purchases} refresh={fetchPurchaseData} />
    </>
  );
}
