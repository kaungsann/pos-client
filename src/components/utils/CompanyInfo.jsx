import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { BiSolidEdit } from "react-icons/bi";
import EditBusinessInfo from "./EditBusinessInfo";

import { getApi } from "../Api";
import { Icon } from "@iconify/react";

export default function CompanyInfo() {
  const [info, setInfo] = useState([]);
  const [id, setId] = useState("");
  const [edit, setEdit] = useState(true);

  const token = useSelector((state) => state.IduniqueData);

  const getInfo = async () => {
    const response = await getApi("/company", token.accessToken);
    if (response.status) {
      console.log("res data  is a", response);
      setInfo(response.data[0]);
      setId(response.data[0].id);
    }
  };

  const handleDiscard = () => {
    setEdit(true);
  };

  useEffect(() => {
    getInfo();
  }, []);

  return (
    <>
      {edit ? (
        <div>
          <div className="py-6 border-b-2 px-3 border-b-slate-300 flex justify-between items-center">
            <h3 className="text-2xl font-bold text-slate-700 px-4">
              Company Information
            </h3>
            <BiSolidEdit
              className="text-2xl text-blue-600 hover:text-blue-800"
              onClick={() => {
                setEdit(false);
              }}
            />
          </div>
          <div className="w-2/5 mx-auto">
            <img
              src={info.image}
              className="w-48 h-40  mx-auto text-center mt-4"
            />
            <div>
              <h3 className="text-center text-slate-700 text-2xl font-semibold mt-2">
                {info?.name ? info.name : ""}
              </h3>

              <div className="flex items-center my-3">
                <Icon icon="ion:home" className="text-xl text-blue-600" />
                <h3 className="ml-3 text-md font-bold">
                  {info?.address ? info.address : ""}
                </h3>
              </div>
              <div className="flex items-center my-3">
                <Icon
                  icon="ic:baseline-email"
                  className="text-xl text-blue-600"
                />
                <h3 className="ml-3 text-md font-bold">
                  {info?.email ? info.email : ""}
                </h3>
              </div>

              <div className="flex items-center my-3">
                <Icon
                  icon="entypo:old-phone"
                  className="text-xl text-blue-600"
                />
                <h3 className="ml-3 text-md font-bold">
                  {info?.phone ? info.phone : ""}
                </h3>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <EditBusinessInfo
          reBack={handleDiscard}
          getInfo={getInfo}
          companyId={id}
        />
      )}
    </>
  );
}
