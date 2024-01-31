import { useEffect, useMemo, useState } from "react";
//import SearchCompo from "../../utils/SearchCompo";
import FilterBox from "./FilterBox";
import { BASE_URL } from "../../Api";
import { Button, Select, SelectItem } from "@nextui-org/react";

import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FixedCostList from "./FilterCostList";

function FixedCostTemplate() {
  const [opex, setOpex] = useState([]);
  const [selectedFixCostType, setSelectedFixCostType] = useState("");

  const COMPARISION = {
    LESS: "LESS",
    GREATER: "GREATER",
  };

  const [filteredKeywords, setFilteredKeywords] = useState({
    name: "",
    ref: "",
    date: "",
    state: "",
    createdAt: "",
    amount: {
      value: 0,
      comparison: "",
    },
  });

  const OPEX_API = {
    INDEX: BASE_URL + "/fixed-cost",
  };

  const navigate = useNavigate();
  const token = useSelector((state) => state.IduniqueData);

  const fetchOpexData = async () => {
    try {
      const response = await axios.get(OPEX_API.INDEX, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
          "Content-Type": "application/json",
        },
      });

      setOpex(response.data.data);
    } catch (error) {
      console.error("Error fetching opex:", error);
    }
  };

  useEffect(() => {
    fetchOpexData();
  }, [token]);

  const handleFilterChange = (selected) => {
    setFilteredKeywords((prevFilter) => ({
      ...prevFilter,
      ...selected,
    }));
  };
  const filteredFixedCost = useMemo(
    () =>
      opex.filter((op) => {
        const { name, ref, date, amount, state, createdAt } = filteredKeywords;

        const isName = () => {
          if (!name) {
            return true;
          }

          if (op.name) {
            return op.name.toLowerCase().includes(name.toLowerCase());
          }

          return false;
        };
        const isMount = () => {
          if (!op.amount || !amount.comparison) return true;

          const QTY = op.amount || 0;

          return (
            (amount.comparison === COMPARISION.LESS && QTY < amount.value) ||
            (amount.comparison === COMPARISION.GREATER && QTY > amount.value)
          );
        };
        const isState = () => {
          if (!state) {
            return true;
          }

          if (op.state) {
            return op.state.toLowerCase().includes(state.toLowerCase());
          }
          return false;
        };

        const isCreated = () => {
          if (!createdAt) {
            return true;
          }

          if (op.createdAt) {
            return op.createdAt.toLowerCase().includes(createdAt.toLowerCase());
          }

          if (op.createdAt) {
            const opexCreated = op.createdAt.split("T")[0];

            return opexCreated === createdAt;
          }
          return false;
        };

        const isDate = () => {
          if (!date) {
            return true;
          }
          if (op.createdAt) {
            return op.date.toLowerCase().includes(date.toLowerCase());
          }

          if (op.date) {
            const opexDate = op.date.split("T")[0];

            return opexDate === createdAt;
          }
        };

        const isRef = () => {
          if (!ref) {
            return true;
          }

          if (op.ref) {
            return op.ref.toLowerCase().includes(ref.toLowerCase());
          }
          return false;
        };

        const isFixCostType = () => {
          if (
            !selectedFixCostType ||
            typeof selectedFixCostType !== "string" ||
            !op.name
          ) {
            return true;
          }

          return op.name
            .toLowerCase()
            .includes(selectedFixCostType.toLowerCase());
        };

        return (
          op.name.toLowerCase().includes(name.toLowerCase()) &&
          isName() &&
          isMount() &&
          isState() &&
          isCreated() &&
          isDate() &&
          isRef() &&
          isFixCostType()
        );
      }),
    [opex, filteredKeywords, selectedFixCostType]
  );

  return (
    <>
      <div className="flex justify-between items-center my-3">
        {/* <SearchCompo
          keyword={filteredKeywords.name}
          onSearch={handleFilterChange}
        /> */}

        <Select
          name="name"
          placeholder="Select Type"
          classNames={{
            base: "w-60",
            trigger: "h-10 py-3 rounded-md",
          }}
          value={selectedFixCostType}
          onChange={(e) => setSelectedFixCostType(e.target.value)}
        >
          <SelectItem key="rental" value="rental">
            Rental
          </SelectItem>
          <SelectItem key="insurance" value="insurance">
            Insurance
          </SelectItem>
          <SelectItem key="loan" value="loan">
            Loan
          </SelectItem>
          <SelectItem key="depreciation" value="depreciation">
            Depreciation
          </SelectItem>
        </Select>

        <div className="flex">
          <Button
            size="sm"
            onPress={() => navigate("/admin/fixed-cost/create")}
            className="font-bold rounded-sm shadow-sm flex bg-zinc-50 items-center text-blue-700 border-blue-500 border-2 hover:opacity-75 text-sm hover:text-white hover:bg-blue-700 px-3 py-1.5"
          >
            Add
          </Button>
          <FilterBox onFilter={handleFilterChange} context="amount" />
        </div>
      </div>
      <FixedCostList opexs={filteredFixedCost} refresh={fetchOpexData} />
    </>
  );
}

export default FixedCostTemplate;
