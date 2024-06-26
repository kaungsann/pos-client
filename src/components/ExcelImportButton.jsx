import { useRef, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Spinner,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import PropTypes from "prop-types";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDropzone } from "react-dropzone";

const ExcelImportButton = ({ token, apiEndpoint, onSuccess, templateLink }) => {
  const uploadRef = useRef(null);
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [selectedFileName, setSelectedFileName] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      handleFileChange(file);
    },
  });

  const handleFileChange = async (file) => {
    setSelectedFileName(file.name);
    setSelectedFile(file);
  };

  const onSubmitHandler = async () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("excel", selectedFile);

    try {
      const response = await axios.post(apiEndpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("error is a", response);
      if (response.status) {
        setIsLoading(false);
        setSelectedFileName(null);
        setSelectedFile(null);
        onClose();
        onSuccess();
        toast.success(response.data.message);
      } else {
        setIsLoading(false);
        toast.error(response.data.message);
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(error.response.data.message);
      console.error("Error uploading file:", error);
    }
    setIsLoading(false);
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
            Import Excel
          </ModalHeader>
          <h1
            onClick={() => {
              setSelectedFile(null);
              setSelectedFileName("");
              setIsLoading(false);
            }}
            className="text-sm font-semibold text-slate-500 text-end mr-8 cursor-pointer hover:opacity-80"
          >
            Clear File
          </h1>
          <ModalBody>
            <div
              onClick={() => uploadRef.current.click()}
              {...getRootProps()}
              className="grid grid-cols-1 gap-2 place-content-center border-dashed hover:bg-blue-100 border-2 rounded-sm border-slate-500 bg-blue-50 h-40"
            >
              <input
                type="file"
                ref={uploadRef}
                style={{ display: "none" }}
                {...getInputProps()}
                onChange={(e) => handleFileChange(e.target.files[0])}
              />
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
                href={templateLink}
                className="w-3/6 flex justify-center rounded-sm shadow-sm items-center text-[#15803d] border-[#15803d] bg-white border-2 hover:opacity-75 text-sm hover:text-white hover:bg-green-700 font-bold px-3 py-1.5"
              >
                Download Template
              </a>
              <button
                className={`w-3/6 relative flex justify-center ml-3 font-bold text-center rounded-sm shadow-sm items-center border-blue-500 border-2 hover:opacity-75 text-sm text-white bg-blue-500 px-3 py-1.5 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isLoading}
                onClick={() => onSubmitHandler()}
              >
                {isLoading && (
                  <Spinner
                    size="sm"
                    color="#22d3ee"
                    className="absolute top-0 bottom-0 font-bold right-0 left-0"
                  />
                )}
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
  onSuccess: PropTypes.func,
  templateLink: PropTypes.string,
};

export default ExcelImportButton;
