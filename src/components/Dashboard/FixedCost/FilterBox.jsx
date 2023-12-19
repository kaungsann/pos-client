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
  const [date, setDate] = useState("");
  const [ref, setRef] = useState("");
  const [created, setCreated] = useState("");
  const [state, setState] = useState("");
  const [amount, setMount] = useState("");

  const [isFilterActive, setIsFilterActive] = useState(false);
  const [totalComparison, setTotalComparison] = useState("");

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  console.log("date is a", date);

  const handleFilterClick = () => {
    setIsFilterActive(!isFilterActive);
    onFilter({
      name,
      ref,
      date,
      state,
      created,
      amount: {
        value: amount,
        comparison: totalComparison,
      },
    });
  };

  const handleClearFiltersClick = () => {
    setIsFilterActive(!isFilterActive);
    setDate("");
    setRef("");
    setTotalComparison("");
    setCreated("");
    setState("");
    setMount("");
    onFilter({
      name: "",
      ref: "",
      date: "",
      state: "",
      created: "",
      amount: {
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
                <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                  <Select
                    label="Select State"
                    placeholder="Select a state"
                    labelPlacement="outside"
                    variant="bordered"
                    radius="sm"
                    size="md"
                    onChange={(e) => setState(e.target.value)}
                  >
                    <SelectItem key="pending" value="pending">
                      Pending
                    </SelectItem>
                    <SelectItem key="approved" value="approved">
                      Approved
                    </SelectItem>
                    <SelectItem key="rejected" value="rejected">
                      Rejected
                    </SelectItem>
                  </Select>
                </div>
                <div className="flex justify-between">
                  <Input
                    type="date"
                    label="Date"
                    variant="bordered"
                    radius="sm"
                    size="md"
                    placeholder="Enter created date"
                    labelPlacement="outside"
                    className="ml-2"
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <Input
                  type="text"
                  variant="bordered"
                  radius="sm"
                  size="md"
                  label="Ref"
                  placeholder="Enter ref"
                  labelPlacement="outside"
                  className="ml-2"
                  onChange={(e) => setRef(e.target.value)}
                />
                <div className="container flex flex-col">
                  <span className="font-semibold text-sm mx-2 mb-2">
                    Amount
                  </span>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      variant="bordered"
                      id="total"
                      onChange={(e) => setMount(e.target.value)}
                      value={amount || ""}
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
