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
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [birthdate, setBirthDate] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState(0);
  const [city, setCity] = useState("");
  const [gender, setGender] = useState("");

  const [isFilterActive, setIsFilterActive] = useState(false);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleFilterClick = () => {
    setIsFilterActive(!isFilterActive);
    onFilter({
      username,
      email,
      gender,
      city,
      address,
      phone,
      birthdate,
    });
  };

  const handleClearFiltersClick = () => {
    setIsFilterActive(!isFilterActive);
    setUserName("");
    setEmail("");
    setAddress("");
    setBirthDate("");
    setPhone("");
    setCity("");
    setGender("");
    onFilter({
      username: "",
      email: "",
      birthdate: "",
      address: "",
      phone: "",
      city: "",
      gender: "",
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
                  <Input
                    type="email"
                    variant="faded"
                    label="Email"
                    placeholder="example@gmail.com"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="flex justify-between">
                  <Input
                    type="number"
                    label="Phone"
                    placeholder="09 ..."
                    labelPlacement="outside"
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <Input
                    type="text"
                    label="City"
                    placeholder="enter city"
                    labelPlacement="outside"
                    className="ml-2"
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div className="flex justify-between">
                  <Input
                    type="date"
                    label="DateOfBirth"
                    placeholder="enter birthdate"
                    labelPlacement="outside"
                    className="ml-2"
                    onChange={(e) => setBirthDate(e.target.value)}
                  />
                </div>
                <div className="flex justify-between">
                  <Select
                    label="Gender"
                    placeholder="Select a gender"
                    labelPlacement="outside"
                    className="max-w-xs"
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <SelectItem value="male" key="male">
                      Male
                    </SelectItem>
                    <SelectItem value="female" key="female">
                      Female
                    </SelectItem>
                  </Select>

                  <Input
                    type="text"
                    label="address"
                    placeholder="enter address"
                    labelPlacement="outside"
                    className="ml-2"
                    onChange={(e) => setAddress(e.target.value)}
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
