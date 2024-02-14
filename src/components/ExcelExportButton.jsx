import PropTypes from "prop-types";
import axios from "axios";
import { Button } from "@nextui-org/react";

const ExcelExportButton = ({ token, apiEndpoint }) => {
  const handleDownloadClick = async () => {
    try {
      const response = await axios.get(apiEndpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      });

      console.log("reponse data is a", response);

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

  return (
    <>
      <Button
        size="sm"
        onClick={handleDownloadClick}
        className="rounded-sm shadow-sm flex items-center  text-[#15803d] border-[#15803d] bg-white border-2 hover:opacity-75 text-sm hover:text-white hover:bg-green-700 font-bold px-3 py-1.5"
      >
        Download Excel
      </Button>
    </>
  );
};

ExcelExportButton.propTypes = {
  token: PropTypes.string,
  apiEndpoint: PropTypes.string,
};

export default ExcelExportButton;
