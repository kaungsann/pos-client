import React, { useEffect, useState } from "react";
import Card from "../../utils/Card";
import PayBox from "../../utils/PayBox";
import { MdArrowBackIosNew } from "react-icons/md";
import { GrNext } from "react-icons/gr";
import { getApi } from "../../Api";
import FadeLoader from "react-spinners/FadeLoader";

export default function PosItems() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [categorys, setCategory] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const handleNextButtonClick = () => {
    const nextPage = currentPage + 1;
    if (nextPage <= Math.ceil(categorys.length / itemsPerPage)) {
      setCurrentPage(nextPage);
    }
  };

  const handleBackButtonClick = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
    }
  };

  const getProducts = async () => {
    setLoading(true);
    let resData = await getApi("/product");
    if (resData.status) {
      setLoading(false);
      setProducts(resData.data);
    } else {
      setLoading(true);
    }
  };

  const getCategorysApi = async () => {
    let resData = await getApi("/category");
    setCategory(resData.data);
  };

  const productByCat = async (id) => {
    setSelectedCategory(id);
    setSearch("");
  };

  const productAll = async (id) => {
    if (id === "all") {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(id);
    }
  };

  useEffect(() => {
    getProducts();
    getCategorysApi();
  }, []);
  return (
    <>
      <div className="flex w-full">
        <div className="lg:w-2/3 md:w-2/4 bg-white shadow-sm p-3">
          <div>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold ml-2">Avaliable Items</h3>
              <input
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                className=" py-2 px-2 shadow-sm bg-slate-50 border-2 w-64 block rounded-md  text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-400 sm:text-sm sm:leading-6"
                placeholder="Enter Products Name"
              />
            </div>
            <ul className="mt-4 flex flex-wrap cursor-pointer items-center max-w-3xl relative p-3">
              {currentPage > 1 && (
                <MdArrowBackIosNew
                  onClick={handleBackButtonClick}
                  className="text-lg font-bold text-slate-500 mr-4"
                />
              )}

              <li
                className={`mr-3 hover:text-blue-700 font-semibold ${
                  selectedCategory === null
                    ? "border-b-4 border-blue-700 text-blue-600"
                    : ""
                }`}
                onClick={() => productAll("all")}
              >
                All
              </li>
              {categorys
                .slice(
                  (currentPage - 1) * itemsPerPage,
                  currentPage * itemsPerPage
                )
                .map((cat) => (
                  <li
                    className={`mx-3 hover:text-blue-700 font-semibold ${
                      selectedCategory === cat.id
                        ? "border-b-4 border-blue-700 text-blue-600"
                        : ""
                    }`}
                    key={cat.id}
                    onClick={() => productByCat(cat.id)}
                  >
                    {cat.name}
                  </li>
                ))}
              {currentPage < Math.ceil(categorys.length / itemsPerPage) && (
                <GrNext
                  onClick={handleNextButtonClick}
                  className="text-xl font-bold text-slate-500 absolute right-0"
                />
              )}
            </ul>
          </div>
          <div className="flex flex-wrap w-full h-screen overflow-y-scroll my-3 custom-scrollbar">
            {products.length > 0 ? (
              products
                .filter((item) =>
                  search.toLowerCase === ""
                    ? item
                    : item.name.toLowerCase().includes(search)
                )
                .filter((item) =>
                  selectedCategory
                    ? item.category && item.category._id === selectedCategory
                    : true
                )
                .map((pd) => <Card key={pd.id} product={pd} />)
            ) : (
              <div className="absolute inset-0 flex justify-center items-center">
                {loading && (
                  <FadeLoader
                    color={"#0284c7"}
                    loading={loading}
                    size={20}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                )}
              </div>
            )}
          </div>
        </div>
        <div className=" p-3 h-screen w-1/3 bg-white rounded-sm shadow-md ml-2">
          <PayBox />
        </div>
      </div>
    </>
  );
}
