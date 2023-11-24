import React, { useEffect, useState } from 'react'
import { FiFilter } from "react-icons/fi";
import { Link } from 'react-router-dom';
import ClipLoader from "react-spinners/ClipLoader";
import { MdClear } from "react-icons/md";
import { getApi } from "../../Api";
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format } from "date-fns";
import { Icon } from '@iconify/react';



export default function Warehouse() {
    const [showFilter, setShowFilter] = useState(false);
    const [warehouse , setWarehouse] = useState([])
    const [loading, setLoading] = useState(false);
    const [status , setStatus ] = useState(false)

    const token = useSelector((state) => state.IduniqueData);

    const getWareHouuseApi = async() => {
      setLoading(true);
       const resData = await getApi("/orders" , token.accessToken)
       console.log("warehosue is" , resData)
       if(resData.status) {
        setLoading(false);
        const filteredPending = resData.data.filter((ct) => ct.state === "pending");
        setWarehouse(filteredPending)
       }else{
        setLoading(false);
        toast(resData.message)
      }
    }

    useEffect(() => {
      getWareHouuseApi()
    } , [])


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
      <div className='relative'>
        <div className=" pb-6 border-b-2 border-b-slate-300 flex justify-between">
          <h1 className="text-2xl text-slate-700 font-bold">
          WareHouse Information
        </h1>
            <div onClick={() => setShowFilter(!showFilter)} className="font-bold rounded-sm shadow-sm flex items-center text-blue-700 border-blue-500 border-2 hover:opacity-75 text-md hover:text-white hover:bg-blue-700 px-6 py-2">
                <FiFilter className="text-xl mx-2" />
                <h4>Filter</h4>
            </div>
        </div>

        <table className="w-full text-center">
          <tr className="bg-blue-600 text-white">
            <th className="text-center">schedule Date</th>
            <th className="lg:px-4 py-2 text-center">User</th>
            <th className="lg:px-4 py-2 text-center">Partner</th>
            <th className="lg:px-4 py-2 text-center">Location</th>
            <th className="lg:px-4 py-2 text-center">State</th>
            <th className="lg:px-4 py-2 text-center">Total Product</th>
            <th className="lg:px-4 py-2 text-center">Payment</th>
            <th className="lg:px-4 py-2 text-center">TaxTotal</th>
            <th className="lg:px-4 py-2 text-center">Total</th>
            {/* <th className="lg:px-4 py-2 text-center">Action</th> */}
          </tr>
          <tbody className="w-full space-y-10 bg-slate-300">
            {warehouse.length > 0 ? (
              warehouse
                .map((wh) => (
                  <tr
                    key={wh.id}
                    className="hover:bg-blue-100 odd:bg-white even:bg-slate-200 mt-3 w-full"
                  >
                    <td className="lg:px-4 py-2 text-center">
                      {wh.scheduledDate ? format(new Date(wh.scheduledDate), "yyyy-MM-dd") : "no date"}
                    </td>

                    <td className="lg:px-4 py-2 text-center">
                      {wh.user && wh.user._id
                        ? wh.user.username
                        : "no have"}
                    </td>
                    <td className="lg:px-4 py-2 text-center">
                      {wh.partner && wh.partner.name
                        ? wh.partner.name
                        : "nohave"}
                    </td>
                    <td className="lg:px-4 py-2 text-center">
                      {wh.location && wh.location.name
                        ? wh.location.name
                        : "no have"}
                    </td>
                    <td
                      className="lg:px-4 py-2 text-center"
                    >
                     <span className={`px-6 rounded-2xl border-2 py-1.5 font-bold ${
                        wh.state == "pending"
                        ? "text-orange-500 bg-orange-100 border-orange-400"
                        : wh.state == "deliver"
                        ? "bg-cyan-100 text-cyan-500 border-cyan-400"
                        : wh.state == "arrived"
                        ? "bg-green-100 text-green-500 border-green-400"
                        : ""
                      }`}>{wh.state ? wh.state : "no state"}</span>
                   
                    </td>
                    <td className="lg:px-4 py-2 text-center overflow-hidden whitespace-nowrap">
                      {wh.lines.length}
                    </td>
                    <td   className="lg:px-4 py-2 text-center">
                      <span
                        className={`px-6 rounded-2xl border-2 py-1.5 font-bold ${
                          wh.paymentStatus  === "pending" ? "text-orange-500 bg-orange-100 border-orange-400" 
                          : wh.paymentStatus == "comfirm"
                          ? "bg-green-100 text-green-500 border-green-400"
                          : ""
                        }`}
                      >
                        {wh.paymentStatus}
                      </span>
                    </td>

                    <td className="lg:px-4 py-2 text-center">
                      {wh.taxTotal}
                    </td>
                    <td className="lg:px-4 py-2 text-center">{wh.total}</td>
                    {/* <td className="py-3 flex ml-3 lg:px-4 justify-center">
                    <Icon onClick={() => setStatus(true)} icon="fluent:status-16-regular" className="text-2xl text-sky-700 font-bold hover:text-blue-900"
                      />
                    </td> */}
                  </tr>
                ))
            ) : (
              <div className="w-10/12 mx-auto absolute  mt-40 flex justify-center items-center">
                {loading && (
                  <ClipLoader
                    color={"#0284c7"}
                    loading={loading}
                    size={10}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                )}
              </div>
            )}
          </tbody>
        </table>
         {
          status  && (
            <div className='w-96 absolute top-3 left-0 right-0 z-50 mx-auto bg-white rounded-md shadow-md cursor-pointer'>
               <div className="p-4 my-2 flex flex-col">
                <div className='flex justify-between'>
                  <label className="mb-3 after:ml-0.5 block text-lg font-semibold text-slate-600">
                    Status Change
                  </label>
                  <h3 onClick={() => setStatus(false)} className='text-2xl text-slate-600 font-semibold hover:text-slate-800'>X</h3>
                </div>
                <select
                  onChange={(e) => setStatus(e.target.value)}
                  id="status"
                  name="status"
                  className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                >
                  <option disabled value selected>
                    Select an option
                  </option>
                  <option value="comfirm">Comfirm</option>
                </select>
                <button className="my-3 items-center flex justify-center rounded-md bg-blue-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                   Submit
                </button>
             </div>
            </div>

          )
         }
      </div>
         {
          showFilter &&  (      
              <div
                    className={`w-96 bg-slate-50 h-screen fixed top-0 right-0 p-4 z-50 transition-transform transform ${
                    showFilter ? "translate-x-0" : "-translate-x-full"
                    }ease-in-out duration-700`}
                >
                    <div className="flex justify-between my-6">
                    <h2 className="text-xl font-bold text-slate-700">
                        Filter warehouse
                    </h2>
                    <MdClear
                        onClick={() => setShowFilter(!showFilter)}
                        className="text-2xl font-semibold text-slate-600 hover:opacity-70"
                    />
                    </div>
                    <div>
                    <div className="my-3 flex flex-col">
                        <label className="text-lg my-2 text-slate-600 font-semibold">
                          Payment
                        </label>
                        <input
                        type="text"
                        onChange={(e) => setFilterBarcode(e.target.value)}
                        className="w-full rounded-md py-2 px-3 border-2 border-blue-300"
                        placeholder="Search By barcode"
                        />
                    </div>
                    <div className="my-3 flex flex-col">
                        <label className="text-lg my-2 text-slate-600 font-semibold">
                        State
                        </label>
                        <input
                        type="text"
                        onChange={(e) => setFilterPrice(e.target.value)}
                        className="w-full rounded-md py-2 px-3 border-2 border-blue-300"
                        placeholder="Search By Price"
                        />
                    </div>
                    <div className="flex justify-between w-full my-4">
                        <button className="flex hover:opacity-70 px-4 py-2 justify-center items-center bg-blue-500 rounded-md text-white w-2/4">
                        <FiFilter className="mx-1" />
                        Filter
                        </button>
                        <button
                        onClick={() => setShowFilter(!showFilter)}
                        className="px-4 hover:opacity-70 py-2 ml-3 bg-red-500 rounded-md text-white w-2/4"
                        >
                        Cancel
                        </button>
                    </div>
                    </div>
               </div>
          )}
     </>
  )
}
