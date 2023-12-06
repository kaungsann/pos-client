import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { BASE_URL } from "../Api";
import EmployeeList from "./EmployeeList";
import SearchBox from "./SearchBox";
// import ExcelExportButton from "../ExcelExportButton";
// import ExcelImportButton from "../ExcelImportButton";
import axios from "axios";
import { Link } from "react-router-dom";

const EMPLOYEE_API = {
    INDEX: BASE_URL + "/user",
    IMPORT: BASE_URL + "/user/import-excel",
    EXPORT: BASE_URL + "/user/export-excel",
};

const EmployeeTemplate = () => {
    const [partners, setPartners] = useState([]);

    const [filteredKeywords, setFilteredKeywords] = useState({
        name: "",
        // Might Need to add User Role for Search
    });
    const token = useSelector((state) => state.IduniqueData);

    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get(EMPLOYEE_API.INDEX, {
                    headers: {
                        Authorization: `Bearer ${token.accessToken}`,
                        "Content-Type": "application/json",
                    },
                });
                setPartners(response.data?.data);
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

    const filteredPartners = useMemo(
        () =>
            partners.filter((partner) => {
                const { name } = filteredKeywords;
                return (
     
                    partner.name == name
                );
            }),
        [partners, filteredKeywords]
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
                        apiEndpoint={EMPLOYEE_API.EXPORT}
                    />
                    <ExcelImportButton
                        token={token.accessToken}
                        apiEndpoint={EMPLOYEE_API.IMPORT}
                    />
                </div>
                <SearchBox
                    keyword={filteredKeywords.name}
                    onSearch={handleFilterChange}
                />
            </div>
            <EmployeeList partners={partners} />
        </>
    );
};

export default EmployeeTemplate;
