import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BASE_URL } from "../Api";
import { Listbox, ListboxItem } from "@nextui-org/react";

export default function DiscountBox({ close }) {
  const [discount, setDiscount] = useState([]);
  const [discountId, setDiscountId] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [selectedKeys, setSelectedKeys] = useState(new Set(["text"]));

  const handleDiscountChange = (e) => {
    const selectedDiscount = discount.find((ds) => ds.id === e.target.value);
    setDiscountId(e.target.value);
    setDiscountAmount(selectedDiscount ? selectedDiscount.amount : 0);
  };

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
      <div
        className={`w-full h-auto p-3 overflow-scroll z-50 absolute bottom-0 custom-scrollbar bg-white shadow-md border-2 border-slate-400 rounded-md`}
      >
        <div className="flex justify-between">
          <h2 className="text-lg font-semibold text-slate-500">Promtion</h2>
          <span
            onClick={close}
            className="text-2xl font-semibold  cursor-pointer text-slate-600 hover:opacity-70"
          >
            x
          </span>
        </div>
        <Listbox
          aria-label="Single selection example"
          variant="flat"
          disallowEmptySelection
          selectionMode="single"
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
          onChange={handleDiscountChange}
        >
          {discount.length > 0 &&
            discount.map((dis, index) => (
              <ListboxItem key={index} value={dis.id}>
                {dis.name + " " + " ( " + dis.amount + "%" + " ) "}
              </ListboxItem>
            ))}
        </Listbox>
      </div>
    </>
  );
}
