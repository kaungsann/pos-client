import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../../Api";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import SearchBox from "./SearchBox";
import CategoryList from "./CategoryList";

export default function CategoryTemplate() {
  const [categorys, setCategorys] = useState([]);
  const token = useSelector((state) => state.IduniqueData);

  const CATEGORY_API = {
    INDEX: BASE_URL + "/category",
    IMPORT: BASE_URL + "/category/import-excel",
    EXPORT: BASE_URL + "/category/export-excel",
  };

  const fetchCategoryData = async () => {
    try {
      const response = await axios.get(CATEGORY_API.INDEX, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
          "Content-Type": "application/json",
        },
      });
      const filteredCategory = response.data?.data.filter(
        (ct) => ct.active === true
      );
      console.log("category filter response data is", filteredCategory);
      setCategorys(filteredCategory);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  const handleDeleteSuccess = async () => {
    fetchCategoryData();
  };

  useEffect(() => {
    fetchCategoryData();
  }, [token]);

  return (
    <>
      <div className="my-3">
        <CategoryList
          categorys={categorys}
          onDeleteSuccess={handleDeleteSuccess}
        />
      </div>
    </>
  );
}
