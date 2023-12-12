import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../../Api";

import AdjustmentList from "./AdjustmentList";
import SearchBox from "./SearchBox";
import { Link } from "react-router-dom";
import ExcelExportButton from "../../ExcelExportButton";
import ExcelImportButton from "../../ExcelImportButton";
import FilterBox from "./FilterBox";

export default function AdjustmentTemplate() {
  const [adjustment, setAdjustment] = useState([]);
  const [filteredKeywords, setFilteredKeywords] = useState({
    productName: "",
    productBarcode: "",
    locationName: "",
  });
  const token = useSelector((state) => state.IduniqueData);

  const ADJUSTMENT_API = {
    INDEX: BASE_URL + "/inventory-adjustment",
    IMPORT: BASE_URL + "/inventory-adjustment/import-excel",
    EXPORT: BASE_URL + "/inventory-adjustment/export-excel",
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

  const handleFilterChange = (selected) => {
    console.log("seleted is a", selected);
    setFilteredKeywords((prevFilter) => ({
      ...prevFilter,
      ...selected,
    }));
  };
  const filteredAdjustment = useMemo(
    () =>
      adjustment.filter((adjust) => {
        const { productName, productBarcode, locationName } = filteredKeywords;

        const isName = () => {
          if (!productName) {
            return true;
          }

          if (adjust.productName) {
            return adjust.productName
              .toLowerCase()
              .includes(productName.toLowerCase());
          }

          return false;
        };
        const isLoction = () => {
          if (!locationName) {
            return true;
          }

          if (adjust.locationName) {
            return adjust.locationName
              .toLowerCase()
              .includes(locationName.toLowerCase());
          }

          return false;
        };
        const isBarCode = () => {
          if (!locationName) {
            return true;
          }

          if (adjust.locationName) {
            return adjust.locationName
              .toLowerCase()
              .includes(locationName.toLowerCase());
          }
          return false;
        };

        return isName() && isBarCode() && isLoction();
      }),
    [adjustment, filteredKeywords]
  );

  console.log("adjustment is a", filteredAdjustment);

  return (
    <div>
      <div className="flex justify-between items-center my-3">
        <SearchBox
          keyword={filteredKeywords.productName}
          onSearch={handleFilterChange}
        />

        <div className="flex">
          <FilterBox onFilter={handleFilterChange} />
          <div className="mx-3">
            <ExcelExportButton
              token={token.accessToken}
              apiEndpoint={ADJUSTMENT_API.EXPORT}
            />
          </div>

          <ExcelImportButton
            token={token.accessToken}
            apiEndpoint={ADJUSTMENT_API.IMPORT}
          />
        </div>
      </div>
      <AdjustmentList adjustments={filteredAdjustment} />
    </div>
  );
}
