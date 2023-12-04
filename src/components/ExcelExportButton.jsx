import PropTypes from "prop-types";
import axios from "axios";

const ExcelExportButton = ({ token, apiEndpoint }) => {
  const handleDownloadClick = async () => {
    try {
      const response = await axios.get(apiEndpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      });

      if (!response.status === 200) {
        throw new Error("Failed to fetch Excel file");
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "downloaded_file.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading Excel file:", error);
    }
  };

  return <button onClick={handleDownloadClick}>Download Excel</button>;
};

ExcelExportButton.propTypes = {
  token: PropTypes.string,
  apiEndpoint: PropTypes.string,
};

export default ExcelExportButton;
