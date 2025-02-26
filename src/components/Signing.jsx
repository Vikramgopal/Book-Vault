/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import {
  IoPerson,
  IoCheckmarkCircle,
  IoLockClosed,
  IoMail,
  IoCalendar,
  IoCall,
} from "react-icons/io5";
import { FaCircle } from "react-icons/fa";

import { IoMdTransgender } from "react-icons/io";
import { useSignup } from "../hooks/useSignup";
import { MdArrowBack } from "react-icons/md";

import { LuEyeClosed, LuEye } from "react-icons/lu";

function Signing({ members, setMembers }) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate(); // Initialize navigation
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    number: false,
    symbol: false,
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    dob: "",
    gender: "",
    profileImage: null,
    savedBooks: [],
    readingBooks: [],
    CompletedBooks: [],
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const { signup } = useSignup();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };
  // Validate password criteria dynamically
  useEffect(() => {
    const { password } = formData;
    setPasswordCriteria({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      symbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  }, [formData.password]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profileImage: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};
    const phoneRegex = /^[0-9]{10}$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // Validate form fields
    if (!formData.fullName) newErrors.fullName = "Full Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.phoneNumber)
      newErrors.phoneNumber = "Phone number is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!formData.dob) newErrors.dob = "Date of Birth is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be exactly 10 digits.";
    }
    if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must be at least 8 characters, with an uppercase, lowercase, number, and special character.";
    }
    // Check for existing email or phone number
    const isDuplicate = members.some(
      (member) =>
        member.email === formData.email ||
        member.phoneNumber === formData.phoneNumber
    );

    if (isDuplicate) {
      newErrors.email = "Email or Phone number already exists";
      alert("Email or Phone number already exists");
    }

    setErrors(newErrors);

    // If no errors, push data and navigate
    if (Object.keys(newErrors).length === 0) {
      // navigate("/"); // Navigate to home after showing modal

      setLoading(true); // Set loading to true
      try {
        await signup({
          gender: formData.gender,
          email: formData.email,
          dob: formData.dob,
          phoneNumber: formData.phoneNumber,
          profileImage: formData.profileImage,
          uid: "1",
          fullName: formData.fullName,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          savedBooks: formData.savedBooks,
          readingBooks: formData.readingBooks,
          completedBooks: formData.CompletedBooks,
        });
        setMembers([...members, formData]); // Add new member
        // navigate("/"); // Redirect to home
        setShowModal(true); // Show success modal

        setTimeout(() => {
          setShowModal(false);
          navigate("/"); // Navigate to home after showing modal
        }, 2000); // Delay of 2 seconds
      } catch (error) {
        console.error("Signup error:", error);
        alert("Signup failed. Please try again.");
      } finally {
        setLoading(false); // Reset loading state
      }
    }
  };
  return (
    <section className="flex flex-col pt-[6rem] w-full px-[4rem]  max-sm:px-[1rem] items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-[#ada5cc] bg-opacity-90 mb-5  relative p-8 rounded-2xl w-full"
      >
        <button
          onClick={() => navigate("/")}
          className="absolute uppercase text-white  bg-black px-4 py-2 font-ubuntu  rounded-full hover:bg-white hover:text-black transition"
        >
          <span className="flex  items-center justify-center gap-2">
            <MdArrowBack size={22} /> Back
          </span>
        </button>
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-30 bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold">
                Account Created Successfully!
              </h2>
              <p className="text-gray-600">Redirecting to home...</p>
            </div>
          </div>
        )}
        {loading && (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-70 z-20 rounded-2xl ">
            <p className="text-white">Creating your account, please wait...</p>
            <span className="loader text-white"></span>{" "}
            {/* Add a spinner if needed */}
          </div>
        )}
        <h1 className="col-span-2 font-poppins max-sm:mt-12 uppercase font-semibold text-2xl text-black text-center">
          User Signup
        </h1>

        {/* Profile Image & Preview */}
        <div className="flex flex-col sm:flex-row items-center justify-center py-5 gap-4">
          <img
            src={
              imagePreview
                ? imagePreview
                : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' class='h-6 w-6'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 14c4 0 6-3 6-6s-2-6-6-6-6 3-6 6 2 6 6 6zM12 14c-4 0-6 2-6 6v1h12v-1c0-4-2-6-6-6z'%3E%3C/path%3E%3C/svg%3E"
            }
            alt="Preview"
            className={
              !imagePreview
                ? "w-24 h-24 mt-2 rounded-full border-2 bg-black p-5 border-opacity-50 border-black"
                : "w-24 h-24 mt-2 rounded-full border-2 border-opacity-50 border-black"
            }
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className=" p-2 text-md   rounded-full"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-dmsans rounded-2xl">
          {/* Full Name */}
          <FieldWithIcon
            icon={<IoPerson size={24} />}
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            error={errors.fullName}
            onChange={handleChange}
          />

          {/* Gender */}
          <FieldWithIcon
            icon={<IoMdTransgender size={24} />}
            type="select"
            name="gender"
            placeholder="Select Gender"
            value={formData.gender}
            error={errors.gender}
            onChange={handleChange}
            options={["Male", "Female", "Other"]}
          />

          {/* Email */}
          <FieldWithIcon
            icon={<IoMail size={24} />}
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            error={errors.email}
            onChange={handleChange}
          />
          {/* Password */}
          <div className="relative w-full">
            <FieldWithIcon
              icon={<IoLockClosed size={24} />}
              type={passwordVisible ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              error={errors.password}
              onChange={handleChange}
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
          {/* Phone Number */}
          <FieldWithIcon
            icon={<IoCall size={24} />}
            type="tel"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            error={errors.phoneNumber}
            onChange={handleChange}
          />

          {/* Confirm Password */}
          <div className="relative w-full">
            <FieldWithIcon
              icon={<IoCheckmarkCircle size={24} />}
              type={confirmPasswordVisible ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              error={errors.confirmPassword}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
              className="absolute right-5 top-1/2 transform -translate-y-1/2 transition-all duration-150 text-black"
            >
              {confirmPasswordVisible ? (
                <LuEyeClosed size={20} />
              ) : (
                <LuEye size={20} />
              )}
            </button>
          </div>

          {/* DOB */}
          <FieldWithIcon
            icon={<IoCalendar size={24} />}
            type="date"
            name="dob"
            value={formData.dob}
            error={errors.dob}
            onChange={handleChange}
          />

          {/* password checking */}
          <div className=" flex flex-col ps-16 max-sm:ps-10 ">
            <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-2  ">
              <div className="flex justify-start items-center">
                <span
                  className={` ${
                    passwordCriteria.length ? "text-green-500" : "text-red-500"
                  }`}
                >
                  <FaCircle size={12} />
                </span>
                <p className="xl:text-md lg:text-sm max-md:text-md   pl-3 font-semibold ">
                  Atleast 8 characters
                </p>
              </div>

              <div className="flex justify-start items-center">
                <span
                  className={` ${
                    passwordCriteria.uppercase
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  <FaCircle size={12} />
                </span>
                <p className="xl:text-md lg:text-sm max-md:text-md  pl-3 font-semibold ">
                  Atleast 1 uppercase letter
                </p>
              </div>

              <div className="flex justify-start items-center">
                <span
                  className={` ${
                    passwordCriteria.number ? "text-green-500" : "text-red-500"
                  }`}
                >
                  <FaCircle size={12} />
                </span>
                <p className="xl:text-md lg:text-sm max-md:text-md  pl-3 font-semibold ">
                  Atleast 1 number
                </p>
              </div>

              <div className="flex justify-start items-center">
                <span
                  className={` ${
                    passwordCriteria.symbol ? "text-green-500" : "text-red-500"
                  }`}
                >
                  <FaCircle size={12} />
                </span>
                <p className="xl:text-md lg:text-sm max-md:text-md   pl-3 font-semibold ">
                  Atleast 1 symbol
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Submit Button */}
        <div className="text-center pt-5 col-span-2">
          <button
            type="submit"
            className="font-ubuntu w-[10rem] rounded-full uppercase  font-semibold bg-white py-3 text-black hover:bg-black hover:text-white transition"
          >
            Sign Up
          </button>
        </div>
      </form>
    </section>
  );
}

// Reusable Input Field Component
function FieldWithIcon({
  icon,
  type,
  name,
  placeholder,
  value,
  error,
  onChange,
  options,
}) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 h-12">
        <div className="flex items-center justify-center h-full w-14 rounded-full bg-black text-white">
          {icon}
        </div>
        {type === "select" ? (
          <select
            name={name}
            value={value}
            onChange={onChange}
            className={`w-full p-2 h-12 focus:outline-none border-2 ${
              error ? "border-red-500 text-red-500" : "border-black text-black"
            } border-opacity-50 text-md rounded-full`}
          >
            <option value="">{error || placeholder}</option>
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            onPaste={(e) => {
              e.preventDefault();
              alert(
                "Copy-paste is disabled for security reasons. Please type manually."
              );
            }}
            onCopy={(e) => e.preventDefault()} // Prevent copying
            onCut={(e) => e.preventDefault()} // Prevent cutting
            placeholder={value ? placeholder : error || placeholder}
            className={`w-full ps-5 p-2 h-full focus:outline-none border-2 ${
              error ? "border-red-500 text-red-500" : "border-black text-black"
            } border-opacity-50 text-md rounded-full placeholder:opacity-75 ${
              error ? "placeholder-red-500" : ""
            }`}
          />
        )}
      </div>
    </div>
  );
}

export default Signing;
