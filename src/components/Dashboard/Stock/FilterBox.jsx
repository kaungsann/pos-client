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

const FilterBox = ({ onFilter }) => {
  const [location, setLocation] = useState("");
  const [productName, setProductName] = useState("");
  const [onhand, setOnHand] = useState("");
  const [onHandComparison, setOnHandComparison] = useState("");

  const [isFilterActive, setIsFilterActive] = useState(false);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  console.log("location name is a", location);

  const handleFilterClick = () => {
    setIsFilterActive(!isFilterActive);
    onFilter({
      name: productName,
      location,
      onhand: {
        value: onhand,
        comparison: onHandComparison,
      },
    });
  };

  const handleClearFiltersClick = () => {
    setIsFilterActive(!isFilterActive);
    setLocation("");
    setOnHand("");
    setProductName("");
    onFilter({
      name: "",
      location: "",
      onhand: {
        value: "",
        comparison: "",
      },
    });
  };

  return (
    <>
      <Button
        size="sm"
        onClick={isFilterActive ? handleClearFiltersClick : onOpen}
        className={`rounded-sm ml-3 transition shadow-sm flex items-center ${
          isFilterActive
            ? "text-red-500 border-red-500 hover:bg-red-500"
            : "text-[#4338ca] border-[#4338ca] hover:bg-[#4338ca]"
        } border-2 hover:opacity-75 text-sm hover:text-white bg-white  font-bold px-3 py-1.5`}
      >
        <Icon icon="basil:filter-outline" className="text-lg" />
        {isFilterActive ? "Remove" : "Filter"}
      </Button>
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
                    placeholder="Enter location name"
                    labelPlacement="outside"
                    className="ml-2"
                    onChange={(e) => setLocation(e.target.value)}
                    value={location}
                    variant="bordered"
                    radius="sm"
                    size="md"
                  />
                </div>
                <div className="container flex flex-col">
                  <span className="font-semibold text-sm mx-2 mb-2">
                    OnHand Quantity
                  </span>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      variant="bordered"
                      id="price"
                      onChange={(e) => setOnHand(e.target.value)}
                      value={onhand || ""}
                      radius="sm"
                      placeholder="Enter amount"
                      size="md"
                    />
                    <Select
                      variant="bordered"
                      radius="sm"
                      label="Comparison"
                      placeholder="Select comparison"
                      id="onHandComparison"
                      onChange={(e) => setOnHandComparison(e.target.value)}
                      value={onHandComparison}
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
  onFilter: PropTypes.func,
};

export default FilterBox;
