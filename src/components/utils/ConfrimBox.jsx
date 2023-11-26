import React, { useState } from 'react'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ConfrimBox({comfirmHandle , close}) {
  const handleConfirm = () => {
    // Trigger confirmHandle when the Confirm button is clicked
    comfirmHandle();
  };
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
          style={{ width: "450px" }}
        />
        <div className='w-96 bg-white rounded-md shadow-md cursor-pointer'>
           <div className="p-4 my-2 flex flex-col">
  
              <label className="mb-3 after:ml-0.5 block text-lg font-semibold text-slate-600">
                Do you want to confirm this order?
              </label>

            <div className='flex flex-end w-full justify-end'>
              <button onClick={close} className="my-3 mx-4 items-center flex justify-center rounded-md bg-red-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Cancel
              </button>
              <button onClickCapture={handleConfirm} className="my-3 items-center flex justify-center rounded-md bg-green-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Confirm
              </button>
            </div>

         </div>
        </div>
        </>
  )
}
