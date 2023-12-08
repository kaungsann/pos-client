import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { BASE_URL } from "../Api";
import CustomerList from "./CustomerList";
import FilterBox from "./FilterBox";
import SearchBox from "./SearchBox";
import ExcelExportButton from "../ExcelExportButton";
import ExcelImportButton from "../ExcelImportButton";
import axios from "axios";

const CUSTOMER_API = {
    INDEX: BASE_URL + "/partner",
    IMPORT: BASE_URL + "/partner/import-excel",
};

const CustomerTemplate = () => {
    const [customers, setPartners] = useState([]);

    const [filteredKeywords, setFilteredKeywords] = useState({
        name: "",
        phone: "",
        company: "",
    });
    const token = useSelector((state) => state.IduniqueData);

    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get(CUSTOMER_API.INDEX, {
                    headers: {
                        Authorization: `Bearer ${token.accessToken}`,
                        "Content-Type": "application/json",
                    },
                });
                setPartners(response.data?.data);
            } catch (error) {
                console.error("Error fetching Customers:", error);
            }
        })();
    }, [token]);

    const handleFilterChange = (selected) => {
        setFilteredKeywords((prevFilter) => ({
            ...prevFilter,
            ...selected,
        }));
    };

    const filteredCustomers = useMemo(
        () =>
            customers.filter((customer) => {
                const { name, phone, company } = filteredKeywords;
                return (
                    customer.name.toLowerCase().includes(name.toLowerCase()) &&
                    customer.phone.toLowerCase().includes(phone.toLowerCase()) &&
                    customer.company == company
                );
            }),
        [customers, filteredKeywords]
    );

    return (
        <>
            <div className="flex justify-between items-center my-3">
                <div className="container flex">
                  
                 
                </div>
                <SearchBox
                    keyword={filteredKeywords.name}
                    onSearch={handleFilterChange}
                />
            </div>
            <CustomerList customers={customers} />
        </>
    );
};

export default CustomerTemplate;
