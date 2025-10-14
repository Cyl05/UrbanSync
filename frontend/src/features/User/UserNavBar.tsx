import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import SignOut from "../../components/SignOut";

const UserNavBar: React.FC = () => {
	const navigate = useNavigate();
	return (
		<div className="bg-white shadow-sm border-b border-gray-200">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
				<div className="flex items-center justify-between">
					<button
						onClick={() => navigate("/")}
						className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors cursor-pointer"
					>
						<FaArrowLeft />
						<span>Back to Map</span>
					</button>
					<h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
					<SignOut />
				</div>
			</div>
		</div>
	);
};

export default UserNavBar;
