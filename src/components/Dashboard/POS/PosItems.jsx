import { useEffect, useRef, useState } from "react";
import Card from "../../utils/Card";
import PayBox from "../../utils/PayBox";
import { MdArrowBackIosNew } from "react-icons/md";
import { GrNext } from "react-icons/gr";
import { getApi } from "../../Api";
import { Select, SelectItem, Spinner } from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";
import {
  filterLocations,
  itemsAdd,
  updateItemQuantity,
} from "../../../redux/actions";
import { removeData } from "../../../redux/actions";
import { Icon } from "@iconify/react";

export default function PosItems() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [categorys, setCategory] = useState([]);

  const [locations, setLocations] = useState([]);
  const [loca, setLoca] = useState("");
  const [loadingData, setLoadingData] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const searchInputRef = useRef(null);

  const itemsPerPage = 5;

  const user = useSelector((state) => state.loginData);

  const token = useSelector((state) => state.IduniqueData);
  const selectProduct = useSelector((state) => state.orderData);
  const dipatch = useDispatch();

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

  const getCategorysApi = async () => {
    let resData = await getApi("/category", token.accessToken);
    if (resData.message == "Token Expire , Please Login Again") {
      dipatch(removeData(null));
    }
    const filteredCategory = resData.data.filter((pd) => pd.active === true);
    setCategory(filteredCategory);
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

  const handleBarcodeDetected = (barcode) => {
    const productMatch = products.find(
      (product) => product.barcode === barcode
    );

    if (productMatch) {
      const existingProduct = selectProduct.find(
        (pd) => pd.barcode === barcode
      );

      if (existingProduct) {
        dipatch(
          updateItemQuantity(
            existingProduct.id,
            (existingProduct.quantity += 1)
          )
        );
        setSearch("");
      } else {
        dipatch(itemsAdd({ ...productMatch, quantity: 1 }));
        setSearch("");
      }
    }
  };
  const getLocation = async () => {
    const resData = await getApi("/location", token.accessToken);
    const filteredLocation = resData.data.filter((la) => la.active === true);
    setLocations(filteredLocation);
  };

  const getStock = async () => {
    setLoadingData(true);

    try {
      const resData = await getApi("/stock", token.accessToken);

      // let selectedLocationId;
      // if (user.role.name === "user") {
      //   setLoca(location);
      // }
      // if (loca === "") {
      //   selectedLocationId = null;
      // } else {
      //   selectedLocationId = loca;
      // }

      const filteredStock = resData.data.filter(
        (item) => item.active === true && item.location._id === loca
        // (!selectedLocationId || item.location._id === selectedLocationId)
      );

      setProducts([...filteredStock.map((item) => item.product)]);

      // if (selectedLocationId !== null) {
      //   setProducts([...filteredStock.map((item) => item.product)]);

      //   dipatch(removeAllItems());
      // } else {
      //   setProducts([]);
      //   dipatch(removeAllItems());
      // }
    } catch (error) {
      // Handle the error here, such as showing an error message to the user
      console.error("Error fetching stock:", error);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    //getProducts();
    getCategorysApi();
    getLocation();
    getStock();

    if (search) {
      handleBarcodeDetected(search);
    }
  }, [search, loca]);

  const handleLocationSelect = (e) => {
    const selectedLocationId = e.target.value;
    const selectedLocation = locations.find(
      (location) => location.id === selectedLocationId
    );
    dipatch(filterLocations(selectedLocation));
    setLoca(selectedLocationId);
  };

  return (
    <>
      <div
        className={`flex w-full ${
          user.role && user.role.name == "user" && "mt-2"
        }`}
      >
        <div className="lg:w-2/3 relative md:w-2/4 shadow-sm bg-white overflow-y-scroll custom-scrollbar h-screen">
          <div>
            <div className="flex justify-between items-center p-3">
              <div className="flex items-center w-3/6">
                <h3 className="font-semibold text-xl">Avaliable Items</h3>
                {/* {user.role.name === "root" || user.role.name === "admin" ? (
                  <Select
                    name="location"
                    placeholder="Select a location"
                    classNames={{
                      base: "w-40 mx-4",
                      trigger: "h-10",
                    }}
                    onChange={(e) => setLoca(e.target.value)}
                  >
                    {locations.map((ct) => (
                      <SelectItem key={ct.id} value={ct.id}>
                        {ct.name}
                      </SelectItem>
                    ))}
                  </Select>
                ) : null} */}

                <Select
                  name="location"
                  //labelPlacement="inside"
                  label="Select a location"
                  variant="bordered"
                  classNames={{
                    base: "w-72 mx-4",
                    trigger: "h-12 p-4",
                  }}
                  // onChange={(e) => setLoca(e.target.value)}
                  onChange={handleLocationSelect}
                >
                  {locations.map((ct) => (
                    <SelectItem key={ct.id} value={ct.id}>
                      {ct.name}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              <div className="flex relative">
                <input
                  ref={searchInputRef}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  autoFocus={true}
                  type="text"
                  className=" py-2 px-2 shadow-sm bg-slate-50 border-2 w-64 block rounded-md  text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-400 sm:text-sm sm:leading-6"
                  placeholder="Search By Barcode"
                />
                <Icon
                  icon="entypo:cross"
                  className="absolute text-lg rounded-full hover:opacity-75 bg-slate-500 text-white top-3 right-3"
                  onClick={() => setSearch("")}
                />
              </div>
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

          {loadingData == false && products.length === 0 && (
            <h2 className="text-center mt-36 text-xl text-slate-600 font-semibold">
              Please select a location
            </h2>
          )}

          <div className="flex flex-wrap w-full">
            {products.length > 0 ? (
              products
                .filter((item) =>
                  search === "" ? item : item.barcode.includes(search)
                )
                .filter((item) =>
                  selectedCategory
                    ? item.category && item.category === selectedCategory
                    : true
                )
                .map((pd) => <Card key={pd.id} product={pd} />)
            ) : (
              <div className="w-10/12 mx-auto  mt-40 flex justify-center">
                {loadingData && <Spinner size="lg" />}
              </div>
            )}
          </div>
        </div>
        <div className="p-3 h-screen w-1/3 bg-white rounded-sm shadow-md ml-2">
          <PayBox locationId={loca} />
        </div>
      </div>
    </>
  );
}
