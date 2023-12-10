import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../../Api";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import CustomerList from "./CustomerList";

export default function CustomerTemplate() {
  const [customers, setCustomers] = useState([]);
  const token = useSelector((state) => state.IduniqueData);

  const CUSTOMER_API = {
    INDEX: BASE_URL + "/partner",
  };

  const fetchCustomerData = async () => {
    try {
      const response = await axios.get(CUSTOMER_API.INDEX, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
          "Content-Type": "application/json",
        },
      });
      const filteredCustomers = response.data?.data.filter(
        (ct) => ct.isCustomer === true && ct.active === true
      );
      setCustomers(filteredCustomers);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  const handleDeleteSuccess = async () => {
    fetchCustomerData();
  };

  useEffect(() => {
    fetchCustomerData();
  }, [token]);
  return (
    <>
      <CustomerList customers={customers} onDeleteSuccess={fetchCustomerData} />
    </>
  );
}
