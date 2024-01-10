import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../Api";
import { Listbox, ListboxItem } from "@nextui-org/react";

export default function DiscountBox() {
  const [discount, setDiscount] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState(new Set(["text"]));

  const DISCOUNT_API = {
    INDEX: BASE_URL + "/discount",
  };

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
        (dis) => dis.active === true
      );

      setDiscount(validDiscountFilter);
    } catch (error) {
      console.error("Error fetching discount:", error);
    }
  };

  useEffect(() => {
    fetchDiscountData();
  }, [token]);
  return (
    <>
      <div className="w-full h-auto p-3 overflow-scroll z-50 absolute bottom-0  bg-orange-400">
        <h2 className="text-lg font-semibold text-slate-500">Promtion</h2>

        <Listbox
          aria-label="Single selection example"
          variant="flat"
          disallowEmptySelection
          selectionMode="single"
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
        >
          <ListboxItem key="text">Text</ListboxItem>
          <ListboxItem key="number">Number</ListboxItem>
          <ListboxItem key="date">Date</ListboxItem>
          <ListboxItem key="single_date">Single Date</ListboxItem>
          <ListboxItem key="iteration">Iteration</ListboxItem>
        </Listbox>
      </div>
    </>
  );
}
