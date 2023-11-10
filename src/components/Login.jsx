import React, { useState } from "react";
import logo from "../assets/text.jpeg";
import { Link, useNavigate } from "react-router-dom";
import { addData, idAdd } from "../redux/actions";
import { useDispatch } from "react-redux";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MoonLoader from "react-spinners/MoonLoader";
import { jsonStringPostData } from "./Api";

export default function Login() {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [see, setSee] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const loginApi = async () => {
    let user = {
      email: email,
      password: password,
    };

    const resData = await jsonStringPostData("/auth/signin", user);

    if (resData.success) {
      setLoading(false);
      toast(resData.message);
      dispatch(addData(resData.data));
      dispatch(idAdd(resData.tokens));
      navigate("/admin/products/all");
    } else {
      setLoading(false);
      toast(resData.message);
      console.log("res data is", resData.message);
    }
  };
  const loginUser = (e) => {
    e.preventDefault();
    setLoading(true);
    loginApi();
  };
  return (
    <>
      <div>
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
        <div className="flex min-h-full flex-col justify-center px-6 lg:px-8 mt-8">
          <div className="sm:mx-auto sm:w-full">
            <img className="mx-auto w-96" src={logo} />
            <h2 className="mt-12 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Sign in to your account
            </h2>
          </div>

          <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
            <form
              className="space-y-6"
              action="#"
              method="POST"
              onSubmit={loginUser}
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    onChange={(e) => setemail(e.target.value)}
                    id="email"
                    name="email"
                    type="email"
                    autocomplete="email"
                    required
                    className="block px-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
                  />
                </div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                ></label>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Password
                  </label>
                  <div className="text-sm">
                    <Link to="/forget-password">
                      <a
                        href="#"
                        className="font-semibold   text-blue-700 hover:text-indigo-500"
                      >
                        Forgot password?
                      </a>
                    </Link>
                  </div>
                </div>
                <div className="mt-2 relative">
                  {see ? (
                    <AiOutlineEye
                      className="absolute right-4 top-2 text-lg cursor-pointer"
                      onClick={() => setSee(false)}
                    />
                  ) : (
                    <AiOutlineEyeInvisible
                      className="absolute right-4 top-2 text-lg cursor-pointer"
                      onClick={() => setSee(true)}
                    />
                  )}

                  <input
                    onChange={(e) => setpassword(e.target.value)}
                    id="password"
                    name="password"
                    type={see ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-blue-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:opacity-75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  {loading && (
                    <MoonLoader
                      color={"#f0f7f6"}
                      loading={loading}
                      size={25}
                      aria-label="Loading Spinner"
                      data-testid="loader"
                      className="mx-4"
                    />
                  )}
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
