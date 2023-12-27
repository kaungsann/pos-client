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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ExcelImportButton = ({ token, apiEndpoint, text, ExcelLink }) => {
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
      if (response.status) {
        onClose();
        setSelectedFileName(null);
      }

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

  const handleFileImportClick = () => {
    importRef.current.click();
  };

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
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
              className="grid grid-cols-1 gap-2 place-content-center border-dashed hover:bg-blue-100 border-2 rounded-sm border-slate-500 bg-blue-50 h-40"
            >
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
            <div className="flex w-full">
              <a
                href={ExcelLink}
                download
                className="w-3/6 flex justify-center rounded-sm shadow-sm items-center text-[#15803d] border-[#15803d] bg-white border-2 hover:opacity-75 text-sm hover:text-white hover:bg-green-700 font-bold px-3 py-1.5"
              >
                Download Template
              </a>
              <button
                className="w-3/6 flex justify-center ml-3 font-bold text-center rounded-sm shadow-sm items-center border-blue-500 border-2 hover:opacity-75 text-sm text-white bg-blue-500 px-3 py-1.5"
                //onClick={() => handleFileChange(null, handleApiSubmit)}
                onClick={() => handleFileChange(uploadRef.current.files[0])}
              >
                Submit
              </button>
            </div>
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
