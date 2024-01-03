import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../Api";
import VendorList from "./VendorList";
import FilterBox from "./FilterBox";
import SearchCompo from "../utils/SearchCompo";

export default function VendorTemplate() {
  const [vendors, setVendors] = useState([]);
  const [filteredKeywords, setFilteredKeywords] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
  });

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

  const handleFilterChange = (selected) => {
    setFilteredKeywords((prevFilter) => ({
      ...prevFilter,
      ...selected,
    }));
  };
  const filteredVendors = useMemo(
    () =>
      vendors.filter((customer) => {
        const { name, phone, address, city } = filteredKeywords;

        const isName = () => {
          if (!name) {
            return true;
          }

          if (customer.name) {
            return customer.name.toLowerCase().includes(name.toLowerCase());
          }

          return false;
        };
        const isPhone = () => {
          if (!phone) {
            return true;
          }
          if (customer.phone) {
            return customer.phone.includes(phone);
          }

          return false;
        };
        const isAddress = () => {
          if (!address) {
            return true;
          }

          if (customer.address) {
            return customer.address
              .toLowerCase()
              .includes(address.toLowerCase());
          }
          return false;
        };

        const isCity = () => {
          if (!city) {
            return true;
          }

          if (customer.city) {
            return customer.city.toLowerCase().includes(city.toLowerCase());
          }
          return false;
        };

        return (
          customer.name.toLowerCase().includes(name.toLowerCase()) &&
          isName() &&
          isPhone() &&
          isAddress() &&
          isCity()
        );
      }),
    [vendors, filteredKeywords]
  );
  return (
    <>
      <div className="flex justify-between items-center my-3">
        <SearchCompo
          keyword={filteredKeywords.name}
          onSearch={handleFilterChange}
        />

        <div className="flex">
          <FilterBox onFilter={handleFilterChange} />
        </div>
      </div>
      <VendorList vendors={filteredVendors} onDeleteSuccess={fetchVendorData} />
    </>
  );
}
