import { useRef } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const ExcelImportButton = ({ token }) => {
  const uploadRef = useRef(null);

  const handleFileChange = async (e) => {
    const apiEndpoint = "http://127.0.0.1:8000/product/import-excel";
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("excel", file);

    try {
      const response = await axios.post(apiEndpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`,
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
      <button onClick={() => uploadRef.current.click()}>Import Excel</button>
    </div>
  );
};

ExcelImportButton.propTypes = {
  token: PropTypes.string,
};

export default ExcelImportButton;
