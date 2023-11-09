import React, { useEffect, useState } from "react";
import { getApi } from "../Api";
import { useDispatch, useSelector } from "react-redux";
import ClipLoader from "react-spinners/ClipLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Staff() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = useSelector((state) => state.IduniqueData);
  const dipatch = useDispatch();

  const getUsersApi = async () => {
    setLoading(true);
    const response = await getApi("/user", token.accessToken);
    if (response.message == "Token Expire , Please Login Again") {
      dipatch(removeData(null));
    }
    if (response.status) {
      setLoading(false);
      setUsers(response.data);
    } else {
      toast(response.message);
    }
  };
  useEffect(() => {
    getUsersApi();
  }, []);
  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <h1 className="text-2xl font-bold text-slate-700 pb-6 border-b-2 border-b-slate-300">
        Staffs Information
      </h1>
      {users.length > 0 ? (
        <table class="table-fixed w-full mt-8">
          <tr className="">
            <th className="lg:px-4 py-2 text-center text-slate-800">Role</th>
            <th className="lg:px-4 py-2 text-center text-slate-800">Name</th>
            <th className="lg:px-4 py-2 text-center text-slate-800">Email</th>
            <th className="lg:px-4 py-2 text-center text-slate-800">Phone</th>
            <th className="lg:px-4 py-2 text-center text-slate-800">
              DateOfBirth
            </th>
            <th className="lg:px-4 py-2 text-center text-slate-800">Gender</th>
            <th className="lg:px-4 py-2 text-center text-slate-800">Address</th>
          </tr>

          <tbody>
            {users.length > 0 &&
              users.map((usr) => (
                <tr className="odd:bg-white even:bg-slate-200 mt-3 w-full">
                  <td className="lg:px-4 py-2 text-center text-blue-600 font-bold">
                    {usr.role.name ? usr.role.name.toUpperCase() : "none"}
                  </td>
                  <td className="lg:px-4 py-2 text-center">{usr.username}</td>
                  <td className="lg:px-4 py-2 text-center">{usr.email}</td>
                  <td className="lg:px-4 py-2 text-center">
                    {usr.phone ? usr.phone : "none"}
                  </td>
                  <td className="lg:px-4 py-2 text-center">
                    {usr.dateOfBirth ? usr.dateOfBirth : "none"}
                  </td>
                  <td className="lg:px-4 py-2 text-center">
                    {usr.gender ? usr.gender : "none"}
                  </td>
                  <td className="lg:px-4 py-2 text-center">
                    {usr.contactAddress ? usr.contactAddress : "none"}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      ) : (
        <div className="flex justify-center mt-24">
          {loading && (
            <ClipLoader
              color={"#0284c7"}
              loading={loading}
              size={20}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          )}
        </div>
      )}
    </>
  );
}
