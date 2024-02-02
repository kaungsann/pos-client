import { useEffect, useState } from "react";
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
import { getApi } from "../Api";
import { useSelector } from "react-redux";

const FilterBox = ({ onFilter }) => {
  const [location, setLocation] = useState("");
  const [productName, setProductName] = useState("");
  const [onhand, setOnHand] = useState("");
  const [onHandComparison, setOnHandComparison] = useState("");

  const [locations, setLocations] = useState([]);

  const [isFilterActive, setIsFilterActive] = useState(false);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const token = useSelector((state) => state.IduniqueData);

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

  useEffect(() => {
    const getLocation = async () => {
      const resData = await getApi("/location", token.accessToken);
      const filteredLocation = resData.data.filter((la) => la.active === true);
      setLocations(filteredLocation);
    };

    getLocation();
  }, []);

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
                  <Select
                    labelPlacement="outside"
                    label="Location"
                    name="location"
                    variant="bordered"
                    placeholder="Select an Location"
                    onChange={(e) => setLocation(e.target.value)}
                  >
                    {locations.map((loc) => (
                      <SelectItem key={loc.name} value={loc.name}>
                        {loc.name}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                <div className="container flex flex-col mt-2">
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      variant="bordered"
                      id="price"
                      label="On-Hand Quantity"
                      labelPlacement="outside"
                      onChange={(e) => setOnHand(e.target.value)}
                      value={onhand || ""}
                      radius="sm"
                      placeholder="Enter on-hand quantity"
                      size="md"
                    />
                    <Select
                      variant="bordered"
                      radius="sm"
                      label="Comparison"
                      placeholder="Select comparison"
                      labelPlacement="outside"
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
