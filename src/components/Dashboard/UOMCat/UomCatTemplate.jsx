import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../../Api";
import { useNavigate } from "react-router-dom";
import UomCatList from "./UomCatList";
import { Button } from "@nextui-org/react";
import SearchCompo from "../../utils/SearchCompo";

export default function UomCatTemplate() {
  const [uomCategorys, setUomCategorys] = useState([]);
  const [filteredKeywords, setFilteredKeywords] = useState({ name: "" });
  const [refresh, setRefresh] = useState(false);
  const token = useSelector((state) => state.IduniqueData);

  const navigate = useNavigate();

  const handleRefresh = () => {
    setRefresh(!refresh);
  };

  const UOM_API = {
    INDEX: BASE_URL + "/uomCategory",
  };

  useEffect(() => {
    const fetchUomCategoryData = async () => {
      try {
        const response = await axios.get(UOM_API.INDEX, {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
            "Content-Type": "application/json",
          },
        });

        console.log("res data is ", response);
        let filterActiveUomCategorys = response.data?.data.filter(
          (ct) => ct.active === true
        );

        setUomCategorys(filterActiveUomCategorys);
      } catch (error) {
        console.error("Error fetching uom categories:", error);
      }
    };

    fetchUomCategoryData();
  }, [token, refresh]);

  console.log("uom cat is", uomCategorys);

  const handleFilterChange = (selected) => {
    setFilteredKeywords((prevFilter) => ({
      ...prevFilter,
      ...selected,
    }));
  };

  const filteredUomCategory = useMemo(
    () =>
      uomCategorys.filter((catg) => {
        const { name } = filteredKeywords;

        return catg.name.toLowerCase().includes(name.toLowerCase());
      }),
    [uomCategorys, filteredKeywords]
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
            onClick={() => navigate("/admin/uom-category/create")}
            className="font-bold rounded-sm shadow-sm flex bg-zinc-50 items-center text-blue-700 border-blue-500 border-2 hover:opacity-75 text-sm hover:text-white hover:bg-blue-700 px-3 py-1.5"
          >
            Add
          </Button>
        </div>
      </div>
      <UomCatList categories={filteredUomCategory} refresh={handleRefresh} />
    </>
  );
}
