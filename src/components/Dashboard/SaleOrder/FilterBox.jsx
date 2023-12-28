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
  const [orderRef, setOrderRef] = useState("");
  const [created, setCreated] = useState("");
  const [total, setTotal] = useState("");
  const [totalComparison, setTotalComparison] = useState("");

  const [isFilterActive, setIsFilterActive] = useState(false);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleFilterClick = () => {
    setIsFilterActive(!isFilterActive);
    onFilter({
      name,
      location,
      orderRef,
      created,
      total: {
        value: total,
        comparison: totalComparison,
      },
    });
  };

  const handleClearFiltersClick = () => {
    setIsFilterActive(!isFilterActive);
    setLocation("");
    setOrderRef("");
    setTotalComparison("");
    setCreated("");
    setTotal("");

    onFilter({
      name: "",
      location: "",
      orderRef: "",
      created: "",
      total: {
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
                    variant="bordered"
                    radius="sm"
                    size="md"
                    label="Location"
                    placeholder="Enter loction name"
                    labelPlacement="outside"
                    
                    onChange={(e) => setLocation(e.target.value)}
                  />
                  <Input
                    type="date"
                    variant="bordered"
                    radius="sm"
                    size="md"
                    label="Scheduled-Date"
                    placeholder="Enter schedule date"
                    labelPlacement="outside"
                    className="ml-2"
                    onChange={(e) => setCreated(e.target.value)}
                  />
                </div>
                <Input
                  type="text"
                  label="OrderRef"
                  variant="bordered"
                  radius="sm"
                  size="md"
                  placeholder="Enter orderRef"
                  labelPlacement="outside"
                 
                  onChange={(e) => setOrderRef(e.target.value)}
                />

                <div className="container flex flex-col mt-2">
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      variant="bordered"
                      id="total"
                      onChange={(e) => setTotal(e.target.value)}
                      value={total || ""}
                      radius="sm"
                      placeholder="Enter amount"
                      label="Amount"
                      labelPlacement="outside"
                      size="md"
                    />
                    <Select
                      variant="bordered"
                      radius="sm"
                      label="Comparison"
                      labelPlacement="outside"
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
