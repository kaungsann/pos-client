import { useEffect, useMemo, useState } from "react";
//import SearchCompo from "../../utils/SearchCompo";
import FilterBox from "../FixedCost/FilterBox";
import { BASE_URL } from "../../Api";
import { Button, Select, SelectItem } from "@nextui-org/react";
import WasteList from "./WasteList";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function WasteTemplate() {
  const [waste, setWaste] = useState([]);
  const [selectedWasteType, setSelectedWasteType] = useState("");

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
    quantity: {
      value: 0,
      comparison: "",
    },
  });

  const OPEX_API = {
    INDEX: BASE_URL + "/waste",
  };

  const navigate = useNavigate();
  const token = useSelector((state) => state.IduniqueData);

  const fetchWasteData = async () => {
    try {
      const response = await axios.get(OPEX_API.INDEX, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
          "Content-Type": "application/json",
        },
      });

      setWaste(response.data.data);
    } catch (error) {
      console.error("Error fetching waste:", error);
    }
  };

  useEffect(() => {
    fetchWasteData();
  }, [token]);

  const handleFilterChange = (selected) => {
    setFilteredKeywords((prevFilter) => ({
      ...prevFilter,
      ...selected,
    }));
  };
  const filteredWaste = useMemo(
    () =>
      waste.filter((op) => {
        const { name, ref, date, quantity, state, createdAt } =
          filteredKeywords;

        const isName = () => {
          if (!name) {
            return true;
          }

          if (op.name) {
            return op.name.toLowerCase().includes(name.toLowerCase());
          }

          return false;
        };
        const isQuantity = () => {
          if (!op.quantity || !quantity.comparison) return true;

          const QTY = op.quantity || 0;

          return (
            (quantity.comparison === COMPARISION.LESS &&
              QTY < quantity.value) ||
            (quantity.comparison === COMPARISION.GREATER &&
              QTY > quantity.value)
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
        const isWasteType = () => {
          if (
            !selectedWasteType ||
            typeof selectedWasteType !== "string" ||
            !op.name
          ) {
            return true;
          }

          return op.name
            .toLowerCase()
            .includes(selectedWasteType.toLowerCase());
        };

        return (
          op.name.toLowerCase().includes(name.toLowerCase()) &&
          isName() &&
          isQuantity() &&
          isState() &&
          isCreated() &&
          isDate() &&
          isRef() &&
          isWasteType()
        );
      }),
    [waste, filteredKeywords, selectedWasteType]
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
          value={selectedWasteType}
          onChange={(e) => setSelectedWasteType(e.target.value)}
        >
          <SelectItem key="p&l" value="p&l">
            P & L
          </SelectItem>
          <SelectItem key="m&c" value="m&c">
            M&C
          </SelectItem>
        </Select>

        <div className="flex">
          <Button
            size="sm"
            onPress={() => navigate("/admin/waste/create")}
            className="font-bold rounded-sm shadow-sm flex bg-zinc-50 items-center text-blue-700 border-blue-500 border-2 hover:opacity-75 text-sm hover:text-white hover:bg-blue-700 px-3 py-1.5"
          >
            Add
          </Button>
          <FilterBox onFilter={handleFilterChange} context="quantity" />
        </div>
      </div>
      <WasteList opexs={filteredWaste} refresh={fetchWasteData} />
    </>
  );
}

export default WasteTemplate;
