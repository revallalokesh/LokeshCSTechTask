import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
const SignUp = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", dob: "", email: "", otp: "" });
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showOtp, setShowOtp] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      setError("Name is required");
      return false;
    }
    if (!form.dob) {
      setError("Date of Birth is required");
      return false;
    }
    if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (isOtpSent && (!form.otp || form.otp.length !== 6 || !/^\d+$/.test(form.otp))) {
      setError("Please enter a valid 6-digit OTP");
      return false;
    }
    return true;
  };

  const sendOtp = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      await axios.post(
        "https://mnaotp.onrender.com/api/auth/send-otp",
        { email: form.email },
        { withCredentials: true }
      );
      setIsOtpSent(true);
    } catch (err) {
      setError(err.response?.data?.message || "Error sending OTP");
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const response = await axios.post("https://mnaotp.onrender.com/api/auth/signup", form, {
        withCredentials: true,
      });
      localStorage.setItem("token", response.data.token); // JWT token for authentication
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
    setLoading(false);
  };

  const toggleOtpVisibility = () => {
    setShowOtp(!showOtp);
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Left: Form */}
      <div className="w-1/2 flex flex-col bg-white p-6 md:p-8">
        <div className="flex items-center gap-2 mb-6">
          <img
            src={"/images/icon.png"}
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
              <h2 className="text-2xl font-bold">Sign up</h2>
              <p className="text-sm text-gray-500">Sign up to enjoy the feature of HD</p>
            </div>

            {error && <p className="text-sm text-red-500 text-center">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-400"
              />
              <input
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-400"
              />
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
                  <label className="form-label sr-only">OTP</label> {/* Hidden for accessibility */}
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
                  Sign up
                </button>
              )}
            </form>

            <p className="text-center text-sm">
              Already have an account?{" "}
              <Link to="/signin" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right: Image */}
      <div className="w-1/2 hidden md:block">
        <img
          src={"/images/right-column.png"}
          alt="Right Image"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default SignUp;