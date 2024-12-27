"use client"
import UserProtected from "@/components/auth/UserProtected";
import { setUser } from "@/features/redux/user/userSlice";
import { getUserProfile, saveUserDetails } from "@/features/services/userService";
import { useFormik } from "formik";
import { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import * as Yup from "yup";

interface Props {}

const schema = Yup.object().shape({
  username: Yup.string().required("Please enter your username"),
  password: Yup.string()
    .required("Please enter your password")
    .min(8)
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character"
    ),
  confirmPassword: Yup.string()
    .required("Please enter your confirm password")
    .min(8)
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character"
    ),
});

const Page: NextPage<Props> = ({}) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const formik = useFormik({
    initialValues: { username: "", password: "", confirmPassword: "" },
    validationSchema: schema,
    onSubmit: async ({ username, password, confirmPassword }) => {
      try {
        const data = {
          username: username,
          password: password,
          confirm_password: confirmPassword,
        };
        const response = await saveUserDetails(data);
        toast.success(response?.data?.message)
        formik.resetForm();
        const res = await getUserProfile()
        localStorage.setItem("user_details", JSON.stringify(res.data))
        dispatch(setUser(JSON.stringify(res.data)));
        router.replace("/chat")
      } catch (error: any) {
        const errors = error?.response?.data?.errors
        if (errors.non_field_errors ){
          toast.error(errors.non_field_errors[0])
        }
        console.log(error);
      }
    },
  });

  const { errors, touched, values, handleChange, handleSubmit } = formik;

  return (
    <>
    <UserProtected>
      <div className="bg-[url('/bg.png')] flex items-center justify-center min-h-[100vh] h-full">
        <div className="bg-inherit backdrop-blur-[30px] shadow-md rounded-[20px] w-[400px]">
          <div className="m-4 flex items-center justify-center flex-col">
            <div className="flex w-full p-1 flex-row">
              <Image
                src="/logo.png"
                alt="logo"
                width={80}
                height={80}
                className="rounded-full bg-blue-800"
              />
              <div className="flex items-center p-1">
                <p className="font-sans text-white text-[3rem]">We</p>
                <p className="font-sans text-blue-800 text-[3rem]">Chat</p>
              </div>
            </div>
            <div className="m-10 mt-3 sm:mx-auto sm:w-full sm:max-w-sm">
              <h2 className="my-6 text-slate-100 text-[15px]">
                Set up your username and password for secure access.
              </h2>
              <form className="space-y-6" action="#" method="POST" onSubmit={handleSubmit}>
              <div className="w-full mt-4 min-h-[80px] h-full">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium leading-6 text-slate-200 ml-2"
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
                    
                    autoComplete="off"
                    placeholder="JohnDoe...."
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 px-3 bg-transparent text-white"
                  />
                  {errors.username && touched.username && (
                    <span className="text-red-500 pt-2 block text-[12px] ml-3">
                      {errors.username}
                    </span>
                  )}
                </div>
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
                    autoComplete="off"  
                    value={values.password}
                    type="password"
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 px-3 bg-transparent text-white"
                  />
                  {errors.password && touched.password && (
                    <span className="text-red-500 pt-2 block text-[12px] ml-3 w-[300px]">
                      {errors.password}
                    </span>
                  )}
                </div>
              </div>
              <div className="min-h-[80px] h-full">
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
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 px-3 bg-transparent text-white"
                  />
                  {errors.confirmPassword && touched.confirmPassword && (
                    <span className="text-red-500 pt-2 block text-[12px] ml-3">
                      {errors.confirmPassword}
                    </span>
                  )}
                </div>
                <div className="flex justify-center items-center mt-5">
                  <button
                    type="submit"
                    className="flex w-[100px] justify-center rounded-[20px] bg-blue-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Sign Up
                  </button>
                </div>
                
              </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      </UserProtected>
    </>
  );
};

export default Page;
