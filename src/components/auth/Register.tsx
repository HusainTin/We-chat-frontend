"use client";
import React from "react";
import { FC, useState } from "react";
import Image from "next/image";
import * as Yup from "yup";
import { useFormik } from "formik";
import { register } from "@/features/services/authService";
import toast from "react-hot-toast";

type RegisterProps = {
  setRoute: (route: string) => void;
};

const schema = Yup.object().shape({
  firstName: Yup.string().required("Please enter your first name"),
  lastName: Yup.string().required("Please enter your last name"),
  username: Yup.string().required("Please enter your username"),
  email: Yup.string()
    .email("Invalid email")
    .required("Please enter your email address"),
  password: Yup.string()
    .required("Please enter your password")
    .min(8)
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/,
      "Must include uppercase, lowercase, number & special character"
    ),
  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .min(8)
    .oneOf([Yup.ref("password")], "Passwords must match"),
});

export const Register: FC<RegisterProps> = ({ setRoute }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: schema,
    onSubmit: async ({
      firstName,
      lastName,
      username,
      email,
      password,
      confirmPassword,
    }) => {
      try {
        const data = {
          first_name: firstName,
          last_name: lastName,
          username: username,
          email: email,
          password: password,
          confirm_password: confirmPassword,
        };
        const response = await register(data);
        toast.success(
          "Registration successful! Please sign in to get started."
        );
        formik.resetForm();
        setRoute("Login");
      } catch (error: any) {
        if (error.response.data.errors?.email) {
          toast.error(error.response.data.errors.email[0]);
        }
        if (error.response.data.errors?.username) {
          toast.error(error.response.data.errors.username[0]);
        }
        if (error.response.data.errors?.non_field_errors?.[0])
          toast.error(error.response.data.errors?.non_field_errors[0]);
      }
    },
  });
  const { errors, touched, values, handleChange, handleSubmit } = formik;

  return (
    <div className="auth-card auth-card-register">
      {/* Glow accent */}
      <div className="auth-card-glow auth-card-glow-register" />

      {/* Header */}
      <div className="auth-card-header">
        <div className="auth-logo-group">
          <div className="auth-logo-ring">
            <Image
              src="/logo.png"
              alt="WeChat Logo"
              width={48}
              height={48}
              className="rounded-full"
            />
          </div>
          <div className="auth-brand">
            <span className="auth-brand-we">We</span>
            <span className="auth-brand-chat">Chat</span>
          </div>
        </div>
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-subtitle">
          Join the conversation — it only takes a moment
        </p>
      </div>

      {/* Form */}
      <form className="auth-form" onSubmit={handleSubmit}>
        {/* Name row */}
        <div className="auth-field-row">
          <div className="auth-field">
            <label htmlFor="reg-firstName" className="auth-label">
              First Name <span className="text-rose-400">*</span>
            </label>
            <div className="auth-input-wrapper">
              <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              <input
                id="reg-firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                onChange={handleChange}
                value={values.firstName}
                placeholder="John"
                className={`auth-input ${
                  errors.firstName && touched.firstName ? "auth-input-error" : ""
                }`}
              />
            </div>
            {errors.firstName && touched.firstName && (
              <span className="auth-error">{errors.firstName}</span>
            )}
          </div>

          <div className="auth-field">
            <label htmlFor="reg-lastName" className="auth-label">
              Last Name
            </label>
            <div className="auth-input-wrapper">
              <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              <input
                id="reg-lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                onChange={handleChange}
                value={values.lastName}
                placeholder="Doe"
                className={`auth-input ${
                  errors.lastName && touched.lastName ? "auth-input-error" : ""
                }`}
              />
            </div>
            {errors.lastName && touched.lastName && (
              <span className="auth-error">{errors.lastName}</span>
            )}
          </div>
        </div>

        {/* Username */}
        <div className="auth-field">
          <label htmlFor="reg-username" className="auth-label">
            Username <span className="text-rose-400">*</span>
          </label>
          <div className="auth-input-wrapper">
            <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 10-2.636 6.364M16.5 12V8.25" />
            </svg>
            <input
              id="reg-username"
              name="username"
              type="text"
              autoComplete="username"
              onChange={handleChange}
              value={values.username}
              placeholder="johndoe"
              className={`auth-input ${
                errors.username && touched.username ? "auth-input-error" : ""
              }`}
            />
          </div>
          {errors.username && touched.username && (
            <span className="auth-error">{errors.username}</span>
          )}
        </div>

        {/* Email */}
        <div className="auth-field">
          <label htmlFor="reg-email" className="auth-label">
            Email address <span className="text-rose-400">*</span>
          </label>
          <div className="auth-input-wrapper">
            <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            <input
              id="reg-email"
              name="email"
              type="email"
              autoComplete="email"
              onChange={handleChange}
              value={values.email}
              placeholder="you@example.com"
              className={`auth-input ${
                errors.email && touched.email ? "auth-input-error" : ""
              }`}
            />
          </div>
          {errors.email && touched.email && (
            <span className="auth-error">{errors.email}</span>
          )}
        </div>

        {/* Password row */}
        <div className="auth-field-row">
          <div className="auth-field">
            <label htmlFor="reg-password" className="auth-label">
              Password <span className="text-rose-400">*</span>
            </label>
            <div className="auth-input-wrapper">
              <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              <input
                id="reg-password"
                name="password"
                type={showPassword ? "text" : "password"}
                onChange={handleChange}
                value={values.password}
                placeholder="••••••••"
                className={`auth-input ${
                  errors.password && touched.password ? "auth-input-error" : ""
                }`}
              />
              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                  {showPassword ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  ) : (
                    <>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </>
                  )}
                </svg>
              </button>
            </div>
            {errors.password && touched.password && (
              <span className="auth-error">{errors.password}</span>
            )}
          </div>

          <div className="auth-field">
            <label htmlFor="reg-confirmPassword" className="auth-label">
              Confirm Password <span className="text-rose-400">*</span>
            </label>
            <div className="auth-input-wrapper">
              <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              <input
                id="reg-confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                onChange={handleChange}
                value={values.confirmPassword}
                placeholder="••••••••"
                className={`auth-input ${
                  errors.confirmPassword && touched.confirmPassword
                    ? "auth-input-error"
                    : ""
                }`}
              />
              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex={-1}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                  {showConfirmPassword ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  ) : (
                    <>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </>
                  )}
                </svg>
              </button>
            </div>
            {errors.confirmPassword && touched.confirmPassword && (
              <span className="auth-error">{errors.confirmPassword}</span>
            )}
          </div>
        </div>

        {/* Submit button */}
        <button type="submit" className="auth-submit-btn" id="register-submit">
          <span>Create account</span>
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </button>
      </form>

      {/* Switch to login */}
      <div className="auth-switch">
        <span className="auth-switch-text">Already have an account?</span>
        <button
          type="button"
          className="auth-switch-link"
          onClick={() => setRoute("Login")}
        >
          Sign in
        </button>
      </div>
    </div>
  );
};
