import { useEffect, useMemo, useState } from "react";
//import FilterBox from "./FilterBox";
import { BASE_URL } from "../../Api";
import { Button } from "@nextui-org/react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import UomList from "./UomList";
import SearchCompo from "../../utils/SearchCompo";

export default function UomTemplate() {
  const [units, setUnits] = useState([]);

  const COMPARISION = {
    LESS: "LESS",
    GREATER: "GREATER",
  };

  const [filteredKeywords, setFilteredKeywords] = useState({
    name: "",
    refType: 0,
    ratio: {
      value: 0,
      comparison: "",
    },
  });

  const UOM_API = {
    INDEX: BASE_URL + "/uom",
  };

  const navigate = useNavigate();
  const token = useSelector((state) => state.IduniqueData);

  const fetchUomData = async () => {
    try {
      const response = await axios.get(UOM_API.INDEX, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
          "Content-Type": "application/json",
        },
      });

      const validUnitFilter = response.data.data.filter(
        (tax) => tax.active === true
      );

      setUnits(validUnitFilter);
    } catch (error) {
      console.error("Error fetching uom:", error);
    }
  };

  useEffect(() => {
    fetchUomData();
  }, [token]);

  const handleFilterChange = (selected) => {
    setFilteredKeywords((prevFilter) => ({
      ...prevFilter,
      ...selected,
    }));
  };

  const filteredUnitOfMeasure = useMemo(
    () =>
      units.filter((un) => {
        const { name, refType, raito } = filteredKeywords;

        const isName = () => {
          if (!name) {
            return true;
          }

          if (un.name) {
            return un.name.toLowerCase().includes(name.toLocaleLowerCase());
          }

          return false;
        };
        const isDiscountRate = () => {
          if (!un.raito || !raito.comparison) return true;

          const QTY = un.raito || 0;

          return (
            (raito.comparison === COMPARISION.LESS && QTY < raito.value) ||
            (raito.comparison === COMPARISION.GREATER && QTY > raito.value)
          );
        };

        const isRefType = () => {
          if (!refType) {
            return true;
          }

          if (un.refType) {
            return un.refType
              .toLowerCase()
              .includes(refType.toLocaleLowerCase());
          }
        };

        return (
          un.name.toLowerCase().includes(name.toLocaleLowerCase()) &&
          isName() &&
          isDiscountRate() &&
          isRefType()
        );
      }),
    [units, filteredKeywords]
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
            onPress={() => navigate("/admin/uom/create")}
            className="font-bold rounded-sm shadow-sm flex bg-zinc-50 items-center text-blue-700 border-blue-500 border-2 hover:opacity-75 text-sm hover:text-white hover:bg-blue-700 px-3 py-1.5"
          >
            Add
          </Button>
          {/* <FilterBox onFilter={handleFilterChange} /> */}
        </div>
      </div>
      <UomList units={filteredUnitOfMeasure} />
    </>
  );
}
