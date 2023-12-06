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

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(CATEGORY_API.INDEX, {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
            "Content-Type": "application/json",
          },
        });
        console.log("category response data is");
        setCategorys(response.data?.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    })();
  }, [token]);

  return (
    <div>
      <CategoryList categorys={categorys} />
    </div>
  );
}
