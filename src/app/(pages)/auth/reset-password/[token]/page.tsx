"use client";
import { checkPasswordToken, resetPassword } from "@/features/services/authService";
import { CircularProgress } from "@mui/material";
import { useFormik } from "formik";
import { NextPage } from "next";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";

const schema = Yup.object().shape({
  password: Yup.string()
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

interface Props {}

const Page: NextPage<Props> = ({}) => {
  const { token } = useParams() as { token: string };
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [isError, setIsError] = useState(false);
  const formik = useFormik({
    initialValues: {  password: "", confirmPassword: ""},
    validationSchema: schema,
    onSubmit: async ({password, confirmPassword}) => {
    try{
        const data ={ new_password: password,confirm_new_password : confirmPassword}
        const response = await resetPassword(token, data);
        toast.success("Password reset successfully, you can now try to login again")
        formik.resetForm();
        router.push("/auth")
    }catch(error : any){
      if(error.response.data.errors?.non_field_errors[0]){
        toast.error(error.response.data.errors?.non_field_errors[0])
      }
    }
    },
  });
  const { errors, touched, values, handleChange, handleSubmit } = formik;

  useEffect(() => {
    checkPasswordToken(token)
      .then((res) => {
        setIsError(res.data.Expiry);
        setLoading(false);
      })
      .catch((error: any) => {
        console.log(error);
      });
  }, [token]);

  return (
    <>
      <div className="bg-[url('/bg.png')] flex items-center justify-center min-h-[100vh] h-full">
        <div className="bg-inherit backdrop-blur-[30px]  shadow-md rounded-[20px] w-[400px]">
          <div className="m-4 flex items-center justify-center flex-col w-full">
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
            {loading ? (
              <>
                <CircularProgress />
                <div className="text-[12px] text-white mt-6">
                  Validating reset link
                </div>
              </>
            ) : (
              <>
                {isError ? (
                  <>
                    <div className="text-[20px] text-red-800 mt-6">
                      The password reset link has expired or invalid. Please try
                      again.
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-[12px] text-white mt-6">
                      Set a new password for your account
                    </div>
                    <form className="h-full w-full" onSubmit={handleSubmit}>
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
                <div className="flex justify-center items-center w-full mt-6">
                <button
                  type="submit"
                  className="flex  justify-center rounded-[20px] bg-blue-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Reset password
                </button>
              </div>
                    </form>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
