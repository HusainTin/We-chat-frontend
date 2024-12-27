"use client";
import React from "react";
import { useFormik } from "formik";
import Image from "next/image";
import { FC, useEffect } from "react";
import * as Yup from "yup";
import { getOauthRedirectUri, login } from "@/features/services/authService";
import toast from "react-hot-toast";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser } from "@/features/redux/user/userSlice";
import { setAuth } from "@/features/redux/auth/authSlice";
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import FacebookIcon from '@mui/icons-material/Facebook';
import { Button, IconButton } from "@mui/material";

type LoginProps = {
  setRoute: (route: string) => void;
};

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .required("Please enter your email address"),
  password: Yup.string().required("Please enter your password")
  // .matches(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/,
  //   "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character"
  // ),
});

export const Login: FC<LoginProps> = ({ setRoute }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: schema,
    onSubmit: async ({ email, password }) => {
    try{
        const response:any =await login({email, password})
        const is_mfa_enabled = response.data.is_mfa_enabled
        if(is_mfa_enabled){
            router.push(`/auth/mfa?token=${response.data.mfa_token}`)
            toast.success(response.data.message)
        }else{
            const expiry_date = new Date(Date.now() +  response.data.details.expires_in * 1000)
            toast.success("Login successful")
            localStorage.setItem("access_token", response.data.details.access_token)
            localStorage.setItem("refresh_token", response.data.details.refresh_token)
            localStorage.setItem("user_details", JSON.stringify(response.data.details?.user_details))
            localStorage.setItem("expiry_date",JSON.stringify(expiry_date))
    
            dispatch(setUser(JSON.stringify(response.data.details)));
            dispatch(setAuth({
              "access_token": JSON.stringify(response.data.details.access_token),
              "refresh_token": JSON.stringify(response.data.details.refresh_token),
            }));
            router.push("/chat")
        }
    }catch(error : any){
      toast.error(error?.response?.data?.errors?.detail)
    }
    },
  });
  const { errors, touched, values, handleChange, handleSubmit } = formik;

  const handleGoogleLogin = async()=>{
    try {
      const res = await getOauthRedirectUri("google")
      window.location.href = res.data.url;
    } catch (error:any) {
      toast.error("Something went wrong while redirecting to google")
    }

  }
  return (
    <>
      <div className="bg-[url('/bg.png')] flex items-center justify-center min-h-[100vh] h-full">
        <div className="bg-inherit backdrop-blur-[30px]  shadow-md rounded-[20px] w-[400px]">
          <div className="m-4 flex items-center justify-center flex-col">
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
            <div className="m-10 mt-3 sm:mx-auto sm:w-full sm:max-w-sm ">
              <h2 className=" my-6 text-slate-100 text-[15px]">
                Let&apos;s get started! Sign in to your account.
              </h2>
              <form className="space-y-6 m-1" action="#" method="POST" onSubmit={handleSubmit}>
                <div className="h-[50px]">
                  <div className="mt-2 flex">
                    <MailOutlineRoundedIcon className="text-white text-[2.3rem] mr-3"/>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      onChange={handleChange}
                      value={values.email}
                      autoComplete="email"
                      placeholder="hello@example.com"
                      className={`${errors.email && touched.email && ' border-red-600' }
                      block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6 px-3
                      bg-transparent text-white`}  
                    />
                  </div>
                    {errors.email && touched.email && (
                      <span className="text-red-500 pt-2 block text-[12px] ml-3">{errors.email}</span>
                    )}
                </div>

                <div className="min-h-[50px] h-full">
                  <div className="flex">
                  <KeyRoundedIcon className="text-white text-[2.3rem] mr-3" />
                    <input
                      id="password"
                      name="password"
                      value={values.password}
                      type="password"
                      onChange={handleChange}
                      autoComplete="current-password"
                      className={` block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6 px-3
                      bg-transparent text-white ${errors.password && touched.password ? "border-red-500":"" }`}
                    />
                  </div>
                    {errors.password && touched.password && (
                      <span className="text-red-500 pt-2 block text-[12px] ml-3">{errors.password}</span>
                    )}
                </div>

                <div className="flex justify-center items-center">
                  <button
                    type="submit"
                    className="flex w-[100px] justify-center rounded-[20px] bg-blue-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Sign in
                  </button>
                </div>
              </form>
              <div className="flex items-center justify-center text-white mt-5">
                <p>Or</p>
              </div>
              <div className="flex items-center justify-center text-white">
                <Button variant="outlined" color="inherit" endIcon={<GoogleIcon className="my-1 text-white"/>} sx={{fontSize:"medium"}} onClick={handleGoogleLogin} >
                    Sign in with Google
                </Button>
              {/* <IconButton onClick={handleGoogleLogin}>
                  <GoogleIcon className="m-1 text-white text-[30px]"/>
              </IconButton> */}
              </div>
              <p className="mt-5 text-sm text-gray-500">
                <a
                  className="font-semibold leading-6 text-slate-200 hover:text-slate-100 cursor-pointer"
                  onClick={()=>router.push("auth/forgot-password")}
                >
                  Forgot password?{" "}
                </a>
              </p>
              <div className="flex items-center justify-center my-5 mb-0 ml-4">
                <p className="text-sm text-gray-300">
                  Don&apos;t have any account ?
                  <button
                    onClick={() => setRoute("Register")}
                    className="font-semibold leading-6 text-yellow-200 hover:text-yellow-300"
                  >
                    {" "}
                    &nbsp; Sign up
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
