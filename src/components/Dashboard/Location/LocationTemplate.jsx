import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../../Api";

import LocationList from "./LocationList";

export default function LocationTemplate() {
  const [locations, setLocations] = useState([]);
  const token = useSelector((state) => state.IduniqueData);

  const LOCATION_API = {
    INDEX: BASE_URL + "/location",
    IMPORT: BASE_URL + "/location/import-excel",
    EXPORT: BASE_URL + "/location/export-excel",
  };

  const fetchLocationData = async () => {
    try {
      const response = await axios.get(LOCATION_API.INDEX, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
          "Content-Type": "application/json",
        },
      });
      const filteredLocation = response.data.data.filter(
        (loca) => loca.active === true
      );
      //console.log("user locationn is a fukter", filteredLocation);

      setLocations(filteredLocation);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  useEffect(() => {
    fetchLocationData();
  }, [token]);
  return (
    <>
      <LocationList locations={locations} onDeleteSuccess={fetchLocationData} />
    </>
  );
}
