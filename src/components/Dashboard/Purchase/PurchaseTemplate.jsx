import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../../Api";
import PurchaseList from "./PurchaseList";
import SearchCompo from "../../utils/SearchCompo";
import FilterBox from "./FilterBox";
import ExcelExportButton from "../../ExcelExportButton";
import { useNavigate } from "react-router-dom";
import { Button } from "@nextui-org/react";

export default function PurchaseTemplate() {
  const [purchases, setPurchases] = useState([]);

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

  const PURCHASE_API = {
    INDEX: BASE_URL + "/purchase",
    IMPORT: BASE_URL + "/purchase/import-excel",
    EXPORT: BASE_URL + "/purchaselines/export-excel",
  };

  const fetchPurchaseData = async () => {
    try {
      const response = await axios.get(PURCHASE_API.INDEX, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
          "Content-Type": "application/json",
        },
      });
      const filteredPurchase = response.data?.data.filter(
        (loca) => loca.active === true
      );
      setPurchases(filteredPurchase);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchPurchaseData();
  }, [token]);

  const handleFilterChange = (selected) => {
    setFilteredKeywords((prevFilter) => ({
      ...prevFilter,
      ...selected,
    }));
  };
  const filteredPurchase = useMemo(
    () =>
      purchases.filter((pur) => {
        let { name, location, created, orderRef, scheduledDate, state, total } =
          filteredKeywords;

        const isName = () => {
          if (!name) {
            return true;
          }

          if (pur.partner.name) {
            return pur.partner.name.toLowerCase().includes(name.toLowerCase());
          }

          return false;
        };

        const isLocation = () => {
          if (!location) {
            return true;
          }
          if (pur.location.name) {
            return pur.location.name
              .toLowerCase()
              .includes(location.toLowerCase());
          }
        };
        const isCreateDate = () => {
          if (!created) {
            return true;
          }

          if (pur.createdAt) {
            const purchaseCreated = pur.createdAt.split("T")[0];

            return purchaseCreated === created;
          }
          return false;
        };
        const isOrderRef = () => {
          if (!orderRef) {
            return true;
          }
          if (pur.orderRef) {
            return pur.orderRef.includes(orderRef);
          }

          return false;
        };
        const isScheduledDate = () => {
          if (!scheduledDate) {
            return true;
          }

          if (pur.scheduledDate) {
            const scheduledDatePart = pur.scheduledDate.split("T")[0];

            return scheduledDatePart === scheduledDate;
          }
          return false;
        };
        const isState = () => {
          if (!state) {
            return true;
          }

          if (pur.state) {
            return pur.state.toLowerCase().includes(state.toLowerCase());
          }
        };

        const isTotal = () => {
          if (!pur.total || !total.comparison) return true;

          const QTY = pur.total || 0;

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
    [purchases, filteredKeywords]
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
            onClick={() => navigate("/admin/purchase/create")}
            className="font-bold rounded-sm shadow-sm bg-zinc-50 flex items-center text-blue-700 border-blue-500 border-2 hover:opacity-75 text-sm hover:text-white hover:bg-blue-700 px-3 py-1.5"
          >
            Add
          </Button>
          <FilterBox onFilter={handleFilterChange} />
          <div className="mx-3">
            <ExcelExportButton
              token={token.accessToken}
              apiEndpoint={PURCHASE_API.EXPORT}
            />
          </div>
        </div>
      </div>
      <PurchaseList purchases={filteredPurchase} refresh={fetchPurchaseData} />
    </>
  );
}
