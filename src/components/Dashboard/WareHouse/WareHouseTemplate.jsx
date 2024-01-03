import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../../Api";
import WareHouseList from "./WareHouseList";

export default function WareHouseTemplate() {
  const [warehouse, setWarehouse] = useState([]);
  const token = useSelector((state) => state.IduniqueData);

  const WAREHOUSE_API = {
    INDEX: BASE_URL + "/orders",
  };

  const fetchWareHouseData = async () => {
    try {
      const response = await axios.get(WAREHOUSE_API.INDEX, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
          "Content-Type": "application/json",
        },
      });

      setWarehouse(response.data?.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchWareHouseData();
  }, [token]);

  return (
    <>
      <div className="my-3">
        <WareHouseList warehouses={warehouse} />
      </div>
    </>
  );
}
