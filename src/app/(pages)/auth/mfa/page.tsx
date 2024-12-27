"use client";
import GetOtp from "@/components/auth/GetOtp";
import { NextPage } from "next";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
// import { Suspense, useSearchParams } from 'next/router';

import { useEffect, useRef, useState } from "react";
import { MFALogin, verifyMFAToken } from "@/features/services/authService";
import { CircularProgress } from "@mui/material";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUser } from "@/features/redux/user/userSlice";
import { setAuth } from "@/features/redux/auth/authSlice";

interface Props {}

type VerifyNumber = {
  "0": string;
  "1": string;
  "2": string;
  "3": string;
};

const Page: NextPage<Props> = ({}) => {
  const params = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    const newToken = params.get("token") as string;
    setToken(newToken);
  }, [params]);

  

  const router = useRouter();
  const dispatch = useDispatch();
  useEffect(() => {
    if (token !== ""){
      verifyMFAToken(token)
      .then((res: any) => {
        setIsValidToken(res?.data?.is_valid);
      })
      .catch((error: any) => {
        toast.error("Something went wrong try generating otp again");
      })
      .finally(() => {
        setLoading(false);
      });
    }
  }, [token]);

  const [verifyNumber, setverifyNumber] = useState<VerifyNumber>({
    0: "",
    1: "",
    2: "",
    3: "",
  });
  const [invalidError, setInvalidError] = useState<Boolean>(false);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const handleInputChange = (index: number, value: string) => {
    if (/^[0-9]{0,1}$/.test(value)) {
      setInvalidError(false);
      const newVerifyNumber = { ...verifyNumber, [index]: value };
      setverifyNumber(newVerifyNumber);
      if (value == "" && index > 0) {
        inputRefs[index - 1].current?.focus();
      } else if (value.length == 1 && index < 3) {
        inputRefs[index + 1].current?.focus();
      }
    }
  };
  const VerificationHandler = async () => {
    const isNotFilled = Object.values(verifyNumber).some(
      (value) => value === ""
    );

    if (isNotFilled) {
      setInvalidError(true); // Set the error to true if any field is empty
    } else {
      const data = {
        otp: Object.values(verifyNumber).join(""),
        token: token,
      };
      try {
        const response = await MFALogin(data);
        console.log(response);
        toast.success("Login successful");
        localStorage.setItem(
          "access_token",
          response.data.details.access_token
        );
        localStorage.setItem(
          "refresh_token",
          response.data.details.refresh_token
        );
        localStorage.setItem(
          "user_details",
          JSON.stringify(response.data.details?.user_details)
        );

        dispatch(setUser(JSON.stringify(response.data.details)));
        dispatch(
          setAuth({
            access_token: JSON.stringify(response.data.details.access_token),
            refresh_token: JSON.stringify(response.data.details.refresh_token),
          })
        );
        router.push("/chat");
      } catch (error: any) {
        toast.error(error?.response?.data?.errors[0]);
        setInvalidError(true);
      }
    }
  };

  if (loading) {
    return (
      <>
        <div className="bg-[url('/bg.png')] flex items-center justify-center min-h-[100vh] h-full text-white">
          <CircularProgress color="inherit" size={50} />
        </div>
      </>
    );
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
            {!isValidToken ? (
              <>
                <div className="w-full mx-1 my-6 flex justify-center items-center">
                  <h1 className="text-[26px] text-red-500 ">
                    Oops! The link is invalid or expired. Please log in to
                    request a new one.
                  </h1>
                </div>
                <button
                  className={` mt-10 flex w-[150px] justify-center rounded-[20px] bg-blue-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
                  onClick={() => router.push("/auth")}
                >
                  Back to login
                </button>
              </>
            ) : (
              <>
                <h1 className="text-[20px] my-4">
                  Please confirm the OTP sent to your email to continue
                </h1>
                <div className="m-2">
                  <GetOtp
                    verifyNumber={verifyNumber}
                    inputRefs={inputRefs}
                    invalidError={invalidError}
                    handleInputChange={handleInputChange}
                  />
                </div>
                <button
                  className={` mt-10 flex w-[100px] justify-center rounded-[20px] bg-blue-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
                  onClick={VerificationHandler}
                >
                  Verify OTP
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
