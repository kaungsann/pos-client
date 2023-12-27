import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { BASE_URL } from "../Api";
import LocationList from "./LocationList";
import SearchBox from "../Product/SearchBox";
import ExcelExportButton from "../ExcelExportButton";
import ExcelImportButton from "../ExcelImportButton";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "@nextui-org/react";

const LOCATION_API = {
  INDEX: BASE_URL + "/location",
  IMPORT: BASE_URL + "/location/import-excel",
  EXPORT: BASE_URL + "/location/export-excel",
};

const LocationTemplate = () => {
  const [locations, setLocations] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [filteredKeywords, setFilteredKeywords] = useState({
    name: "",
  });
  const token = useSelector((state) => state.IduniqueData);

  const handleRefresh = () => {
    setRefresh(!refresh);
  };

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(LOCATION_API.INDEX, {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
            "Content-Type": "application/json",
          },
        });
        let filterActiveLocations = response.data?.data.filter(
          (ct) => ct.active === true
        );
        setLocations(filterActiveLocations);
      } catch (error) {
        console.error("Error fetching Users:", error);
      }
    })();
  }, [token, refresh]);

  const handleFilterChange = (selected) => {
    setFilteredKeywords((prevFilter) => ({
      ...prevFilter,
      ...selected,
    }));
  };

  const filteredLocations = useMemo(
    () =>
      locations.filter((location) => {
        const { name } = filteredKeywords;
        return location.name.toLowerCase().includes(name.toLowerCase());
      }),
    [locations, filteredKeywords]
  );

  return (
    <>
      <div className="flex justify-between items-center my-3">
        <SearchBox
          keyword={filteredKeywords.name}
          onSearch={handleFilterChange}
        />
        <div className="flex">
          <Button
            size="sm"
            onPress={() => navigate("/admin/locations/create")}
            className="font-bold rounded-sm shadow-sm flex items-center bg-slate-50 text-blue-700 border-blue-500 border-2 hover:opacity-75 text-sm hover:text-white hover:bg-blue-700 px-3 py-1.5"
          >
            Add
          </Button>
          <div className="ml-3">
            <ExcelExportButton
              token={token.accessToken}
              apiEndpoint={LOCATION_API.EXPORT}
            />
          </div>
          <div className="ml-3">
            <ExcelImportButton
              token={token.accessToken}
              apiEndpoint={LOCATION_API.IMPORT}
              fetchData={handleRefresh}
              ExcelLink="https://ambitbound-tech.s3.ap-southeast-1.amazonaws.com/template/location_template.xlsx"
            />
          </div>
        </div>
      </div>
      <LocationList locations={filteredLocations} refresh={handleRefresh} />
    </>
  );
};

export default LocationTemplate;
