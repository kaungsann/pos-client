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
  const [name, setName] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [taxRate, setTaxRate] = useState("");

  const [isFilterActive, setIsFilterActive] = useState(false);
  const [totalComparison, setTotalComparison] = useState("");

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleFilterClick = () => {
    setIsFilterActive(!isFilterActive);
    onFilter({
      name,
      createdAt,
      taxRate: {
        value: taxRate,
        comparison: totalComparison,
      },
    });
  };

  const handleClearFiltersClick = () => {
    setIsFilterActive(!isFilterActive);
    setTaxRate("");
    setName("");
    setTotalComparison("");
    setCreatedAt("");
    onFilter({
      name: "",
      createdAt: "",
      taxRate: {
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
                    type="date"
                    label="Date"
                    variant="bordered"
                    radius="sm"
                    size="md"
                    placeholder="Enter created date"
                    labelPlacement="outside"
                    onChange={(e) => setCreatedAt(e.target.value)}
                  />
                </div>
                <div className="container flex flex-col">
                  <span className=" text-sm  mb-2">Amount</span>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      variant="bordered"
                      id="total"
                      onChange={(e) => setTaxRate(e.target.value)}
                      value={taxRate || ""}
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
                      onChange={(e) => setTotalComparison(e.target.value)}
                      value={totalComparison}
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
