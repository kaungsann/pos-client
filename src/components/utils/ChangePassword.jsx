import React from 'react'
import { useState } from 'react'
import { FormPathApi, PathData } from '../Api';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ChangePassword({close , id}) {
    const [password , setPassword]  = useState("")
    const token = useSelector((state) => state.IduniqueData);

    const handleChangePassword = async(e) => {
        e.preventDefault();
        const data = {};
        if (password) {
          data.password = password;
        }
        try {
          let resData = await PathData(`/user/change-password/${id}`, data, token.accessToken);
          console.log("user password is" ,resData )
          console.log("user password is" ,password )
          if (resData.status) {
            toast(resData.message);
            handleClose()
          } else {
            toast(resData.message);
          }
        } catch (error) {
          console.error("Error creating category:", error);
        }
    }
    const handleClose =() => {
        close(false)
    }
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
      {/* staff username in add label */}
      <form className='w-96 p-4 bg-white rounded-md shadow-md cursor-pointer absolute' onClick={handleChangePassword}>
        <div className='flex justify-between items-center mb-8'>
           <label  className="after:content-['*']  after:ml-0.5  after:text-red-500 block text-md font-semibold text-slate-600">User Change Password</label>
           <span className='text-2xl text-slate-600 font-bold hover:opacity-75' onClick={handleClose}>X</span>
        </div>
         <input onChange={(e) => setPassword(e.target.value)} type="text" className=" px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "/>
         <button type='submit' className="w-full my-8 items-center flex justify-center rounded-md bg-blue-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Change Password</button>
      </form>
    </>
  )
}
