import React, { useEffect, useMemo, useState } from "react";
import SearchCompo from "../../utils/SearchCompo";
import FilterBox from "./FilterBox";
import OpexList from "./TaxList";
import { BASE_URL } from "../../Api";
import { Button } from "@nextui-org/react";

import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function TaxTemplate() {
  const [tax, setTax] = useState([]);

  const COMPARISION = {
    LESS: "LESS",
    GREATER: "GREATER",
  };

  const [filteredKeywords, setFilteredKeywords] = useState({
    name: "",
    taxRate: {
      value: 0,
      comparison: "",
    },
  });

  const TAX_API = {
    INDEX: BASE_URL + "/tax",
  };

  const navigate = useNavigate();
  const token = useSelector((state) => state.IduniqueData);

  const fetchTaxData = async () => {
    try {
      const response = await axios.get(TAX_API.INDEX, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
          "Content-Type": "application/json",
        },
      });

      const validTaxFilter = response.data.data.filter(
        (tax) => tax.active === true
      );

      setTax(validTaxFilter);
    } catch (error) {
      console.error("Error fetching tax:", error);
    }
  };

  useEffect(() => {
    fetchTaxData();
  }, [token]);

  const handleFilterChange = (selected) => {
    setFilteredKeywords((prevFilter) => ({
      ...prevFilter,
      ...selected,
    }));
  };
  const filteredTax = useMemo(
    () =>
      tax.filter((tx) => {
        const { name, taxRate } = filteredKeywords;

        const isName = () => {
          if (!name) {
            return true;
          }

          if (tx.name) {
            return tx.name.includes(name);
          }

          return false;
        };
        const isTaxRate = () => {
          if (!tx.amount || !tx.comparison) return true;

          const QTY = tx.amount || 0;

          return (
            (taxRate.comparison === COMPARISION.LESS && QTY < taxRate.value) ||
            (taxRate.comparison === COMPARISION.GREATER && QTY > taxRate.value)
          );
        };

        return tx.name.includes(name) && isName() && isTaxRate();
      }),
    [tax, filteredKeywords]
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
            onPress={() => navigate("/admin/tax/create")}
            className="font-bold rounded-sm shadow-sm flex bg-zinc-50 items-center text-blue-700 border-blue-500 border-2 hover:opacity-75 text-sm hover:text-white hover:bg-blue-700 px-3 py-1.5"
          >
            Add
          </Button>
          <FilterBox onFilter={handleFilterChange} />
        </div>
      </div>
      <OpexList taxs={filteredTax} refresh={fetchTaxData} />
    </>
  );
}

export default TaxTemplate;
