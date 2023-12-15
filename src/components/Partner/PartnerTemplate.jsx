import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../Api";

import SearchBox from "./SearchBox";
import ExcelExportButton from "../ExcelExportButton";
import ExcelImportButton from "../ExcelImportButton";
import PartnerList from "./PartnerList";

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
      setPartners(response.data?.data);
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
        const { name, address, city, phone } =
          filteredKeywords;

        return (
          partner.name.toLowerCase().includes(name.toLowerCase()) &&
          partner.address.toLowerCase().includes(address.toLowerCase()) &&
          partner.city.toLowerCase().includes(city.toLowerCase()) &&
          partner.phone.toLowerCase().includes(phone.toLowerCase())
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
      <PartnerList partners={filteredPartners} />
    </>
  );
}
