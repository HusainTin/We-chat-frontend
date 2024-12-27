"use client";
import React from "react";
import { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import * as Yup from "yup"
import { useFormik } from "formik";
import { register } from "@/features/services/authService";
import toast from "react-hot-toast";
import { redirect } from "next/navigation";
type RegisterProps = {
  setRoute: (route: string) => void;
};

const schema = Yup.object().shape({
  firstName: Yup.string().required("Please enter your first name"),
  lastName: Yup.string().required(),
  username: Yup.string().required("Please enter your username"),
  email: Yup.string()
    .email("Invalid email")
    .required("Please enter your email address"),
  password: Yup.string().required("Please enter your password").min(8)
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/,
    "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character"
  ),
  confirmPassword: Yup.string().required("Please enter your confirm password").min(8)
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/,
    "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character"
  ),
});

export const Register: FC<RegisterProps> = ({ setRoute }) => {
  const formik = useFormik({
    initialValues: { firstName :"", lastName :"", username:"", email: "", password: "", confirmPassword: ""},
    validationSchema: schema,
    onSubmit: async ({ firstName, lastName , username, email, password, confirmPassword}) => {
    try{
        const data ={ first_name :firstName, last_name : lastName , username : username,email: email, password: password,confirm_password : confirmPassword}
        const response = await register(data);
        toast.success("Registration successfull, please login to access the resources")
        formik.resetForm();
        setRoute("Login")
    }catch(error : any){
      if (error.response.data.errors?.email){
        toast.error(error.response.data.errors.email[0])
      }
      if (error.response.data.errors?.username){
        toast.error(error.response.data.errors.username[0])
      }
      if(error.response.data.errors?.non_field_errors[0])
      toast.error(error.response.data.errors?.non_field_errors[0])
    }
    },
  });
  const { errors, touched, values, handleChange, handleSubmit } = formik;
  return (
    <>
      <div className="bg-[url('/bg.png')] flex items-center justify-center min-h-[100vh] h-full ">
        <div className=" bg-inherit backdrop-blur-[30px] shadow-md rounded-[20px]">
          <div className="m-2 flex items-center justify-center flex-col">
          <div className="flex w-full p-1 flex-row">
            <Image
              src="/logo.png"
              alt="logo"
              width={80}
              height={80}
              className=" rounded-full bg-blue-800"
              />
              <div className="flex items-center p-1">
                <p className="font-sans text-white text-[3rem]">We</p>
                <p className="font-sans text-blue-800 text-[3rem]">Chat</p>
              </div>
              </div>
            <div className="m-10 mt-1">
              <h2 className=" my-6 text-white text-[15px]">
                Create your account to get started
              </h2>
              <form className="space-y-6" action="#" method="POST" onSubmit={handleSubmit}>
                <div className="flex flex-col sm:flex-row mt-2">
                  <div className="w-full mr-6 min-h-[80px] h-full">
                    <label
                      htmlFor="fName"
                      className="block text-sm font-medium leading-6 text-slate-200 ml-2"
                    >
                      First Name
                      <span className="text-red-800"> *</span>
                    </label>
                    <div className="mt-2">
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        autoComplete="firstName"
                        onChange={handleChange}
                        value={values.firstName}
                        placeholder="John...."
                        className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6 px-3
                      bg-transparent text-white"
                      />
                      {errors.firstName && touched.firstName && (
                      <span className="text-red-500 pt-2 block text-[12px] ml-3">{errors.firstName}</span>
                    )}
                    </div>
                  </div>
                  <div className="w-full mt-2 md:mt-0 min-h-[80px] h-full">
                    <label
                      htmlFor="lName"
                      className="block text-sm font-medium leading-6 text-slate-200 ml-2"
                    >
                      Last Name
                    </label>
                    <div className="mt-2">
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        onChange={handleChange}
                        value={values.lastName}
                        autoComplete="lastName"
                        placeholder="Doe...."
                        className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6 px-3
                      bg-transparent text-white"
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full min-h-[80px] h-full">
                  <div className="w-full">
                    <div className="">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium leading-6 text-slate-200 ml-2"
                      >
                        Email address
                        <span className="text-red-800"> *</span>
                      </label>
                      <div className="mt-2">
                        <input
                          id="email"
                          name="email"
                          type="email"
                          onChange={handleChange}
                          value={values.email}
                          autoComplete="email"
                          placeholder="hello@example.com"
                          className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6 px-3
                      bg-transparent text-white"
                        />
                        {errors.email && touched.email && (
                          <span className="text-red-500 pt-2 block text-[12px] ml-3">{errors.email}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="w-full mt-4 min-h-[80px] h-full">
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium leading-6 text-slate-200 ml-2 "
                    >
                      Username
                      <span className="text-red-800"> *</span>
                    </label>
                    <div className="mt-2">
                      <input
                        id="username"
                        name="username"
                        type="text"
                        onChange={handleChange}
                        value={values.username}
                        autoComplete="username"
                        placeholder="JohnDoe...."
                        className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6 px-3
                      bg-transparent text-white"
                      />
                      {errors.username && touched.username && (
                        <span className="text-red-500 pt-2 block text-[12px] ml-3">{errors.username}</span>
                      )}
                    </div>
                  </div>
                  <div></div>
                </div>
                <div className="min-h-[80px] h-full">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-slate-200"
                  >
                    Password
                    <span className="text-red-800"> *</span>
                  </label>
                  <div className="mt-2">
                    <input
                      id="password"
                      name="password"
                      onChange={handleChange}
                      value={values.password}
                      type="password"
                      className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6 px-3
                      bg-transparent text-white"
                    />
                    {errors.password && touched.password && (
                        <span className="text-red-500 pt-2 block text-[12px] ml-3 w-[300px]">{errors.password}</span>
                      )}
                  </div>
                </div>
                <div className=" min-h-[80px] h-full">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium leading-6 text-slate-200"
                  >
                    Confirm Password
                    <span className="text-red-800"> *</span>
                  </label>
                  <div className="mt-2">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      onChange={handleChange}
                      value={values.confirmPassword}
                      className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6 px-3
                      bg-transparent text-white"
                    />
                    {errors.confirmPassword && touched.confirmPassword && (
                        <span className="text-red-500 pt-2 block text-[12px] ml-3">{errors.confirmPassword}</span>
                      )}
                  </div>
                </div>

                <div className="flex justify-center items-center">
                  <button
                    type="submit"
                    className="flex w-[100px] justify-center rounded-[20px] bg-blue-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Sign Up
                  </button>
                </div>
              </form>
              <div className="flex items-center justify-center my-4 ">
                <p className="text-sm text-gray-300 ">
                  Already have an account ?
                  <button
                    onClick={() => setRoute("Login")}
                    className="font-semibold leading-6 text-yellow-200 hover:text-yellow-300"
                  >
                    {" "}
                    &nbsp; Sign In  
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
