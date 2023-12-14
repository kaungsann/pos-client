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
  const [productBarcode, setProductBarcode] = useState("");
  const [locationName, setLocationName] = useState("");

  const [isFilterActive, setIsFilterActive] = useState(false);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleFilterClick = () => {
    setIsFilterActive(!isFilterActive);
    onFilter({
      productBarcode,
      locationName,
    });
  };

  const handleClearFiltersClick = () => {
    setIsFilterActive(!isFilterActive);
    setProductBarcode("");
    setLocationName("");

    onFilter({
      productBarcode: "",
      locationName: "",
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
                <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                  <Input
                    type="text"
                    label="Product Barcode"
                    placeholder="enter barcodes"
                    labelPlacement="outside"
                    className="ml-2"
                    onChange={(e) => setProductBarcode(e.target.value)}
                  />
                </div>
                <div className="flex justify-between">
                  <Input
                    type="text"
                    label="Location"
                    placeholder="enter location name"
                    labelPlacement="outside"
                    className="ml-2"
                    onChange={(e) => setLocationName(e.target.value)}
                  />
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
