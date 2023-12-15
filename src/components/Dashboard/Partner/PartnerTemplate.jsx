import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../../Api";
import PartnerList from "./PartnerList";
import SearchCompo from "../../utils/SearchCompo";
import ExcelExportButton from "../../ExcelExportButton";
import ExcelImportButton from "../../ExcelImportButton";
import { useNavigate } from "react-router-dom";
import FilterBox from "../Customer/FilterBox";
import { Button } from "@nextui-org/react";

export default function PartnerTemplate() {
  const [partner, setPartner] = useState([]);

  const navigate = useNavigate();

  const [filteredKeywords, setFilteredKeywords] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
  });

  const token = useSelector((state) => state.IduniqueData);

  const PARTNER_API = {
    INDEX: BASE_URL + "/partner",
    IMPORT: BASE_URL + "/partner/import-excel",
    EXPORT: BASE_URL + "/partner/export-excel",
  };

  const fetchPartnerData = async () => {
    try {
      const response = await axios.get(PARTNER_API.INDEX, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
          "Content-Type": "application/json",
        },
      });
      const filteredPartner = response.data?.data.filter(
        (ct) => ct.active === true
      );
      setPartner(filteredPartner);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchPartnerData();
  }, [token]);

  const handleFilterChange = (selected) => {
    setFilteredKeywords((prevFilter) => ({
      ...prevFilter,
      ...selected,
    }));
  };
  const filteredPartners = useMemo(
    () =>
      partner.filter((customer) => {
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
    [partner, filteredKeywords]
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
          <div className="mx-3">
            <ExcelExportButton
              token={token.accessToken}
              apiEndpoint={PARTNER_API.EXPORT}
            />
          </div>

          <ExcelImportButton
            token={token.accessToken}
            apiEndpoint={PARTNER_API.IMPORT}
          />
        </div>
      </div>
      <PartnerList
        partners={filteredPartners}
        onDeleteSuccess={fetchPartnerData}
      />
    </>
  );
}
