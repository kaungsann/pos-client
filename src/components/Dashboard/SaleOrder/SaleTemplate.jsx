import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../../Api";
import SaleList from "./SaleList";
import SearchCompo from "../../utils/SearchCompo";
import FilterBox from "./FilterBox";
import ExcelExportButton from "../../ExcelExportButton";
import ExcelImportButton from "../../ExcelImportButton";
import { useNavigate } from "react-router-dom";
import { Button } from "@nextui-org/react";

export default function SaleTemplate() {
  const [sales, setSales] = useState([]);

  const navigate = useNavigate();

  const COMPARISION = {
    LESS: "LESS",
    GREATER: "GREATER",
  };

  const [filteredKeywords, setFilteredKeywords] = useState({
    name: "",
    location: "",
    created: "",
    orderRef: "",
    scheduledDate: "",
    state: "",
    total: {
      value: 0,
      comparison: "",
    },
  });

  const token = useSelector((state) => state.IduniqueData);

  const SALE_API = {
    INDEX: BASE_URL + "/sale",
    IMPORT: BASE_URL + "/sale/import-excel",
    EXPORT: BASE_URL + "/sale/export-excel",
  };

  const fetchSaleData = async () => {
    try {
      const response = await axios.get(SALE_API.INDEX, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
          "Content-Type": "application/json",
        },
      });
      const filteredSale = response.data?.data.filter(
        (sale) => sale.active === true
      );
      setSales(filteredSale);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchSaleData();
  }, [token]);

  const handleFilterChange = (selected) => {
    setFilteredKeywords((prevFilter) => ({
      ...prevFilter,
      ...selected,
    }));
  };
  const filteredSale = useMemo(
    () =>
      sales.filter((sale) => {
        let { name, location, created, orderRef, scheduledDate, state, total } =
          filteredKeywords;

        const isName = () => {
          if (!name) {
            return true;
          }

          if (sale.partner.name) {
            return sale.partner.name.toLowerCase().includes(name.toLowerCase());
          }

          return false;
        };

        const isLocation = () => {
          if (!location) {
            return true;
          }
          if (sale.location.name) {
            return sale.location.name
              .toLowerCase()
              .includes(location.toLowerCase());
          }
        };
        const isCreateDate = () => {
          if (!created) {
            return true;
          }

          if (sale.createdAt) {
            const saleCreated = sale.createdAt.split("T")[0];

            return saleCreated === created;
          }
          return false;
        };
        const isOrderRef = () => {
          if (!orderRef) {
            return true;
          }
          if (sale.orderRef) {
            return sale.orderRef.includes(orderRef);
          }

          return false;
        };
        const isScheduledDate = () => {
          if (!scheduledDate) {
            return true;
          }

          if (sale.scheduledDate) {
            const scheduledDatePart = sale.scheduledDate.split("T")[0];

            return scheduledDatePart === scheduledDate;
          }
          return false;
        };
        const isState = () => {
          if (!state) {
            return true;
          }

          if (sale.state) {
            return sale.state.toLowerCase().includes(state.toLowerCase());
          }
        };

        const isTotal = () => {
          if (!sale.total || !total.comparison) return true;

          const QTY = sale.total || 0;

          return (
            (total.comparison === COMPARISION.LESS && QTY < total.value) ||
            (total.comparison === COMPARISION.GREATER && QTY > total.value)
          );
        };

        return (
          isName() &&
          isLocation() &&
          isCreateDate() &&
          isOrderRef() &&
          isScheduledDate() &&
          isState() &&
          isTotal()
        );
      }),
    [sales, filteredKeywords]
  );

  return (
    <>
      <div className="flex justify-between items-center my-3">
        <SearchCompo
          keyword={filteredKeywords.name}
          text="Search by partner name..."
          onSearch={handleFilterChange}
        />

        <div className="flex">
          <Button
            size="sm"
            onClick={() => navigate("/admin/saleorders/create")}
            className="font-bold rounded-sm shadow-sm flex bg-zinc-50 items-center text-blue-700 border-blue-500 border-2 hover:opacity-75 text-sm hover:text-white hover:bg-blue-700 px-3 py-1.5"
          >
            Add
          </Button>
          <FilterBox onFilter={handleFilterChange} />
          <div className="mx-3">
            <ExcelExportButton
              token={token.accessToken}
              apiEndpoint={SALE_API.EXPORT}
            />
          </div>

          {/* <ExcelImportButton
            token={token.accessToken}
            apiEndpoint={SALE_API.IMPORT}
          /> */}
        </div>
      </div>
      <SaleList sales={filteredSale} />
    </>
  );
}
