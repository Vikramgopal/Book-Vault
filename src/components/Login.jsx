import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/UseAuthentication";
import { IoFingerPrint, IoPerson } from "react-icons/io5";
import { LuEyeClosed, LuEye } from "react-icons/lu";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const { login, isAuthenticated, error } = useAuth();
  const navigate = useNavigate();
  const errorMessage = error && "Invalid Username and Password";

  function handleSubmit(e) {
    e.preventDefault();
    login({ email, password });
  }
  useEffect(() => {
    if (isAuthenticated) navigate("app", { replace: true });
  }, [isAuthenticated, navigate]);

  function handleSignin(e) {
    e.preventDefault();
    navigate("signin");
  }

  return (
    <section className="h-full flex flex-col justify-center items-center">
      {/* Login Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#ada5cc] bg-opacity-90 px-8 py-6 flex flex-col gap-6 transition-all duration-150 shadow-md rounded-2xl lg:px-24 lg:py-12 md:px-16 md:py-8 w-[90%] max-w-[400px] md:max-w-[500px] lg:max-w-[600px]"
      >
        <h1 className="font-semibold text-2xl text-black font-poppins uppercase md:text-3xl">
          User Login
        </h1>

        {/* Email Field */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 font-dmsans h-12">
            <div className="flex items-center justify-center h-full w-14 rounded-full bg-black text-white">
              <IoPerson size={24} />
            </div>
            <input
              type="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="w-full ps-5 p-2 h-full focus:outline-none border-black text-black border-2 border-opacity-50 text-md rounded-full"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 font-dmsans h-12">
            <div className="flex items-center justify-center h-full w-14 rounded-full bg-black text-white">
              <IoFingerPrint size={24} />
            </div>
            <div className="relative w-full">
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="w-full ps-5 p-2 focus:outline-none border-black h-12 text-black border-2 border-opacity-50 text-md rounded-full"
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute right-5 top-1/2 transform -translate-y-1/2 transition-all duration-150 text-black"
              >
                {passwordVisible ? (
                  <LuEyeClosed size={20} />
                ) : (
                  <LuEye size={20} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <p className="text-red-600 text-sm text-center">{errorMessage}</p>
        )}

        {/* Submit Button with Loading Spinner */}
        <button
          type="submit"
          className="font-ubuntu rounded-full uppercase font-semibold bg-white mt-3 w-[30%] py-2 text-black hover:bg-black hover:text-white transition-colors duration-150 flex justify-center items-center"
        >
          Log in
        </button>
      </form>

      {/* Signup Section */}
      <div className="">
        <p className="text-black">Don&apos;t have an account?</p>
        <button
          onClick={handleSignin}
          className="mt-2 bg-[#ada5cc] hover:bg-[#6b6680] uppercase font-ubuntu text-white py-2 w-full rounded-md transition"
        >
          Sign Up
        </button>
      </div>
    </section>
  );
}

export default Login;
