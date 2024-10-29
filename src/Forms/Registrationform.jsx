import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png"; 
const RegistrationForm = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        aadharNumber: "",
        phoneNumber: "",
        gender: "",
        beneficiary: "",
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.firstName) newErrors.firstName = "First name is required";
        if (!formData.lastName) newErrors.lastName = "Last name is required";
        if (!formData.email) newErrors.email = "Email is required";
        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters long";
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }
        if (!formData.aadharNumber) newErrors.aadharNumber = "Aadhaar number is required";
        if (!formData.phoneNumber) newErrors.phoneNumber = "Phone number is required";
        if (!formData.gender) newErrors.gender = "Gender is required";
        if (!formData.beneficiary) newErrors.beneficiary = "Beneficiary status is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const postData = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            setLoading(true);
            try {
                const response = await axios.post("http://localhost:3523/signup", {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    password: formData.password,
                    aadharNumber: formData.aadharNumber,
                    phoneNumber: formData.phoneNumber,
                    gender: formData.gender,
                    beneficiary: formData.beneficiary,
                });
                if (response.status === 201) {
                    localStorage.setItem("token", response.data.token);
                    toast.success("Signin successful!");
                    setTimeout(() => {
                        navigate("/");
                    }, 1000);
                } else {
                    toast.error(response?.data?.msg || "Details Not Match");
                }
            } catch (error) {
                toast.error(error.response?.data?.msg || "Login failed");
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className=" p-6 rounded-lg w-full max-w-4xl">
                <img
              src={logo}
              alt="Logo"
              className="mx-auto md:mb-[-60px] ms-6 block" // Hides logo below md
            />
            <h2 className="text-xl font-semibold text-center mb-4">Registration Form</h2>
            <form onSubmit={postData}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold mb-1">First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            placeholder="First name"
                            className="w-full p-2 border rounded-md shadow-md"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                        {errors.firstName && (
                            <p className="text-red-500 text-sm">{errors.firstName}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1">Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Last name"
                            className="w-full p-2 border rounded-md shadow-md"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                        {errors.lastName && (
                            <p className="text-red-500 text-sm">{errors.lastName}</p>
                        )}
                    </div>
                </div>
                <div className="mt-4">
                    <label className="block text-sm font-semibold mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="email@example.com"
                        className="w-full p-2 border rounded-md shadow-md"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm">{errors.email}</p>
                    )}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            className="w-full p-2 border rounded-md shadow-md"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm">{errors.password}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm password"
                            className="w-full p-2 border rounded-md shadow-md"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                        )}
                    </div>
                </div>
                <div className="mt-4">
                    <label className="block text-sm font-semibold mb-1">Aadhaar Number</label>
                    <input
                        type="text"
                        name="aadharNumber"
                        placeholder="012345678912"
                        className="w-full p-2 border rounded-md shadow-md"
                        value={formData.aadharNumber}
                        onChange={handleChange}
                        required
                    />
                    {errors.aadharNumber && (
                        <p className="text-red-500 text-sm">{errors.aadharNumber}</p>
                    )}
                </div>
                <div className="mt-4">
                    <label className="block text-sm font-semibold mb-1">Phone Number</label>
                    <input
                        type="text"
                        name="phoneNumber"
                        placeholder="9876543210"
                        className="w-full p-2 border rounded-md shadow-md"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        required
                    />
                    {errors.phoneNumber && (
                        <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
                    )}
                </div>
                <div className="mt-4">
                    <label className="block text-sm font-semibold mb-1">Gender</label>
                    <div className="flex space-x-4">
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name="gender"
                                value="Male"
                                onChange={handleChange}
                                required
                            />
                            <span className="ml-2">Male</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name="gender"
                                value="Female"
                                onChange={handleChange}
                                required
                            />
                            <span className="ml-2">Female</span>
                        </label>
                    </div>
                    {errors.gender && (
                        <p className="text-red-500 text-sm">{errors.gender}</p>
                    )}
                </div>
                <div className="mt-4">
                    <label className="block text-sm font-semibold mb-1">Beneficiary</label>
                    <div className="flex space-x-4">
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name="beneficiary"
                                value="Yes"
                                onChange={handleChange}
                                required
                            />
                            <span className="ml-2">Yes</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name="beneficiary"
                                value="No"
                                onChange={handleChange}
                                required
                            />
                            <span className="ml-2">No</span>
                        </label>
                    </div>
                    {errors.beneficiary && (
                        <p className="text-red-500 text-sm">{errors.beneficiary}</p>
                    )}
                </div>
                <button
                    type="submit"
                    className="w-full mt-6 py-2 bg-[#385723]  shadow-md text-white rounded-md hover:bg-[#263b18] transition"
                >
                    Register
                </button>
            </form>
        </div>
    );
};

export default RegistrationForm;
