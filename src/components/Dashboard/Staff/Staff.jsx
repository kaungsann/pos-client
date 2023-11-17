import React, { useEffect, useState } from "react";
import { deleteMultiple, getApi } from "../../Api";
import { useDispatch, useSelector } from "react-redux";
import ClipLoader from "react-spinners/ClipLoader";
import { ToastContainer, toast } from "react-toastify";
import { BiSolidEdit } from "react-icons/bi";
import "react-toastify/dist/ReactToastify.css";
import { FaEye } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import DeleteAlert from "../../utils/DeleteAlert";

export default function Staff() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [alert, setAlert] = useState(false);

  const token = useSelector((state) => state.IduniqueData);
  const dipatch = useDispatch();

  const navigate = useNavigate();

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

  const toggleSelectItem = (cateogryID) => {
    setSelectAll(true);
    const isSelected = selectedItems.includes(cateogryID);
    if (isSelected) {
      setSelectedItems(selectedItems.filter((id) => id !== cateogryID));
    } else {
      setSelectedItems([...selectedItems, cateogryID]);
    }
  };

  // Handle select all items
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      const allProductIds = users.map((usr) => usr._id);
      setSelectedItems(allProductIds);
    }
    setSelectAll(!selectAll);
  };

  const deltteStaffs = async () => {
    if (selectedItems.length === 0) {
      toast("No staff selected for deletion.");
      return;
    }
    const response = await deleteMultiple(
      "/user",
      {
        userIds: selectedItems,
      },
      token.accessToken
    );

    if (response.status) {
      toast("Selected staff deleted successfully.");
      setSelectedItems([]);
      setSelectAll(false);
      getUsersApi();
    } else {
      toast("Failed to delete selected staff.");
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
      <div className=" pb-6 border-b-2 border-b-slate-300 flex justify-between">
        <h1 className="text-2xl text-slate-700 font-bold">
          Staffs Information
        </h1>
        <Link to="/admin/staff/create">
          <div className="font-bold rounded-sm shadow-sm flex items-cente text-blue-700 border-blue-500 border-2 hover:opacity-75 text-md hover:text-white hover:bg-blue-700 px-6 py-2">
            Add Staff
          </div>
        </Link>
      </div>

      {selectedItems.length > 0 && (
        <div className="flex justify-between mb-2 items-center px-2 py-2 bg-red-100">
          <h3 className="text-orange-400 font-semibold">
            {selectedItems.length} rows selected
          </h3>
          <button
            className="bg-red-500 py-2 px-4 rounded-md text-white hover:opacity-70"
            onClick={() => setAlert(true)}
          >
            Delete
          </button>
        </div>
      )}

      {users.length > 0 ? (
        <table class="table-fixed w-full mt-8 ">
          <tr className="bg-blue-600 text-white">
            <th className="lg:px-4 py-2 text-center">
              <input
                type="checkbox"
                onChange={toggleSelectAll}
                checked={selectAll && selectedItems.length > 0}
              />
            </th>
            <th className="lg:px-4 py-2 text-center">Role</th>
            <th className="lg:px-4 py-2 text-center">Name</th>
            <th className="lg:px-4 py-2 text-center">Email</th>
            <th className="lg:px-4 py-2 text-center">Phone</th>
            <th className="lg:px-4 py-2 text-center">Action</th>
          </tr>

          <tbody>
            {users.length > 0 &&
              users.map((usr) => (
                <tr
                  key={usr._id}
                  onClick={() => toggleSelectItem(usr._id)}
                  className={`${
                    selectedItems.includes(usr._id)
                      ? "bg-[#60a5fa] text-white"
                      : "odd:bg-white even:bg-slate-200"
                  }  mb-8 w-full items-center cursor-pointer hover:text-white hover:bg-[#60a5fa]`}
                >
                  <td className="lg:px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      onChange={() => toggleSelectItem(usr._id)}
                      checked={selectedItems.includes(usr._id)}
                    />
                  </td>
                  <td className="lg:px-4 py-2 text-center text-blue-600 font-bold">
                    {usr.role.name ? usr.role.name.toUpperCase() : "none"}
                  </td>
                  <td className="lg:px-4 py-2 text-center">{usr.username}</td>
                  <td className="lg:px-4 py-2 text-center">{usr.email}</td>
                  <td className="lg:px-4 py-2 text-center">
                    {usr.phone ? usr.phone : "none"}
                  </td>

                  <td className="lg:px-4 py-2 text-center">
                    <div className="flex justify-center">
                      <FaEye
                        onClick={() =>
                          navigate(`/admin/staff/detail/${usr._id}`)
                        }
                        className="text-2xl text-sky-600 BiSolidEdit hover:text-sky-900"
                      />
                      <BiSolidEdit
                        className="text-2xl mx-2 text-[#5e54cd] BiSolidEdit hover:text-[#2c285f]"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/admin/staff/edit/${usr._id}`);
                        }}
                      />
                    </div>
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

      {alert && (
        <DeleteAlert
          cancel={() => {
            setAlert(false);
            setSelectedItems([]);
          }}
          onDelete={() => {
            deltteStaffs();
            setAlert(false);
          }}
        />
      )}
    </>
  );
}
