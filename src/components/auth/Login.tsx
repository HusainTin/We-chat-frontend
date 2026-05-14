"use client";
import React from "react";
import { useFormik } from "formik";
import Image from "next/image";
import { FC, useState } from "react";
import * as Yup from "yup";
import { getOauthRedirectUri, login } from "@/features/services/authService";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser } from "@/features/redux/user/userSlice";
import { setAuth } from "@/features/redux/auth/authSlice";

type LoginProps = {
  setRoute: (route: string) => void;
};

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .required("Please enter your email address"),
  password: Yup.string().required("Please enter your password"),
});

export const Login: FC<LoginProps> = ({ setRoute }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: schema,
    onSubmit: async ({ email, password }) => {
      try {
        const response: any = await login({ email, password });
        const is_mfa_enabled = response.data.is_mfa_enabled;
        if (is_mfa_enabled) {
          router.push(`/auth/mfa?token=${response.data.mfa_token}`);
          toast.success(response.data.message);
        } else {
          const expiry_date = new Date(
            Date.now() + response.data.details.expires_in * 1000
          );
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
          localStorage.setItem("expiry_date", JSON.stringify(expiry_date));

          dispatch(setUser(JSON.stringify(response.data.details)));
          dispatch(
            setAuth({
              access_token: JSON.stringify(
                response.data.details.access_token
              ),
              refresh_token: JSON.stringify(
                response.data.details.refresh_token
              ),
            })
          );
          router.push("/chat");
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.errors?.detail);
      }
    },
  });
  const { errors, touched, values, handleChange, handleSubmit } = formik;

  const handleGoogleLogin = async () => {
    try {
      const res = await getOauthRedirectUri("google");
      window.location.href = res.data.url;
    } catch (error: any) {
      toast.error("Something went wrong while redirecting to Google");
    }
  };

  return (
    <div className="auth-card">
      {/* Glow accent */}
      <div className="auth-card-glow" />

      {/* Header */}
      <div className="auth-card-header">
        <div className="auth-logo-group">
          <div className="auth-logo-ring">
            <Image
              src="/logo.png"
              alt="WeChat Logo"
              width={56}
              height={56}
              className="rounded-full"
            />
          </div>
          <div className="auth-brand">
            <span className="auth-brand-we">We</span>
            <span className="auth-brand-chat">Chat</span>
          </div>
        </div>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to continue your conversations</p>
      </div>

      {/* Form */}
      <form className="auth-form" onSubmit={handleSubmit}>
        {/* Email field */}
        <div className="auth-field">
          <label htmlFor="login-email" className="auth-label">
            Email address
          </label>
          <div className="auth-input-wrapper">
            <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            <input
              id="login-email"
              name="email"
              type="email"
              onChange={handleChange}
              value={values.email}
              autoComplete="email"
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

        {/* Password field */}
        <div className="auth-field">
          <label htmlFor="login-password" className="auth-label">
            Password
          </label>
          <div className="auth-input-wrapper">
            <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            <input
              id="login-password"
              name="password"
              value={values.password}
              type={showPassword ? "text" : "password"}
              onChange={handleChange}
              autoComplete="current-password"
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
              {showPassword ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          </div>
          {errors.password && touched.password && (
            <span className="auth-error">{errors.password}</span>
          )}
        </div>

        {/* Forgot password */}
        <div className="auth-forgot-row">
          <button
            type="button"
            className="auth-forgot-link"
            onClick={() => router.push("auth/forgot-password")}
          >
            Forgot password?
          </button>
        </div>

        {/* Submit button */}
        <button type="submit" className="auth-submit-btn" id="login-submit">
          <span>Sign in</span>
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </button>
      </form>

      {/* Divider */}
      <div className="auth-divider">
        <div className="auth-divider-line" />
        <span className="auth-divider-text">or continue with</span>
        <div className="auth-divider-line" />
      </div>

      {/* Social login */}
      <div className="auth-social-row">
        <button
          type="button"
          className="auth-social-btn"
          onClick={handleGoogleLogin}
          id="google-login"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span>Google</span>
        </button>
      </div>

      {/* Switch to register */}
      <div className="auth-switch">
        <span className="auth-switch-text">Don&apos;t have an account?</span>
        <button
          type="button"
          className="auth-switch-link"
          onClick={() => setRoute("Register")}
        >
          Create account
        </button>
      </div>
    </div>
  );
};
