import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../../Api";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import VendorList from "./VendorList";

export default function VendorTemplate() {
  const [vendors, setVendors] = useState([]);
  const token = useSelector((state) => state.IduniqueData);

  const CUSTOMER_API = {
    INDEX: BASE_URL + "/partner",
  };

  const fetchVendorData = async () => {
    try {
      const response = await axios.get(CUSTOMER_API.INDEX, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
          "Content-Type": "application/json",
        },
      });
      const filteredvendors = response.data?.data.filter(
        (ct) => ct.isCustomer === false && ct.active === true
      );
      setVendors(filteredvendors);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchVendorData();
  }, [token]);
  return (
    <>
      <VendorList vendors={vendors} onDeleteSuccess={fetchVendorData} />
    </>
  );
}
