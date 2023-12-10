import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../../Api";

import AdjustmentList from "./AdjustmentList";

export default function AdjustmentTemplate() {
  const [adjustment, setAdjustment] = useState([]);
  const token = useSelector((state) => state.IduniqueData);

  const ADJUSTMENT_API = {
    INDEX: BASE_URL + "/inventory-adjustment",
  };

  const fetchStockData = async () => {
    try {
      const response = await axios.get(ADJUSTMENT_API.INDEX, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
          "Content-Type": "application/json",
        },
      });
      setAdjustment(response.data?.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchStockData();
  }, [token]);

  return (
    <div>
      <AdjustmentList adjustments={adjustment} />
    </div>
  );
}
