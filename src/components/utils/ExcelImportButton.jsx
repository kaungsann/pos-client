import { useRef } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import {Button} from "@nextui-org/react";

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
      <Button color="primary" variant="bordered" onClick={() => uploadRef.current.click()}>
        Import Excel
      </Button>  
    </div>
  );
};

ExcelImportButton.propTypes = {
  token: PropTypes.string,
  apiEndpoint: PropTypes.string,
};

export default ExcelImportButton;
