import { useRef } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const ExcelImportButton = ({ token, apiEndpoint }) => {
  const uploadRef = useRef(null);

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
    <div>
      <input
        type="file"
        ref={uploadRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <button
        className="rounded-sm shadow-sm flex items-center text-[#15803d] border-[#15803d] border-2 hover:opacity-75 text-sm hover:text-white hover:bg-green-700 font-bold  px-3 py-1.5"
        onClick={() => uploadRef.current.click()}
      >
        Import Excel
      </button>
    </div>
  );
};

ExcelImportButton.propTypes = {
  token: PropTypes.string,
  apiEndpoint: PropTypes.string,
};

export default ExcelImportButton;
