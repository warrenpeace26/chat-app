import React, { useContext, useState } from "react";
import assets from "../assets/assets";
import { AuthContext } from "../context/authContext";

const LoginPage = () => {
  const [currState, setCurrState] = useState("Sign up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const { login } = useContext(AuthContext);

  const onSubmitHadler = (event) => {
    event.preventDefault();
    if (currState === "Sign up" && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    }

    login(currState === "Sign up" ? "signup" : "login", {
      fullName,
      email,
      password,
      bio,
    });
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center gap-8 sm:gap-12 px-4 py-10 sm:px-10
      sm:justify-evenly max-sm:flex-col backdrop-blur-2xl bg-[#0f0f1c]"
    >
      {/* Left (Logo) */}
      <img
        src={assets.logo_big}
        alt="Logo"
        className="w-[150px] sm:w-[200px] md:w-[250px] max-sm:mb-4"
      />

      {/* Right (Form) */}
      <form
        onSubmit={onSubmitHadler}
        className="w-full max-w-[400px] border-2 bg-white/10 text-white border-gray-600 p-6
        sm:p-8 flex flex-col gap-5 sm:gap-6 rounded-lg shadow-xl"
      >
        {/* Heading */}
        <h2 className="font-semibold text-xl sm:text-2xl flex justify-between items-center">
          {currState}
          {isDataSubmitted && (
            <img
              onClick={() => setIsDataSubmitted(false)}
              src={assets.arrow_icon}
              alt="Back"
              className="w-5 cursor-pointer"
            />
          )}
        </h2>

        {/* Full Name (only on sign up before submit) */}
        {currState === "Sign up" && !isDataSubmitted && (
          <input
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
            type="text"
            placeholder="Full Name"
            required
            className="p-2 border border-gray-500 rounded-md bg-transparent text-sm sm:text-base
            focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        )}

        {/* Email and Password */}
        {!isDataSubmitted && (
          <>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="Email Address"
              required
              className="p-2 border border-gray-500 rounded-md bg-transparent text-sm sm:text-base
              focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="Password"
              required
              className="p-2 border border-gray-500 rounded-md bg-transparent text-sm sm:text-base
              focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </>
        )}

        {/* Bio Field */}
        {currState === "Sign up" && isDataSubmitted && (
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            rows={4}
            placeholder="Provide a short bio...."
            required
            className="p-2 border border-gray-500 rounded-md bg-transparent text-sm sm:text-base
            focus:outline-none focus:ring-2 focus:ring-indigo-500"
          ></textarea>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="py-3 w-full bg-gradient-to-r from-purple-400 to-violet-600
          text-white rounded-md text-sm sm:text-base font-medium cursor-pointer hover:opacity-90 transition"
        >
          {currState === "Sign up" ? "Create Account" : "Login Now"}
        </button>

        {/* Terms */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-300">
          <input type="checkbox" />
          <p>Agree to the terms of use & privacy policy</p>
        </div>

        {/* Toggle Login/Signup */}
        <div className="text-xs sm:text-sm text-gray-400 text-center">
          {currState === "Sign up" ? (
            <p>
              Already have an account?{" "}
              <span
                onClick={() => {
                  setCurrState("Login");
                  setIsDataSubmitted(false);
                }}
                className="text-violet-500 font-medium cursor-pointer"
              >
                Login here
              </span>
            </p>
          ) : (
            <p>
              Create an account{" "}
              <span
                onClick={() => {
                  setCurrState("Sign up");
                  setIsDataSubmitted(false);
                }}
                className="text-violet-500 font-medium cursor-pointer"
              >
                Click here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
