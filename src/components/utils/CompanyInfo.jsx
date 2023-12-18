import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { BiSolidEdit } from "react-icons/bi";
import EditBusinessInfo from "./EditBusinessInfo";

import { getApi } from "../Api";

import img from "../../../public/logo.png";

export default function CompanyInfo() {
  const [info, setInfo] = useState([]);
  const [edit, setEdit] = useState(true);

  const token = useSelector((state) => state.IduniqueData);

  const getInfo = async () => {
    const response = await getApi("/company", token.accessToken);
    console.log("company data is", response);
    if (response.status) {
      setInfo(response.data[0]);
    }
  };

  const handleDiscard = () => {
    setEdit(true);
  };

  const updateInfo = (newInfo) => {
    setInfo(newInfo);
  };

  useEffect(() => {
    getInfo();
  }, [updateInfo]);

  return (
    <>
      {edit ? (
        <div>
          <div className="pb-6 border-b-2 border-b-slate-300 flex justify-between items-center">
            <h3 className="text-2xl font-bold text-slate-700">
              Company Information
            </h3>
            <BiSolidEdit
              className="text-2xl text-blue-600 hover:text-blue-800"
              onClick={() => {
                setEdit(false);
              }}
            />
          </div>
          <div>
            <img
              src={img}
              className="w-60 h-40 rounded-md shadow-md mx-auto text-center mt-4"
            />
            <div>
              <h3 className="text-center text-slate-700 text-2xl font-semibold mt-6">
                {info?.name ? info.name : ""}
              </h3>
              <h3 className="text-center text-slate-500 text-md font-semibold mt-2">
                {info?.email ? info.email : ""}
              </h3>
              <h3 className="text-center text-slate-500 text-md font-semibold mt-2">
                {info?.phone ? info.phone : ""}
              </h3>
            </div>
          </div>
        </div>
      ) : (
        <EditBusinessInfo reBack={handleDiscard} updateInfo={updateInfo} />
      )}
    </>
  );
}
