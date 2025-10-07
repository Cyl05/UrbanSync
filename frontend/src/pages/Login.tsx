import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
	FaEye,
	FaEyeSlash,
	FaEnvelope,
	FaLock,
	FaSignInAlt,
} from "react-icons/fa";

const Login: React.FC = () => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState<{ [key: string]: string }>({});

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
			console.log("Login attempt:", formData);

			await new Promise((resolve) => setTimeout(resolve, 1000));

			window.location.href = "/dashboard";
		} catch (error) {
			console.error("Login error:", error);
			setErrors({
				general: "Invalid email or password. Please try again.",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<div className="text-center">
					<div className="mx-auto h-12 w-12 bg-indigo-600 rounded-full flex items-center justify-center">
						<FaSignInAlt className="h-6 w-6 text-white" />
					</div>
					<h2 className="mt-6 text-3xl font-bold text-gray-900">
						Sign in to UrbanSync
					</h2>
					<p className="mt-2 text-sm text-gray-600">
						Access the official dashboard to manage civic issues
					</p>
				</div>

				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					<div className="bg-white rounded-lg shadow-md p-6 space-y-4">
						{errors.general && (
							<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
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
									autoComplete="current-password"
									value={formData.password}
									onChange={handleInputChange}
									className={`block w-full pl-10 pr-10 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 ${
										errors.password
											? "border-red-300 bg-red-50"
											: "border-gray-300 bg-white hover:border-gray-400"
									}`}
									placeholder="Enter your password"
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

						<div className="flex items-center justify-between">
							<div className="flex items-center">
								<input
									id="remember-me"
									name="remember-me"
									type="checkbox"
									className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
								/>
								<label
									htmlFor="remember-me"
									className="ml-2 block text-sm text-gray-700"
								>
									Remember me
								</label>
							</div>
							<div className="text-sm">
								<a
									href="#"
									className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-200"
								>
									Forgot your password?
								</a>
							</div>
						</div>

						<button
							type="submit"
							disabled={isLoading}
							className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
						>
							{isLoading ? (
								<div className="flex items-center">
									<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
									Signing in...
								</div>
							) : (
								"Sign in"
							)}
						</button>
					</div>

					<div className="text-center">
						<p className="text-sm text-gray-600">
							Don't have an account?{" "}
							<Link
								to="/register"
								className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-200"
							>
								Register here
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

export default Login;
