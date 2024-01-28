import { useEffect, useMemo, useState } from "react";
//import SearchCompo from "../../utils/SearchCompo";
import FilterBox from "./FilterBox";
import OpexList from "./OpexList";
import { BASE_URL } from "../../Api";
import { Button, Select, SelectItem } from "@nextui-org/react";

import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function OpexTemplate() {
  const [opex, setOpex] = useState([]);
  const [selectedOpexType, setSelectedOpexType] = useState("");

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
    INDEX: BASE_URL + "/opex",
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
  const filteredOpex = useMemo(
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

        const isOpexType = () => {
          if (
            !selectedOpexType ||
            typeof selectedOpexType !== "string" ||
            !op.name
          ) {
            return true;
          }

          return op.name.toLowerCase().includes(selectedOpexType.toLowerCase());
        };

        return (
          op.name.toLowerCase().includes(name.toLowerCase()) &&
          isName() &&
          isMount() &&
          isState() &&
          isCreated() &&
          isDate() &&
          isRef() &&
          isOpexType()
        );
      }),
    [opex, filteredKeywords, selectedOpexType]
  );

  return (
    <>
      <div className="flex justify-between items-center my-3">
        {/* <SearchCompo
          keyword={filteredKeywords.name}
          onSearch={handleFilterChange}
        /> */}

        <Select
          labelPlacement="outside"
          label="Opex"
          name="name"
          placeholder="Select Opex Type"
          className="max-w-xs"
          value={selectedOpexType}
          onChange={(e) => setSelectedOpexType(e.target.value)}
        >
          <SelectItem key="fuel" value="fuel">
            Fuel
          </SelectItem>
          <SelectItem key="salary" value="salary">
            Salary
          </SelectItem>
          <SelectItem key="incentive or Bonus" value="incentive or Bonus">
            Incentive or Bonus
          </SelectItem>
          <SelectItem key="maintaince & repair" value="maintaince & repair">
            Mantaince & Repair
          </SelectItem>
          <SelectItem key="software & License" value="software & License">
            Software & License
          </SelectItem>
          <SelectItem key="3rd party hiring" value="3rd party hiring">
            3rd party hiring
          </SelectItem>
        </Select>

        <div className="flex">
          <Button
            size="sm"
            onPress={() => navigate("/admin/opex/create")}
            className="font-bold rounded-sm shadow-sm flex bg-zinc-50 items-center text-blue-700 border-blue-500 border-2 hover:opacity-75 text-sm hover:text-white hover:bg-blue-700 px-3 py-1.5"
          >
            Add
          </Button>
          <FilterBox onFilter={handleFilterChange} context="amount" />
        </div>
      </div>
      <OpexList opexs={filteredOpex} refresh={fetchOpexData} />
    </>
  );
}

export default OpexTemplate;
