"use client";
import { Login } from "@/components/auth/Login";
import { Register } from "@/components/auth/Register";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Loader from "@/components/Loader";

export default function Page() {
  const router = useRouter();
  const [route, setRoute] = useState("Login");
  const [loading, setLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const refresh_token = localStorage.getItem("refresh_token");
    const access_token = localStorage.getItem("access_token");
    if (access_token && refresh_token) {
      router.push("/chat");
    }
    setLoading(false);
  }, [router]);

  const handleRouteChange = (newRoute: string) => {
    setIsAnimating(true);
    setTimeout(() => {
      setRoute(newRoute);
      setIsAnimating(false);
    }, 300);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="auth-page-wrapper">
      {/* Animated background */}
      <div className="auth-bg">
        <div className="auth-bg-orb auth-bg-orb-1" />
        <div className="auth-bg-orb auth-bg-orb-2" />
        <div className="auth-bg-orb auth-bg-orb-3" />
      </div>

      {/* Floating particles */}
      <div className="auth-particles">
        {[...Array(6)].map((_, i) => (
          <div key={i} className={`auth-particle auth-particle-${i + 1}`} />
        ))}
      </div>

      {/* Content */}
      <div
        className={`auth-content-wrapper ${
          isAnimating ? "auth-fade-out" : "auth-fade-in"
        }`}
      >
        {route === "Login" ? (
          <Login setRoute={handleRouteChange} />
        ) : route === "Register" ? (
          <Register setRoute={handleRouteChange} />
        ) : null}
      </div>
    </div>
  );
}
