import { useRef } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Checkbox,
  Input,
  Link,
} from "@nextui-org/react";

import PropTypes from "prop-types";
import axios from "axios";
import { Icon } from "@iconify/react";

const ExcelImportButton = ({ token, apiEndpoint, text }) => {
  const uploadRef = useRef(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("excel", file);

    try {
      const response = await axios.post(apiEndpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("API Response:", response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <>
      <input
        type="file"
        ref={uploadRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <div>
        <Button
          size="sm"
          className="rounded-sm shadow-sms flex items-center  text-[#15803d] border-[#15803d] bg-white border-2 hover:opacity-75 text-sm hover:text-white hover:bg-green-700 font-bold  px-3 py-1.5"
          //onClick={() => uploadRef.current.click()}
          onPress={onOpen}
        >
          Import Excel
        </Button>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Import {text} Excel
              </ModalHeader>
              <ModalBody>
                <div
                  onClick={() => uploadRef.current.click()}
                  className="grid grid-cols-1 gap-2 place-content-center border-dotted hover:bg-zinc-100  border-4 bg-zinc-200 h-40"
                >
                  <Icon
                    icon="line-md:cloud-upload-loop"
                    className="text-6xl text-slate-500 mx-auto"
                  />
                  <h2 className="font-semibold text-lg text-slate-600 text-center mt-2">
                    Drag and Drop File Here
                  </h2>
                </div>
              </ModalBody>
              {/* <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button> */}
              <ModalFooter>
                <a
                  className=" text-blue-600 font-semibold underline
                       underline-offset-1 cursor-pointer hover:opacity-70"
                >
                  Download Template
                </a>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

ExcelImportButton.propTypes = {
  token: PropTypes.string,
  apiEndpoint: PropTypes.string,
};

export default ExcelImportButton;
