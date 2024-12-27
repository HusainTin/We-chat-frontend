"use client";
import { NextPage } from "next";
import Image from "next/image";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { FormikConfig, useFormik } from "formik";
import { sendResetPasswordEmail } from "@/features/services/authService";
interface Props {}

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .required("Please enter your email address"),
});

const Page: NextPage<Props> = ({}) => {
  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: schema,
    onSubmit: async ({ email }: any) => {
      try {
        const data = {
          email,
        };
        const res = await sendResetPasswordEmail(data);
        toast.success("Reset password link sent successfully to your email address");
      } catch (error: any) {
          toast.error(error?.response?.data?.message)
      }
    },
  });
  const { errors, touched, values, handleChange, handleSubmit }: any = formik;

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
            <div className="text-[12px] text-white mt-6">
              Enter your account email address to send a reset password link
            </div>
            <form className="h-full w-full" onSubmit={handleSubmit}>
              <div className="h-[80px] w-full">
                <div className="mt-2 flex w-full">
                  <MailOutlineRoundedIcon className="text-white text-[2.3rem] mr-3 " />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    onChange={handleChange}
                    value={values.email}
                    autoComplete="email"
                    placeholder="hello@example.com"
                    className={`${
                      errors.email && touched.email && " border-red-600"
                    }
                      block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6 px-3
                      bg-transparent text-white`}
                  />
                </div>
                {errors.email && touched.email && (
                  <span className="text-red-500 pt-2 block text-[12px] ml-3">
                    {errors.email}
                  </span>
                )}
              </div>
              <div className="flex justify-center items-center w-full">
                <button
                  type="submit"
                  className="flex w-[100px] justify-center rounded-[20px] bg-blue-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Send reset password link
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
