import { useRef, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import PropTypes from "prop-types";
import axios from "axios";

const ExcelImportButton = ({ token, apiEndpoint, text }) => {
  const uploadRef = useRef(null);
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [selectedFileName, setSelectedFileName] = useState(null);

  const handleFileChange = async (file, callback) => {
    setSelectedFileName(file.name);

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

      // Call the callback function after successful file upload
      if (callback) {
        callback(response.data);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();

    const file = e.dataTransfer.files[0];
    if (file) {
      // Pass a callback to handleFileChange to call the API after file upload
      handleFileChange(file, handleApiSubmit);
    }
  };

  const handleApiSubmit = (data) => {
    // Perform additional actions after successfully submitting the API
    console.log("API submitted with data:", data);
  };

  return (
    <>
      <input
        type="file"
        ref={uploadRef}
        style={{ display: "none" }}
        onChange={(e) => handleFileChange(e.target.files[0], handleApiSubmit)}
      />
      <div>
        <Button
          size="sm"
          className="rounded-sm shadow-sms flex items-center text-[#15803d] border-[#15803d] bg-white border-2 hover:opacity-75 text-sm hover:text-white hover:bg-green-700 font-bold px-3 py-1.5"
          onPress={onOpen}
        >
          Import Excel
        </Button>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Import {text} Excel
          </ModalHeader>
          <ModalBody>
            <div
              onClick={() => uploadRef.current.click()}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="grid grid-cols-1 gap-2 place-content-center border-dotted hover:bg-zinc-100 border-4 bg-zinc-200 h-40">
              <Icon
                icon="line-md:cloud-upload-loop"
                className="text-6xl text-slate-500 mx-auto"
              />
              <h2 className="font-semibold text-lg text-slate-600 text-center mt-2">
                {selectedFileName
                  ? selectedFileName
                  : "Drag and Drop File Here"}
              </h2>
            </div>
          </ModalBody>
          <ModalFooter>
            <a className="text-blue-600 font-semibold underline underline-offset-1 cursor-pointer hover:opacity-70">
              Download Template
            </a>
            <button
              className="text-white font-semibold bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded ml-2"
              onClick={() => handleFileChange(null, handleApiSubmit)}
            >
              Submit
            </button>
          </ModalFooter>
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
