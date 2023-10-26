import React, { useEffect, useState, useRef } from "react";
import { getApi, deleteApi } from "../../Api";
import { BsFillTrashFill } from "react-icons/bs";
import { BiSolidEdit } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import DeleteAlert from "../../utility/DeleteAlert";
import FadeLoader from "react-spinners/FadeLoader";
import { useSelector } from "react-redux";

export default function PartnerAll() {
  let count = 0;
  const inputRef = useRef();
  const [alert, setAlert] = useState(false);
  const [searchItems, setSearchItems] = useState([]);
  const [partners, setPartners] = useState([]);
  const [partnerId, setPartnerId] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = useSelector((state) => state.IduniqueData);

  const getPartnersApi = async () => {
    setLoading(true);
    let resData = await getApi("/partner", token.accessToken);
    const filteredPartners = resData.data.filter(
      (partner) => partner.isCompany === true
    );
    if (resData.status) {
      setLoading(false);
      setPartners(filteredPartners);
    } else {
      setLoading(true);
    }
  };
  const deletePartnerApi = async (id) => {
    const response = await deleteApi(`/partner/${id}`);
    getPartnersApi();
  };

  const deletePartnerId = (id) => {
    setAlert(true);
    setPartnerId(id);
  };

  useEffect(() => {
    getPartnersApi();
  }, []);
  return (
    <>
      <div className="flex w-full">
        <div className="flex w-full justify-between items-center">
          <div className="flex md:mr-8 justify-around">
            <Link to="/admin/partners/create">
              <div className="rounded-sm shadow-sm flex items-center bg-blue-600 hover:opacity-75 text-md text-white font-bold px-6 py-2">
                Add Customer
              </div>
            </Link>
          </div>
          <div className="w-96 md:w-72 relative">
            <input
              ref={inputRef}
              type="text"
              className="px-3 py-2 w-full rounded-md border-2 border-blue-500 shadow-md bg-white focus:outline-none"
              id="products"
              placeholder="search products"
              onChange={(e) => setSearchItems(e.target.value.toLowerCase())}
            />
          </div>
        </div>
      </div>
      <div className="w-full">
        <h2 className="lg:text-2xl font-bold my-4">Vendors</h2>
        <table className=" w-full">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className=" py-2 text-center">No</th>
              <th className=" py-2 text-center">Name</th>
              <th className=" py-2 text-center">contactAddress</th>
              <th className=" py-2 text-center">city</th>
              <th className=" py-2 text-center">phone</th>
              <th className=" py-2 text-center">Date</th>
              <th className=" py-2 text-center">isCustomer</th>
              <th className=" py-2 text-center">isCompany</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="w-full space-y-10">
            {partners.length > 0 ? (
              partners
                .filter((item) =>
                  searchItems.toLowerCase === ""
                    ? item
                    : item.name.toLowerCase().includes(searchItems)
                )
                .map((partner) => (
                  <tr
                    key={partner.id}
                    onClick={() =>
                      navigate(`/admin/partners/detail/${partner.id}`)
                    }
                    className="hover:bg-blue-100 odd:bg-white even:bg-slate-200 mt-3"
                  >
                    <td className="py-3 text-center">{(count += 1)}</td>
                    <td className="py-2 text-center">{partner.name}</td>

                    <td className=" py-2 text-center">{partner.address}</td>
                    <td className="py-2 text-center">{partner.city}</td>
                    <td className="py-2 text-center">{partner.phone}</td>
                    <td className="py-2 text-center">
                      {new Date(partner.created).toLocaleDateString()}
                    </td>
                    <td className="py-2 text-center">
                      {partner.isCustomer ? "Yes" : "No"}
                    </td>
                    <td className="py-2 text-center">
                      {partner.isCompany ? "Yes" : "No"}
                    </td>
                    <td className="py-2 text-center">
                      <div className="flex justify-center">
                        <BiSolidEdit
                          className="text-2xl text-sky-600 BiSolidEdit hover:text-sky-900"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/partners/edit/${partner.id}`);
                          }}
                        />

                        <BsFillTrashFill
                          className="text-2xl ml-3 text-red-600 hover:opacity-75"
                          onClick={(e) => {
                            e.stopPropagation();
                            deletePartnerId(partner.id);
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))
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
          </tbody>
        </table>
      </div>
      {alert && (
        <DeleteAlert
          cancel={() => {
            setAlert(false);
            setPartnerId(null);
          }}
          onDelete={() => {
            deletePartnerApi(partnerId);
            setAlert(false);
          }}
        />
      )}
    </>
  );
}
