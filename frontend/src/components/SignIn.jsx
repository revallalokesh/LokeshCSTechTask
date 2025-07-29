import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SignIn = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", otp: "" });
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [showOtp, setShowOtp] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const sendOtp = async () => {
    if (!validateEmail(form.email)) {
      setError("Please enter a valid email address");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/send-otp",
        { email: form.email },
        { withCredentials: true }
      );
      console.log("OTP sent:", response.data);
      setIsOtpSent(true);
    } catch (err) {
      setError(err.response?.data?.message || "Error sending OTP");
      console.error("OTP send error:", err);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(form.email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (isOtpSent && !form.otp) {
      setError("OTP is required");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/auth/signin", {
        ...form,
        keepLoggedIn,
      }, {
        withCredentials: true,
      });
      localStorage.setItem("token", response.data.token); // Assuming JWT is returned
      if (keepLoggedIn) {
        localStorage.setItem("keepLoggedIn", "true"); // Optional: Store preference
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      console.error("Login error:", err);
    }
    setLoading(false);
  };

  const toggleOtpVisibility = () => {
    setShowOtp(!showOtp);
    console.log("Toggling OTP visibility to:", !showOtp);
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Left: Form */}
      <div className="w-1/2 flex flex-col bg-white p-6 md:p-8">
        <div className="flex items-center gap-2 mb-6">
          <img
            src={"../../public/images/icon.png"}
            alt="App Logo"
            className="w-10 h-10"
          />
          <div className="w-[35px] h-[26px] text-black flex items-center justify-center text-[24px] font-semibold leading-[110%] tracking-[-0.04em] font-inter">
            HD
          </div>
        </div>
        <div className="flex items-center justify-center flex-1">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Sign in</h2>
              <p className="text-sm text-gray-500">Please login to continue to your account.</p>
            </div>

            {error && <p className="text-sm text-red-500 text-center">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-400"
              />
              {!isOtpSent && (
                <button
                  type="button"
                  onClick={sendOtp}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:bg-blue-400"
                >
                  Get OTP
                </button>
              )}
              {isOtpSent && (
                <div className="form-group relative">
                  <label className="form-label sr-only">OTP</label>
                  <div className="password-group">
                    <input
                      className="form-input password-input w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-400"
                      placeholder="OTP"
                      required
                      type={showOtp ? "text" : "password"}
                      name="otp"
                      value={form.otp}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="password-toggle absolute top-1/2 right-3 -translate-y-1/2 text-gray-500"
                      onClick={toggleOtpVisibility}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-eye"
                        aria-hidden="true"
                      >
                        <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                  </div>
                </div>
              )}
              {isOtpSent && (
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:bg-blue-400"
                >
                  Sign in
                </button>
              )}
              {isOtpSent && (
                <div className="text-sm text-blue-600 text-center">
                  <button
                    type="button"
                    onClick={sendOtp}
                    disabled={loading}
                    className="hover:underline"
                  >
                    Resend OTP
                  </button>
                </div>
              )}
            </form>

            <p className="text-center text-sm">
              Need an account?{" "}
              <Link to="/signup" className="text-blue-600 hover:underline">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right: Image */}
      <div className="w-1/2 hidden md:block">
        <img
          src={"../../../public/images/right-column.png"}
          alt="Right Image"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default SignIn;