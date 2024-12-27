"use client";
import { NextPage } from "next";
import * as Yup from "yup";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { changePassword } from "@/features/services/userService";
import { useState } from "react";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Button, IconButton, Tooltip } from "@mui/material";
import { useTheme } from "next-themes";

interface Props {}

const schema = Yup.object().shape({
  oldPasssword: Yup.string().required("Please enter your old password"),
  newPassword: Yup.string()
    .required("Please enter your new password")
    .min(8)
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character"
    ),
  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .min(8)
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character"
    ),
});

const Page: NextPage<Props> = ({}) => {
  const formik = useFormik({
    initialValues: { oldPasssword: "", newPassword: "", confirmPassword: "" },
    validationSchema: schema,

    onSubmit: async (values) => {
      try {
        const data = {
          old_password: values.oldPasssword,
          new_password: values.newPassword,
          confirm_new_password: values.confirmPassword,
        }
        const response = await changePassword(data);
        toast.success("Password changed successfully");
        formik.resetForm();
      } catch (error: any) {
        if (error.response.data.errors?.detail){
          toast.error(error.response.data.errors?.detail);
        }else if(error.response.data.errors?.non_field_errors[0]){
          toast.error(error.response.data.errors?.non_field_errors[0]);
        }
        }
    },
  });
  const { errors, touched, values, handleChange, handleSubmit } = formik;
  const [showPassword, setShowPassword] = useState(false)
  // const {theme} = useTheme()
  return (
    <>
      <div className="w-full h-full bg-white dark:bg-slate-800 px-10 pt-5">
      <h1 className="text-[40px] text-black dark:text-white  font-serif">Change Password</h1>
        <div className="w-full  p-2">
          <div className="flex justify-end">
            <Tooltip title="Toggle show password">
            <IconButton onClick={()=>setShowPassword(!showPassword)}>
              {
                showPassword?
                <RemoveRedEyeIcon className="text-black dark:text-white" />
                :
                <VisibilityOffIcon className="text-black dark:text-white" />
              }
            </IconButton>
              </Tooltip>
          </div>
          <div className="min-h-[100px] h-full">
            <label
              htmlFor="password"
              className="block text-sm font-medium leading-6 text-gray-900 dark:text-slate-200"
            >
              Old Password
              <span className="text-red-800"> *</span>
            </label>
            <div className="mt-2">
              <input
                id="oldPasssword"
                name="oldPasssword"
                onChange={handleChange}
                value={values.oldPasssword}
                type={showPassword?"text":"password"}
                className="bg-gray-50 dark:bg-gray-700 border border-gray-300 text-gray-900 dark:text-slate-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />
              {errors.oldPasssword && touched.oldPasssword && (
                <span className="text-red-500 pt-2 block text-[12px] ml-3 w-[300px]">
                  {errors.oldPasssword}
                </span>
              )}
            </div>
          </div>
          <div className="min-h-[100px] h-full">
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium leading-6 text-gray-900 dark:text-slate-200"
            >
              New Password
              <span className="text-red-800"> *</span>
            </label>
            <div className="mt-2">
              <input
                id="newPassword"
                name="newPassword"
                onChange={handleChange}
                value={values.newPassword}
                type={showPassword?"text":"password"}
                className="bg-gray-50 dark:bg-gray-700 border border-gray-300 text-gray-900 dark:text-slate-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />
              {errors.newPassword && touched.newPassword && (
                <span className="text-red-500 pt-2 block text-[12px] ml-3 w-[300px]">
                  {errors.newPassword}
                </span>
              )}
            </div>
          </div>
          <div className=" min-h-[100px] h-full">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium leading-6 text-gray-900 dark:text-slate-200"
            >
              Confirm New Password
              <span className="text-red-800"> *</span>
            </label>
            <div className="mt-2">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword?"text":"password"}
                onChange={handleChange}
                value={values.confirmPassword}
                className="bg-gray-50 dark:bg-gray-700 border border-gray-300 text-gray-900 dark:text-slate-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />
              {errors.confirmPassword && touched.confirmPassword && (
                <span className="text-red-500 pt-2 block text-[12px] ml-3">
                  {errors.confirmPassword}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center mt-[3rem]">
          <button
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 "
            onClick={() => handleSubmit()}
          >
            Submit
          </button>
        </div>
      </div>
    </>
  );
};

export default Page;
