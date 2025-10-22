import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
	FaEye,
	FaEyeSlash,
	FaEnvelope,
	FaLock,
	FaUserPlus,
	FaBuilding,
} from "react-icons/fa";
import { useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";
import type { UserRole, Department } from "../types/schema";
import { supabase } from "../lib/supabaseClient";
import WideButton from "../components/WideButton";

const GET_DEPARTMENTS = gql`
	query GetDepartments {
		departments(order_by: { name: asc }) {
			id
			name
			description
		}
	}
`;

const Register: React.FC = () => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		confirmPassword: "",
		role: "citizen" as UserRole,
		departmentId: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState<{ [key: string]: string }>({});

	const { data: departmentsData, loading: departmentsLoading } = useQuery<{
		departments: Department[];
	}>(GET_DEPARTMENTS);

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		if (errors[name]) {
			setErrors((prev) => ({
				...prev,
				[name]: "",
			}));
		}
	};

	const validateForm = () => {
		const newErrors: { [key: string]: string } = {};

		if (!formData.email) {
			newErrors.email = "Email is required";
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = "Please enter a valid email address";
		}

		if (!formData.password) {
			newErrors.password = "Password is required";
		} else if (formData.password.length < 6) {
			newErrors.password = "Password must be at least 6 characters long";
		}

		if (!formData.confirmPassword) {
			newErrors.confirmPassword = "Please confirm your password";
		} else if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = "Passwords do not match";
		}

		if (formData.role === "department" && !formData.departmentId) {
			newErrors.departmentId = "Please select a department";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		setIsLoading(true);

		try {
			const { error } = await supabase.auth.signUp({
				email: formData.email,
				password: formData.password,
				options: {
					data: {
						role: formData.role,
						department_id: formData.role === "department" ? formData.departmentId : null
					}
				}
			});

			if (error) {
				let errorMessage = "Registration failed. Please try again.";
				
				if (error.message.toLowerCase().includes("already registered")) {
					errorMessage = "This email is already registered. Please sign in instead.";
				} else if (error.message.toLowerCase().includes("invalid email")) {
					errorMessage = "Please enter a valid email address.";
				} else if (error.message.toLowerCase().includes("password")) {
					errorMessage = "Password does not meet requirements. Please use a stronger password.";
				} else if (error.message) {
					errorMessage = error.message;
				}
				
				throw new Error(errorMessage);
			}

			window.location.href = "/login";
		} catch (error) {
			console.error("Registration error:", error);
			const errorMessage = error instanceof Error ? error.message : "Registration failed. Please try again.";
			setErrors({ general: errorMessage });
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full mx-auto space-y-8">
				<div className="text-center">
					<div className="mx-auto h-12 w-12 bg-indigo-600 rounded-full flex items-center justify-center">
						<FaUserPlus className="h-6 w-6 text-white" />
					</div>
					<h2 className="mt-6 text-3xl font-bold text-gray-900">
						Join UrbanSync
					</h2>
					<p className="mt-2 text-sm text-gray-600">
						Create an account to report and track civic issues in
						your community
					</p>
				</div>

				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					<div className="bg-white rounded-lg shadow-md p-6 space-y-4">
						{errors.general && (
							<div 
								data-testid="error-message"
								className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm"
							>
								{errors.general}
							</div>
						)}

						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Email Address
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<FaEnvelope className="h-4 w-4 text-gray-400" />
								</div>
								<input
									id="email"
									name="email"
									type="email"
									autoComplete="email"
									data-testid="email-input"
									value={formData.email}
									onChange={handleInputChange}
									className={`block w-full pl-10 pr-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 ${
										errors.email
											? "border-red-300 bg-red-50"
											: "border-gray-300 bg-white hover:border-gray-400"
									}`}
									placeholder="Enter your email"
								/>
							</div>
							{errors.email && (
								<p className="mt-1 text-sm text-red-600">
									{errors.email}
								</p>
							)}
						</div>

						<div>
							<label
								htmlFor="role"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Account Type
							</label>
							<select
								id="role"
								name="role"
								data-testid="role-select"
								value={formData.role}
								onChange={handleInputChange}
								className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:ring-2 focus:ring-indigo-500 transition duration-200"
							>
								<option value="citizen">
									Citizen - Report and view issues
								</option>
								<option value="department">
									Department Employee - Manage and resolve issues
								</option>
							</select>
						</div>

						{formData.role === "department" && (
							<div>
								<label
									htmlFor="departmentId"
									className="block text-sm font-medium text-gray-700 mb-1"
								>
									Department
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<FaBuilding className="h-4 w-4 text-gray-400" />
									</div>
									<select
										id="departmentId"
										name="departmentId"
										data-testid="department-select"
										value={formData.departmentId}
										onChange={handleInputChange}
										disabled={departmentsLoading}
										className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 ${
											errors.departmentId
												? "border-red-300 bg-red-50"
												: "border-gray-300 bg-white hover:border-gray-400"
										} ${departmentsLoading ? "opacity-50 cursor-not-allowed" : ""}`}
									>
										<option value="">
											{departmentsLoading ? "Loading departments..." : "Select a department"}
										</option>
										{departmentsData?.departments.map((dept) => (
											<option key={dept.id} value={dept.id}>
												{dept.name}
											</option>
										))}
									</select>
								</div>
								{errors.departmentId && (
									<p className="mt-1 text-sm text-red-600">
										{errors.departmentId}
									</p>
								)}
							</div>
						)}

						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Password
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<FaLock className="h-4 w-4 text-gray-400" />
								</div>
								<input
									id="password"
									name="password"
									type={showPassword ? "text" : "password"}
									autoComplete="new-password"
									data-testid="password-input"
									value={formData.password}
									onChange={handleInputChange}
									className={`block w-full pl-10 pr-10 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 ${
										errors.password
											? "border-red-300 bg-red-50"
											: "border-gray-300 bg-white hover:border-gray-400"
									}`}
									placeholder="Create a password (min. 6 characters)"
								/>
								<button
									type="button"
									className="absolute inset-y-0 right-0 pr-3 flex items-center"
									onClick={() =>
										setShowPassword(!showPassword)
									}
								>
									{showPassword ? (
										<FaEyeSlash className="h-4 w-4 text-gray-400 hover:text-gray-600" />
									) : (
										<FaEye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
									)}
								</button>
							</div>
							{errors.password && (
								<p className="mt-1 text-sm text-red-600">
									{errors.password}
								</p>
							)}
						</div>

						<div>
							<label
								htmlFor="confirmPassword"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Confirm Password
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<FaLock className="h-4 w-4 text-gray-400" />
								</div>
								<input
									id="confirmPassword"
									name="confirmPassword"
									type={
										showConfirmPassword
											? "text"
											: "password"
									}
									autoComplete="new-password"
									data-testid="confirm-password-input"
									value={formData.confirmPassword}
									onChange={handleInputChange}
									className={`block w-full pl-10 pr-10 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 ${
										errors.confirmPassword
											? "border-red-300 bg-red-50"
											: "border-gray-300 bg-white hover:border-gray-400"
									}`}
									placeholder="Confirm your password"
								/>
								<button
									type="button"
									className="absolute inset-y-0 right-0 pr-3 flex items-center"
									onClick={() =>
										setShowConfirmPassword(
											!showConfirmPassword
										)
									}
								>
									{showConfirmPassword ? (
										<FaEyeSlash className="h-4 w-4 text-gray-400 hover:text-gray-600" />
									) : (
										<FaEye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
									)}
								</button>
							</div>
							{errors.confirmPassword && (
								<p className="mt-1 text-sm text-red-600">
									{errors.confirmPassword}
								</p>
							)}
						</div>

						<div data-testid="submit-button">
							<WideButton text={'Create Account'} isLoading={isLoading} isSubmit={true} loadingText={'Creating account...'} />
						</div>
					</div>

					<div className="text-center">
						<p className="text-sm text-gray-600">
							Already have an account?{" "}
							<Link
								to="/login"
								className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-200"
							>
								Sign in here
							</Link>
						</p>
					</div>

					<div className="text-center">
						<Link
							to="/"
							className="text-sm text-gray-500 hover:text-gray-700 transition duration-200"
						>
							← Back to map
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Register;
