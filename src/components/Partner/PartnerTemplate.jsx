import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../Api";

import SearchBox from "./SearchBox";
import ExcelExportButton from "../ExcelExportButton";
import ExcelImportButton from "../ExcelImportButton";
import PartnerList from "./PartnerList";
import { Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import FilterBox from "../Dashboard/Partner/FilterBox";

export default function AdjustmentTemplate() {
  const [partners, setPartners] = useState([]);
  const [filteredKeywords, setFilteredKeywords] = useState({
    name: "",
    address: "",
    city: "",
    phone: "",
    isCustomer: null,
    isCompany: null,
  });
  const token = useSelector((state) => state.IduniqueData);
  const navigate = useNavigate();

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
      const filteredPartners = response.data?.data.filter(
        (ct) => ct.active === true
      );
      setPartners(filteredPartners);
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
      partners.filter((partner) => {
        const { name, address, city, phone } = filteredKeywords;

        return (
          partner.name.toLowerCase().includes(name.toLowerCase()) &&
          partner.address.toLowerCase().includes(address.toLowerCase()) &&
          partner.city?.toLowerCase().includes(city.toLowerCase()) &&
          partner.phone?.includes(phone)
        );
      }),
    [partners, filteredKeywords]
  );

  return (
    <>
      <div className="flex justify-between items-center my-3">
        <SearchBox
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
            text="Stock"
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
