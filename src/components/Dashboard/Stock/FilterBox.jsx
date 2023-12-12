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
} from "@nextui-org/react";
import { Icon } from "@iconify/react";

const FilterBox = ({ onFilter }) => {
  const [location, setLocation] = useState("");
  const [onhand, setOnHand] = useState("");

  const [isFilterActive, setIsFilterActive] = useState(false);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleFilterClick = () => {
    setIsFilterActive(!isFilterActive);
    onFilter({
      location,
      onhand,
    });
  };

  const handleClearFiltersClick = () => {
    setIsFilterActive(!isFilterActive);
    setLocation("");
    setOnHand("");
    onFilter({
      location: "",
      onhand: "",
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
                <div className="flex justify-between">
                  <Input
                    type="text"
                    label="Location"
                    placeholder="enter location name"
                    labelPlacement="outside"
                    className="ml-2"
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <div className="container flex flex-col">
                  <span className="font-semibold text-xs mx-2">
                    OnHand Quantity
                  </span>
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
                <Input
                  type="number"
                  label="On Hand"
                  placeholder="enter the date"
                  labelPlacement="outside"
                  className="ml-2"
                  onChange={(e) => setOnHand(e.target.value)}
                />
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
  onFilter: PropTypes.func,
};

export default FilterBox;
