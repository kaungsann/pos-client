import { useState } from "react";
import PropTypes from "prop-types";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";

const FilterBox = ({ categories, onFilter }) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [price, setPrice] = useState("");
  const [priceComparison, setPriceComparison] = useState("LESS");
  const [isFilterActive, setIsFilterActive] = useState(false);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleFilterClick = () => {
    setIsFilterActive(!isFilterActive);
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
    setIsFilterActive(!isFilterActive);
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
    <>
      <button
        onClick={isFilterActive ? handleClearFiltersClick : onOpen}
        className={`rounded-sm ml-3 transition shadow-sm flex items-center ${
          isFilterActive
            ? "text-red-500 border-red-500 hover:bg-red-500"
            : "text-[#4338ca] border-[#4338ca] hover:bg-[#4338ca]"
        } border-2 hover:opacity-75 text-sm hover:text-white bg-white  font-bold px-3 py-1.5`}
      >
        <Icon icon="basil:filter-outline" className="text-lg" />
        {isFilterActive ? "Remove" : "Filter"}
      </button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Filter by
              </ModalHeader>
              <ModalBody>
                <Select
                  label="Category"
                  placeholder="Select category"
                  id="category"
                  isClearable
                  radius="sm"
                  variant="bordered"
                  items={categories}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <SelectItem key="" value="">
                    All
                  </SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </Select>

                <div className="container flex flex-col">
                  <span className="font-semibold text-xs mx-2">
                    Expired Date
                  </span>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Date"
                      type="date"
                      variant="bordered"
                      id="startDate"
                      value={startDate || ""}
                      onChange={(e) => setStartDate(e.target.value)}
                      radius="sm"
                    />
                    <Input
                      type="date"
                      variant="bordered"
                      id="endDate"
                      value={endDate || ""}
                      onChange={(e) => setEndDate(e.target.value)}
                      radius="sm"
                    />
                  </div>
                </div>

                <div className="container flex flex-col">
                  <span className="font-semibold text-xs mx-2">Sale Price</span>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      variant="bordered"
                      id="price"
                      onChange={(e) => setPrice(e.target.value)}
                      value={price || ""}
                      radius="sm"
                      placeholder="Enter amount"
                      size="md"
                    />
                    <Select
                      variant="bordered"
                      radius="sm"
                      label="Comparison"
                      placeholder="Select comparison"
                      id="priceComparison"
                      onChange={(e) => setPriceComparison(e.target.value)}
                      value={priceComparison}
                    >
                      <SelectItem value="LESS" key="LESS">
                        Less Than
                      </SelectItem>
                      <SelectItem value="GREATER" key="GREATER">
                        Greater Than
                      </SelectItem>
                    </Select>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={onClose}
                  onClick={handleFilterClick}
                >
                  Apply
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

FilterBox.propTypes = {
  categories: PropTypes.array,
  onFilter: PropTypes.func,
};

export default FilterBox;
