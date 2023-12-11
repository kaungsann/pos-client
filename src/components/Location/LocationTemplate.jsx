import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { BASE_URL } from "../Api";
import LocationList from "./LocationList";
import SearchBox from "./SearchBox";
import ExcelExportButton from "../ExcelExportButton";
import ExcelImportButton from "../ExcelImportButton";
import axios from "axios";
import { Link } from "react-router-dom";

const LOCATION_API = {
    INDEX: BASE_URL + "/location",
    IMPORT: BASE_URL + "/location/import-excel",
    EXPORT: BASE_URL + "/location/export-excel",
};

const LocationTemplate = () => {
    const [locations, setLocations] = useState([]);

    const [filteredKeywords, setFilteredKeywords] = useState({
        name: "",
       
    });
    const token = useSelector((state) => state.IduniqueData);

    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get(LOCATION_API.INDEX, {
                    headers: {
                        Authorization: `Bearer ${token.accessToken}`,
                        "Content-Type": "application/json",
                    },
                });
                setLocations(response.data?.data);
            } catch (error) {
                console.error("Error fetching Users:", error);
            }
        })();
    }, [token]);

    const handleFilterChange = (selected) => {
        setFilteredKeywords((prevFilter) => ({
            ...prevFilter,
            ...selected,
        }));
    };

    const filteredLocation = useMemo(
        () =>
            locations.filter((location) => {
                const { name } = filteredKeywords;
                return (

                    location.name == name
                );
            }),
        [locations, filteredKeywords]
    );

    return (
        <>
            <div className="flex justify-between items-center my-3">
                <div className="container flex">
                    <Link
                        to="/admin/partner/create"
                        className="font-bold rounded-sm shadow-sm flex items-center text-blue-700 border-blue-500 border-2 hover:opacity-75 text-sm hover:text-white hover:bg-blue-700 px-3 py-1.5"
                    >
                        Add
                    </Link>
                    {/* <FilterBox categories={categories} onFilter={handleFilterChange} /> */}
                    <ExcelExportButton
                        token={token.accessToken}
                        apiEndpoint={LOCATION_API.EXPORT}
                    />
                    <ExcelImportButton
                        token={token.accessToken}
                        apiEndpoint={LOCATION_API.IMPORT}
                    />
                </div>
                <SearchBox
                    keyword={filteredKeywords.name}
                    onSearch={handleFilterChange}
                />
            </div>
            <LocationList locations={locations} />
        </>
    );
};

export default LocationTemplate;