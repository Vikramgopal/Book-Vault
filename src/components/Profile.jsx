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
import { useAuth } from "../context/UseAuthentication";
import { IoMdTransgender } from "react-icons/io";
import { MdArrowBack } from "react-icons/md";
import { useFirestore } from "../hooks/useFirestore";
import { LuEyeClosed, LuEye } from "react-icons/lu";

function Profile({ membersList, setMembersList }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate(); // Initialize navigation
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  // Password criteria validation state
  const currentUser =
    membersList.find((member) => member.id === user?.uid) || {};

  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    number: false,
    symbol: false,
  });
  const [formData, setFormData] = useState({ ...currentUser });
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState(currentUser.profileImage);
  const [errors, setErrors] = useState({});

  const [isUploading, setIsUploading] = useState(false);
  const { updateDocument, changeUserPassword } = useFirestore("users");
  /////////////////////////////////
  const uploadImageToImgBB = async (imageFile) => {
    const apiKey = import.meta.env.VITE_IMGBB_API_KEY;

    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.success) {
        return data.data.url; // Direct image URL
      } else {
        throw new Error("Image upload failed");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };
  ////////////////////////////////////////////
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // handle cancel edit
  const handleCancelClick = () => {
    setIsEditing(false);
    setFormData({ ...currentUser }); // Reset to original values
  };

  // Validate password criteria dynamically
  useEffect(() => {
    const password = formData?.password || ""; // Default to empty string
    setPasswordCriteria({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      symbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  }, [formData.password]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true); // Start loading
      const uploadedImageUrl = await uploadImageToImgBB(file);
      setIsUploading(false); // Stop loading

      if (uploadedImageUrl) {
        const updatedImageUrl = `${uploadedImageUrl}?t=${Date.now()}`; // Prevent caching
        setFormData((prev) => ({
          ...prev,
          profileImage: updatedImageUrl,
        }));
        setImagePreview(URL.createObjectURL(file)); // Show instant preview
      }
    }
  };

  const handleEdit = () => setIsEditing(true);
  const handleLogOut = () => {
    logout();
    navigate("/");
  };
  const handleBack = (e) => {
    e.preventDefault();
    navigate("/app");
  };
  const handleSaveClick = async (e) => {
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
    setErrors(newErrors);

    setErrors(newErrors);

    // Only proceed if there are no errors
    if (Object.keys(newErrors).length === 0) {
      if (formData.profileImage instanceof File) {
        setIsUploading(true);
        const uploadedImageUrl = await uploadImageToImgBB(
          formData.profileImage
        );
        setIsUploading(false);

        if (uploadedImageUrl) {
          formData.profileImage = `${uploadedImageUrl}?t=${Date.now()}`;
        }
      }
      await updateDocument(user?.uid, formData); // Update Firebase

      const updatedMember = membersList.map((member) =>
        member.id === user?.uid ? { ...member, ...formData } : member
      );
      setMembersList(updatedMember);
      if (currentUser?.password && currentUser.password !== formData.password) {
        changeUserPassword(formData.password);
      }
      setIsEditing(false);
    }
  };

  return (
    <section className="flex flex-col pt-[3rem]  w-full max-sm:px-[1rem] px-[4rem] items-center">
      <form
        // onSubmit={handleSubmit}
        className="bg-[#ada5cc] bg-opacity-90 mb-5 relative  max-sm:pt-20 p-8 rounded-2xl w-full"
      >
        <button
          // type="submit"
          onClick={handleBack}
          className="absolute uppercase text-white top-4 left-4 bg-black px-4 py-2 font-ubuntu  rounded-full hover:bg-white hover:text-black transition"
        >
          <span className="flex  items-center justify-center gap-2">
            <MdArrowBack size={22} /> Back
          </span>
        </button>
        {isEditing ? (
          <div className="">
            <button
              onClick={handleSaveClick}
              disabled={isUploading}
              className={`absolute uppercase font-ubuntu text-white max-sm:top-4 md:top-4 top-20 max-sm:right-32 md:right-32 right-4 px-4 py-2 rounded-full transition ${
                isUploading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black hover:bg-white hover:text-black"
              }`}
            >
              Update
            </button>

            <button
              onClick={handleCancelClick}
              disabled={isUploading}
              className="absolute top-4 right-4 font-ubuntu uppercase bg-white px-4 py-2   rounded-full hover:bg-black hover:text-white transition"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={handleEdit}
            disabled={isUploading}
            className="absolute top-4 font-ubuntu uppercase right-4 bg-white px-4 py-2   rounded-full hover:bg-black hover:text-white transition"
          >
            Edit
          </button>
        )}
        <h1 className="col-span-2 font-poppins uppercase font-semibold text-2xl text-black text-center">
          Welcome, {formData.fullName}
        </h1>

        {/* Profile Image & Preview */}
        {!isEditing && (
          <div className="flex flex-col sm:flex-row items-center justify-center py-5 gap-4">
            <img
              src={
                currentUser.profileImage
                  ? currentUser.profileImage
                  : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' class='h-6 w-6'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 14c4 0 6-3 6-6s-2-6-6-6-6 3-6 6 2 6 6 6zM12 14c-4 0-6 2-6 6v1h12v-1c0-4-2-6-6-6z'%3E%3C/path%3E%3C/svg%3E"
              }
              alt="Preview"
              className={
                !currentUser.profileImage
                  ? "w-24 h-24 mt-2 rounded-full border-2 bg-black p-5 border-opacity-50 border-black"
                  : "w-24 h-24 mt-2 rounded-full border-2 border-opacity-50 border-black"
              }
            />
          </div>
        )}
        {/* //////////////////////////// */}
        {isEditing && (
          <div className="flex flex-col sm:flex-row items-center justify-center py-5 gap-4">
            {isUploading && (
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-70 z-20 rounded-2xl ">
                <span className="text-white text-lg animate-pulse">
                  Uploading...
                </span>
              </div>
            )}
            <img
              src={
                imagePreview ||
                currentUser.profileImage ||
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' class='h-6 w-6'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 14c4 0 6-3 6-6s-2-6-6-6-6 3-6 6 2 6 6 6zM12 14c-4 0-6 2-6 6v1h12v-1c0-4-2-6-6-6z'%3E%3C/path%3E%3C/svg%3E"
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
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-dmsans rounded-2xl">
          <div>
            {/* Full Name */}
            <FieldWithIcon
              icon={<IoPerson size={24} />}
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              error={errors.fullName}
              onChange={handleChange}
              disabled={true}
            />
          </div>
          <div>
            {/* Email */}
            <FieldWithIcon
              icon={<IoMail size={24} />}
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              error={errors.email}
              onChange={handleChange}
              disabled={true}
            />
          </div>
          <div>
            {/* Phone Number */}
            <FieldWithIcon
              icon={<IoCall size={24} />}
              type="tel"
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              error={errors.phoneNumber}
              onChange={handleChange}
              disabled={true}
            />
          </div>
          <div>
            {/* Gender */}
            <FieldWithIcon
              icon={<IoMdTransgender size={24} />}
              type="select"
              name="gender"
              placeholder="Select Gender"
              value={formData.gender} // Ensure a default value
              error={errors.gender}
              onChange={handleChange}
              options={["Male", "Female", "Other"]}
              disabled={isEditing ? false : true}
            />
          </div>
          <div>
            {/* DOB */}
            <FieldWithIcon
              icon={<IoCalendar size={24} />}
              type="date"
              name="dob"
              value={formData.dob}
              error={errors.dob}
              onChange={handleChange}
              disabled={isEditing ? false : true}
            />
          </div>
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
              disabled={isEditing ? false : true}
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
          {/* Confirm Password */}
          <div className="relative w-full">
            {isEditing && (
              <>
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
                  onClick={() =>
                    setConfirmPasswordVisible(!confirmPasswordVisible)
                  }
                  className="absolute   right-5 top-1/2 transform -translate-y-1/2 transition-all duration-150 text-black"
                >
                  {confirmPasswordVisible ? (
                    <LuEyeClosed size={20} />
                  ) : (
                    <LuEye size={20} />
                  )}
                </button>
              </>
            )}
          </div>
          {/* password checking */}
          {isEditing && (
            <div className=" flex flex-col ps-16 ">
              <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-2  ">
                <div className="flex justify-start items-center">
                  <span
                    className={` ${
                      passwordCriteria.length
                        ? "text-green-500"
                        : "text-red-500"
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
                      passwordCriteria.number
                        ? "text-green-500"
                        : "text-red-500"
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
                      passwordCriteria.symbol
                        ? "text-green-500"
                        : "text-red-500"
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
          )}
        </div>
        {/* Submit Button */}
        <div className="text-center pt-5 col-span-2">
          {!isEditing && (
            <button
              // type="submit"
              onClick={handleLogOut}
              className=" w-[10rem] rounded-full uppercase font-ubuntu  font-semibold bg-white py-3 text-black hover:bg-black hover:text-white transition"
            >
              Log Out
            </button>
          )}
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
  disabled,
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
            className={`disabled:bg-[#d2cde7]  w-full p-2 h-12 focus:outline-none border-2 ${
              error ? "border-red-500 text-red-500" : "border-black text-black"
            } border-opacity-75 text-md rounded-full`}
            disabled={disabled}
          >
            <option value="">Select Gender</option>{" "}
            {/* Ensure this isn't always selected */}
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
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
            } border-opacity-75 text-md rounded-full placeholder:opacity-75 ${
              error ? "placeholder-red-500" : ""
            }`}
          />
        )}
      </div>
    </div>
  );
}

export default Profile;
