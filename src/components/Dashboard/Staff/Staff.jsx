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
import { Icon } from '@iconify/react';
import ChangePassword from "../../utils/ChangePassword";
import ReactPaginate from "react-paginate";
import { IoMdArrowRoundForward , IoMdArrowRoundBack} from "react-icons/io";


export default function Staff() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const [alert, setAlert] = useState(false);
  const [show, setShow] = useState(false)

  const itemsPerPage = 10; 
  const [currentPage, setCurrentPage] = useState(0);

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
    if(show) {
      setSelectedItems(null)
      return
    }
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
    if(show) {
      setSelectedItems([])
      return
    }
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

  const closeShowBox = (text) => {
     setShow(text)
  }

  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;


  const pageCount = Math.ceil(users.length / itemsPerPage);
  const currentUsers = users.slice(startIndex, endIndex);

  useEffect(() => {
    getUsersApi();
  }, []);
  return (
    <div className="relative">
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
          Users Information
        </h1>
        <Link to="/admin/user/create">
          <div className="font-bold rounded-sm shadow-sm flex items-cente text-blue-700 border-blue-500 border-2 hover:opacity-75 text-md hover:text-white hover:bg-blue-700 px-6 py-2">
            Add User
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
            {currentUsers.length > 0 ?
              currentUsers.map((usr) => (
                <tr
                  key={usr._id}
                  onClick={() =>  toggleSelectItem(usr._id)}
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
                          navigate(`/admin/user/detail/${usr._id}`)
                        }
                        className="text-2xl text-sky-600 BiSolidEdit hover:text-sky-900"
                      />
                      <BiSolidEdit
                        className="text-2xl mx-2 text-[#5e54cd] BiSolidEdit hover:text-[#2c285f]"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/admin/user/edit/${usr._id}`);
                        }}
                      />
                      <Icon  onClick={() => {
                                setShow(true);
                                setUserId(usr._id);
                              }} icon="mynaui:lock-open-password" className="text-2xl text-[#eb4a54] BiSolidEdit hover:text-[#2c285f]"
                         />
                    </div>
                  </td>
                </tr>
              )):
              <div className="w-full mx-auto absolute mt-40 flex justify-center items-center">
              {loading && (
                <ClipLoader
                  color={"#0284c7"}
                  loading={loading}
                  size={35}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              )}
            </div>
              }
          </tbody>
        </table>
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

      <div className={`absolute top-32 left-0 right-0 z-50 transition-transform transform flex justify-center ${show ? "translate-y-0" : "-translate-y-full"}`}>
        {show && <ChangePassword id={userId} close={closeShowBox} />}
      </div>
      <div className="fixed bottom-12 right-3 w-96 items-center">
        <ReactPaginate
          containerClassName="pagination-container flex justify-center items-center"
          pageLinkClassName="page-link text-center"
          pageClassName="page-item mx-2"
          className="flex justify-around text-center items-center"
          activeClassName="bg-blue-500 text-white text-center"
          previousClassName="text-slate-500 font-semibold pr-8 hover:text-slate-700"
          nextClassName="text-slate-500 font-semibold pl-8 hover:text-slate-700"
          breakLabel={<div className="break-label px-8">...</div>} // Custom break element with margin
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          previousLabel={
            <div className="flex items-center text-slate-700 border-2 px-2 py-1 border-b-gray-300 bg-white">
              <IoMdArrowRoundBack className="mr-2"/>
              {' '}
              Previous
            </div>
          } 
          nextLabel={
            <div className="flex items-center text-slate-700 border-2 px-2 py-1 bg-white border-b-gray-300">
              Next
              {' '}
              <IoMdArrowRoundForward className="ml-2"/>
            </div>
          }
          forcePage={currentPage}
          renderOnZeroPageCount={null}
        />
      </div>
    </div>
  );
}
