import { useEffect, useMemo, useState } from "react";
import SearchCompo from "../../utils/SearchCompo";
import FilterBox from "./FilterBox";
import DiscountList from "./DiscountList";
import { BASE_URL } from "../../Api";
import { Button } from "@nextui-org/react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function DiscountTemplate() {
  const [discount, setDiscount] = useState([]);

  const COMPARISION = {
    LESS: "LESS",
    GREATER: "GREATER",
  };

  const [filteredKeywords, setFilteredKeywords] = useState({
    name: "",
    createdAt: "",
    amount: {
      value: 0,
      comparison: "",
    },
  });

  const DISCOUNT_API = {
    INDEX: BASE_URL + "/discount",
  };

  const navigate = useNavigate();
  const token = useSelector((state) => state.IduniqueData);

  const fetchDiscountData = async () => {
    try {
      const response = await axios.get(DISCOUNT_API.INDEX, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
          "Content-Type": "application/json",
        },
      });

      const validDiscountFilter = response.data.data.filter(
        (tax) => tax.active === true
      );

      setDiscount(validDiscountFilter);
    } catch (error) {
      console.error("Error fetching discount:", error);
    }
  };

  useEffect(() => {
    fetchDiscountData();
  }, [token]);

  const handleFilterChange = (selected) => {
    setFilteredKeywords((prevFilter) => ({
      ...prevFilter,
      ...selected,
    }));
  };

  const filteredDiscount = useMemo(
    () =>
      discount.filter((dis) => {
        const { name, amount, createdAt } = filteredKeywords;

        const isName = () => {
          if (!name) {
            return true;
          }

          if (dis.name) {
            return dis.name.toLowerCase().includes(name.toLocaleLowerCase());
          }

          return false;
        };
        const isDiscountRate = () => {
          if (!dis.amount || !amount.comparison) return true;

          const QTY = dis.amount || 0;

          return (
            (amount.comparison === COMPARISION.LESS && QTY < amount.value) ||
            (amount.comparison === COMPARISION.GREATER && QTY > amount.value)
          );
        };

        const isDate = () => {
          if (!createdAt) {
            return true;
          }

          if (dis.createdAt) {
            const discountDate = dis.createdAt.split("T")[0];

            return discountDate === createdAt;
          }
        };
        return (
          dis.name.toLowerCase().includes(name.toLocaleLowerCase()) &&
          isName() &&
          isDiscountRate() &&
          isDate()
        );
      }),
    [discount, filteredKeywords]
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
            onPress={() => navigate("/admin/discount/create")}
            className="font-bold rounded-sm shadow-sm flex bg-zinc-50 items-center text-blue-700 border-blue-500 border-2 hover:opacity-75 text-sm hover:text-white hover:bg-blue-700 px-3 py-1.5"
          >
            Add
          </Button>
          <FilterBox onFilter={handleFilterChange} />
        </div>
      </div>
      <DiscountList discounts={filteredDiscount} refresh={fetchDiscountData} />
    </>
  );
}

export default DiscountTemplate;
