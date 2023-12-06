import { useState } from "react";
import PropTypes from "prop-types";
import { Select, SelectItem } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/react";

const FilterBox = ({ categories, onFilter, show }) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [price, setPrice] = useState("");
  const [priceComparison, setPriceComparison] = useState("LESS");

  console.log(
    "select category and start date and ende date & price and priceComparison ",
    selectedCategory,
    endDate,
    startDate,
    price,
    priceComparison
  );

  const handleFilterClick = () => {
    onFilter({
      category: selectedCategory,
      startDate,
      endDate,
      price: {
        value: price,
        comparison: priceComparison,
      },
    });
  };

  const handleClearFiltersClick = () => {
    setSelectedCategory("");
    setStartDate("");
    setEndDate("");
    setPrice("");
    setPriceComparison("LESS");
    onFilter({
      category: "",
      startDate: "",
      endDate: "",
      price: {
        value: "",
        comparison: "LESS",
      },
    });
  };

  return (
    <div>
      <div className="w-full flex justify-around items-center bg-white shadow-md rounded-md py-3">
        <div className="flex flex-col">
          <label className="text-md font-semibold my-2">Category</label>
          <Select
            variant="bordered"
            placeholder="select category"
            className="w-52"
            onChange={(e) => setSelectedCategory(e.target.value)}
            isClearable
            value={selectedCategory}
            radius="sm"
            classNames={{
              trigger: "h-[38px]",
            }}
          >
            <SelectItem value="">All</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </Select>
        </div>

        <div className="flex flex-col">
          <label className="text-md font-semibold my-2">Start Date</label>
          <Input
            type="date"
            variant="bordered"
            id="startDate"
            value={startDate || ""}
            onChange={(e) => setStartDate(e.target.value)}
            radius="sm"
            classNames={{
              inputWrapper: ["shadow-sm h-[12px]"],
            }}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-md font-semibold my-2">End Date</label>
          <Input
            type="date"
            variant="bordered"
            id="endDate"
            value={endDate || ""}
            onChange={(e) => setEndDate(e.target.value)}
            radius="sm"
            classNames={{
              inputWrapper: ["shadow-sm h-[12px]"],
            }}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-md font-semibold my-2">Price</label>
          <Input
            type="number"
            variant="bordered"
            id="price"
            onChange={(e) => setPrice(e.target.value)}
            value={price || ""}
            radius="sm"
            classNames={{
              inputWrapper: ["shadow-sm  h-[12px]"],
            }}
            placeholder="enter the price"
            size="md"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-md font-semibold my-2">Price Comparison</label>
          <Select
            variant="bordered"
            radius="sm"
            id="priceComparison"
            onChange={(e) => setPriceComparison(e.target.value)}
            value={priceComparison}
            classNames={{
              trigger: "h-[38px]",
            }}
          >
            <SelectItem value="LESS" selected>
              Less Than
            </SelectItem>
            <SelectItem value="GREATER">Greater Than</SelectItem>
          </Select>
        </div>

        <div className="flex items-center mx-3 mt-8">
          <Button
            color="primary"
            variant="bordered"
            onClick={handleFilterClick}
            className="mx-3"
          >
            Apply
          </Button>
          <Button color="danger" onClick={handleClearFiltersClick}>
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
};

FilterBox.propTypes = {
  categories: PropTypes.array,
  onFilter: PropTypes.func,
};

export default FilterBox;
