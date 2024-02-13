import { useState } from "react";
import { PathData } from "../Api";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";

export default function ChangePassword({ close, id }) {
  const [password, setPassword] = useState("");
  const token = useSelector((state) => state.IduniqueData);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const data = {};
    if (password) {
      data.password = password;
    }
    try {
      let resData = await PathData(
        `/user/change-password/${id}`,
        data,
        token.accessToken
      );

      if (resData.status) {
        toast.success(resData.message);
        handleClose();
      } else {
        toast.error(resData.message);
      }
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };
  const handleClose = () => {
    close(false);
  };
  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {/* staff username in add label */}

      <div className="absolute z-40 top-0">
        <div
          className="relative z-10"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity cursor-pointer">
            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm">
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <form onClick={handleChangePassword} className="w-full">
                        <div className="flex justify-between items-center mb-8">
                          <label className="after:content-['*']  after:ml-0.5  after:text-red-500 block text-md font-semibold text-slate-600">
                            User Change Password
                          </label>
                          <span
                            className="text-2xl text-slate-600 hover:text-slate-400 font-bold hover:opacity-75"
                            onClick={handleClose}
                          >
                            X
                          </span>
                        </div>
                        <input
                          onChange={(e) => setPassword(e.target.value)}
                          type="text"
                          className=" px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
                        />
                        <button
                          type="submit"
                          className="w-full my-8 items-center flex justify-center rounded-md bg-blue-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                          Change Password
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

ChangePassword.propTypes = {
  close: PropTypes.func,
  id: PropTypes.string,
};
