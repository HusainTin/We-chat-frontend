"use client";
import React from "react";
import { Avatar, Button, Radio, RadioGroup } from "@mui/material";
import { NextPage } from "next";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import { useEffect, useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import * as Yup from "yup";
import { useFormik } from "formik";
import {
  updateUserProfile,
  updateProfilePic,
  getUserProfile,
} from "@/features/services/userService";
import toast from "react-hot-toast";
import { capitalizeFirstLetter, getColorForUsername } from "@/utils/helper";
import { setUser } from "@/features/redux/user/userSlice";
import { useDispatch } from "react-redux";
import { useTheme } from "next-themes";
interface Props {}

const schema = Yup.object().shape({
  firstName: Yup.string().required("Please enter your first name"),
  lastName: Yup.string().required(),
  username: Yup.string().required("Please enter your username"),
  email: Yup.string()
    .email("Invalid email")
    .required("Please enter your email address"),
  gender: Yup.string(),
  dob: Yup.date(),
});

const Page: NextPage<Props> = ({}) => {
  const user = JSON.parse(localStorage.getItem("user_details") || "{}");
  const {theme} = useTheme()
  const [profilePic, setProfilePic] = useState(user?.profile_picture);
  useEffect(() => {
    setProfilePic(user?.profile_picture);
  }, [user]);
  const [editMode, setEditMode] = useState(false);
  const dateObject = new Date(user?.dob);
  const dispatch = useDispatch();
  const date = dateObject.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const formik = useFormik({
    initialValues: {
      firstName: user?.first_name ? user?.first_name : "",
      lastName: user?.last_name ? user?.last_name : "",
      username: user?.username  ? user?.username : "",
      email: user?.email ? user?.email : "",
      gender: user?.gender ? user?.gender : "",
      dob: user?.dob ? user?.dob : "",
    },
    validationSchema: schema,
    onSubmit: async ({ firstName, lastName, username, email, gender, dob }) => {
      const formattedDob = dob ? dayjs(dob).format("YYYY-MM-DD") : null;
      try {
        const data = {
          first_name: firstName,
          last_name: lastName,
          username: username,
          email: email,
          gender: gender,
          dob: formattedDob,
        };
        await updateUserProfile(data);
        toast.success("Profile updated successfully");
        formik.resetForm();
        setEditMode(false);
        const res = await getUserProfile()
        localStorage.setItem("user_details", JSON.stringify(res.data))
        dispatch(setUser(JSON.stringify(res.data)));
      } catch (error: any) {
        console.log(error)
        if (error.response.data.errors.email) {
          toast.error(error.response.data.errors.email[0]);
        }
        if (error.response.data.errors.username) {
          toast.error(error.response.data.errors.username[0]);
        }
      }
    },
  });

  const imageHandler = async (e: any) => {
    const file = e.target.files[0];

    // Create a FormData object to hold the file
    const formData = new FormData();
    formData.append("profile_picture", file);
    try {
      // Send the file to the backend as FormData
      const response = await updateProfilePic(formData);
      toast.success("Profile picture updated successfully");
      const res = await getUserProfile();
      localStorage.setItem("user_details", JSON.stringify(res.data));
      setProfilePic(res.data?.profile_pic);
      dispatch(setUser(JSON.stringify(res.data)));
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload profile picture. Please try again.");
    }
  };

  const { errors, touched, values, handleChange, handleSubmit }: any = formik;
  return (
    <>
      <div className="w-full flex flex-col md:px-10 px-2 bg-white dark:bg-slate-800 rounded-3xl ">
        <div className="flex w-full flex-col md:flex-row items-center justify-between mb-2">
          <div className=" flex items-center">
            <Avatar
              sx={{
                width: "80px",
                height: "80px",
                my: "20px",
                backgroundColor: getColorForUsername(user?.username),
              }}
              src={profilePic}
            >
              <p className="text-[50px]">
                {capitalizeFirstLetter(user?.username?.charAt(0))}
              </p>
            </Avatar>
            <div className="flex flex-col gap-1 px-6">
              <p className="capitalize text-[28px] text-red-600 dark:text-red-400">
                {user?.first_name} {user.last_name}
              </p>
              <p className="px-1 text-slate-800 dark:text-slate-200">@{user?.username}</p>
            </div>
          </div>
          <div className="">
            <input
              accept="image/*"
              id="upload-profile-pic"
              type="file"
              style={{ display: "none" }}
              onChange={imageHandler}
            />
            <label htmlFor="upload-profile-pic">
              <Button variant="outlined" color={theme=="dark"?"inherit":"primary"}component="span" >

                Upload profile pic
              </Button>
            </label>
          </div>
        </div>
        <div className="w-full flex justify-end md:px-10 px-2">
          {!editMode ? (
            <Button variant="contained" color={theme=="dark"?"inherit":"primary"} endIcon={<ModeEditOutlineIcon sx={{ height: "18px", width: "18px" }} />} sx={{
              color:theme=="dark"?"white":"#1976d2",
              "&:hover":{
                color:theme=="dark"?"#1976d2":"white"
              }
            }}
            onClick={() => setEditMode(true)}>
                Edit
              </Button>
          ) : null}
        </div>
        <div className="md:m-[-15px] m-0">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 mb-6 md:grid-cols-2 md:px-10 px-2">
              <div className="h-[80px]">
                <label
                  htmlFor="firstName"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-slate-200"
                >
                  First name
                  {editMode ? <span className="text-red-800"> *</span> : <></>}
                </label>
                {editMode ? (
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={values.firstName}
                    onChange={handleChange}
                    className="bg-gray-50 dark:bg-gray-700 border border-gray-300 text-gray-900 dark:text-slate-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="John"
                  />
                ) : (
                  <p className="text-[16px] text-blue-500 dark:text-blue-400">
                    {user?.first_name}
                  </p>
                )}
                {editMode && errors.firstName && touched.firstName && (
                  <span className="text-red-500 pt-2 block text-[12px] ml-3">
                    {errors.firstName}
                  </span>
                )}
              </div>
              <div className="h-[80px]">
                <label
                  htmlFor="lastName"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-slate-200"
                >
                  Last name
                  {editMode ? <span className="text-red-800"> *</span> : <></>}
                </label>
                {editMode ? (
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={values.lastName}
                    onChange={handleChange}
                    className="bg-gray-50 dark:bg-gray-700 border border-gray-300 text-gray-900 dark:text-slate-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Doe"
                  />
                ) : (
                  <p className="text-[16px] text-blue-500 dark:text-blue-400">{user?.last_name}</p>
                )}
                {editMode && errors.lastName && touched.lastName && (
                  <span className="text-red-500 pt-2 block text-[12px] ml-3">
                    {errors.lastName}
                  </span>
                )}
              </div>
              <div className="h-[80px]">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-slate-200"
                >
                  Email
                  {editMode ? <span className="text-red-800"> *</span> : <></>}
                </label>
                {editMode ? (
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    className="bg-gray-50 dark:bg-gray-700 border border-gray-300 text-gray-900 dark:text-slate-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="john@example.com"
                  />
                ) : (
                  <p className="text-[16px] text-blue-500 dark:text-blue-400">{user?.email}</p>
                )}
                {editMode && errors.email && touched.email && (
                  <span className="text-red-500 pt-2 block text-[12px] ml-3">
                    {errors.email}
                  </span>
                )}
              </div>
              <div className="h-[80px]">
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-slate-200"
                >
                  Username
                  {editMode ? <span className="text-red-800"> *</span> : <></>}
                </label>
                {editMode ? (
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={values.username}
                    onChange={handleChange}
                    className="bg-gray-50 dark:bg-gray-700 border border-gray-300 text-gray-900 dark:text-slate-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="johndoe"
                  />
                ) : (
                  <p className="text-[16px] text-blue-500 dark:text-blue-400">{user?.username}</p>
                )}
                {editMode && errors.username && touched.username && (
                  <span className="text-red-500 pt-2 block text-[12px] ml-3">
                    {errors.username}
                  </span>
                )}
              </div>
            </div>

            <div className="md:px-10 px-2">
              <div>
                <label
                  htmlFor="gender"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-slate-200"
                >
                  Gender
                </label>
                {editMode ? (
                  <RadioGroup
                    defaultValue={user?.gender}
                    name="gender"
                    sx={{ display: "flex", flexDirection: "row" }}
                    onChange={handleChange}
                  >
                    <label>
                      <Radio value="female" className=" text-black dark:text-white " /> Female
                    </label>
                    <label>
                      <Radio value="male" className="text-black dark:text-white"/> Male
                    </label>
                    <label>
                      <Radio value="other" className="text-black dark:text-white"/> Other
                    </label>
                  </RadioGroup>
                ) : (
                  <p className="text-[16px] text-blue-500 dark:text-blue-400">
                    {" "}
                    {user?.gender ? user?.gender : "N/A"}
                  </p>
                )}
              </div>
              <div className="my-10">
                <label
                  htmlFor="dob"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-slate-200"
                >
                  Date of birth
                </label>
                {editMode ? (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <div className="h-[20px] text-black dark:text-white">
                      <DatePicker
                        name="dob"
                        defaultValue={dayjs(date)}
                        onChange={(date) => formik.setFieldValue("dob", date)}
                        sx={{
                          '& .MuiOutlinedInput-root': { // Target the input field
                            color: theme === "dark" ? "white" : "black", // Text color
                            '& fieldset': {
                              borderColor: theme === "dark" ? "white" : "black", // Border color
                            },
                            '&:hover fieldset': {
                              borderColor: theme === "dark" ? "#90caf9" : "#1976d2", // Border color on hover
                            },
                          },
                          '& .MuiSvgIcon-root': { // Target the calendar icon
                            color: theme === "dark" ? "white" : "black", // Icon color
                          },
                          '& .MuiPaper-root': { // Target the dropdown (calendar) popover
                            backgroundColor: theme === "dark" ? "#333" : "#fff", // Calendar background
                            color: theme === "dark" ? "white" : "black", // Calendar text color
                          }
                        }}
                      />
                    </div>
                  </LocalizationProvider>
                ) : (
                  <p className="text-[16px] text-blue-500 dark:text-blue-400">
                    {" "}
                    {user?.dob ? date : "N/A"}
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-center items-center mt-[3rem]">
              {editMode && (
                <>
                  <button
                    type="button"
                    className="text-red-500 dark:text-red-400 hover:text-white dark:hover:text-white border border-red-500 dark:border-red-400 hover:bg-red-600 dark:hover:bg-red-500 focus:ring-4 focus:outline-none focus:ring-red-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                    onClick={() => setEditMode(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    onClick={() => {
                      handleSubmit();  // This manually triggers form submission.
                    }}
                  
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                  >
                    Submit
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Page;
