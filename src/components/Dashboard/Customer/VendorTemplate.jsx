import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../../Api";
import { Icon } from "@iconify/react";
import VendorList from "./VendorList";
import FilterBox from "./FilterBox";
import SearchCompo from "../../utils/SearchCompo";
import { Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

export default function VendorTemplate() {
  const [vendors, setVendors] = useState([]);
  const [filteredKeywords, setFilteredKeywords] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
  });
  const navigate = useNavigate();

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
          <Button
            size="sm"
            onClick={() => navigate("/admin/partners/create")}
            className="font-bold rounded-sm shadow-sm flex bg-zinc-50 items-center text-blue-700 border-blue-500 border-2 hover:opacity-75 text-sm hover:text-white hover:bg-blue-700 px-3 py-1.5"
          >
            Add
          </Button>
          <FilterBox onFilter={handleFilterChange} />
        </div>
      </div>
      <VendorList vendors={filteredVendors} onDeleteSuccess={fetchVendorData} />
    </>
  );
}
