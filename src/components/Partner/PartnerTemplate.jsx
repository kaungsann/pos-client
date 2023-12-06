import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { BASE_URL } from "../Api";
import PartnerList from "./PartnerList";
import FilterBox from "./FilterBox";
import SearchBox from "./SearchBox";
import ExcelExportButton from "../ExcelExportButton";
import ExcelImportButton from "../ExcelImportButton";
import axios from "axios";
import { Link } from "react-router-dom";

const PARTNER_API = {
    INDEX: BASE_URL + "/partner",
    IMPORT: BASE_URL + "/partner/import-excel",
    EXPORT: BASE_URL + "/partner/export-excel",
};

const PartnerTemplate = () => {
    const [partners, setPartners] = useState([]);

    const [filteredKeywords, setFilteredKeywords] = useState({
        name: "",
        phone: "",
        company: "",
    });
    const token = useSelector((state) => state.IduniqueData);

    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get(PARTNER_API.INDEX, {
                    headers: {
                        Authorization: `Bearer ${token.accessToken}`,
                        "Content-Type": "application/json",
                    },
                });
                setPartners(response.data?.data);
            } catch (error) {
                console.error("Error fetching partners:", error);
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
                const { name, phone, company } = filteredKeywords;
                return (
                    partner.name.toLowerCase().includes(name.toLowerCase()) &&
                    partner.phone.toLowerCase().includes(phone.toLowerCase()) &&
                    partner.company == company
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
                        apiEndpoint={PARTNER_API.EXPORT}
                    />
                    <ExcelImportButton
                        token={token.accessToken}
                        apiEndpoint={PARTNER_API.IMPORT}
                    />
                </div>
                <SearchBox
                    keyword={filteredKeywords.name}
                    onSearch={handleFilterChange}
                />
            </div>
            <PartnerList partners={partners} />
        </>
    );
};

export default PartnerTemplate;
