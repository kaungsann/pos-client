import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../Api";
import { Link } from "react-router-dom";
import CategoryList from "./CategoryList";
import ExcelExportButton from "../ExcelExportButton";
import ExcelImportButton from "../ExcelImportButton";
import SearchCompo from "../utils/SearchCompo";
import { Button } from "@nextui-org/react";

export default function CategoryTemplate() {
  const [categorys, setCategorys] = useState([]);
  const [filteredKeywords, setFilteredKeywords] = useState({ name: "" });
  const token = useSelector((state) => state.IduniqueData);

  const CATEGORY_API = {
    INDEX: BASE_URL + "/category",
    IMPORT: BASE_URL + "/category/import-excel",
    EXPORT: BASE_URL + "/category/export-excel",
  };

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const response = await axios.get(CATEGORY_API.INDEX, {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
            "Content-Type": "application/json",
          },
        });

        setCategorys(response.data?.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategoryData();
  }, [token]);

  const handleFilterChange = (selected) => {
    setFilteredKeywords((prevFilter) => ({
      ...prevFilter,
      ...selected,
    }));
  };

  const filteredCategory = useMemo(
    () =>
      categorys.filter((catg) => {
        const { name } = filteredKeywords;

        return catg.name.toLowerCase().includes(name.toLowerCase());
      }),
    [categorys, filteredKeywords]
  );

  return (
    <>
      <div className="flex justify-between items-center my-3">
        <SearchCompo
          keyword={filteredKeywords.name}
          onSearch={handleFilterChange}
        />

        <div className="flex">
          <Button
            size="sm"
            onClick={() => navigate("/admin/categorys/create")}
            className="font-bold rounded-sm shadow-sm flex bg-zinc-50 items-center text-blue-700 border-blue-500 border-2 hover:opacity-75 text-sm hover:text-white hover:bg-blue-700 px-3 py-1.5"
          >
            Add
          </Button>
          <div className="ml-3">
            <ExcelExportButton
              token={token.accessToken}
              apiEndpoint={CATEGORY_API.EXPORT}
            />
          </div>
          <div className="ml-3">
            <ExcelImportButton
              token={token.accessToken}
              apiEndpoint={CATEGORY_API.IMPORT}
            />
          </div>
        </div>
      </div>
      <CategoryList categories={filteredCategory} />
    </>
  );
}
