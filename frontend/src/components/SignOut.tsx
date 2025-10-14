import React from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { useAppDispatch } from "../store/hooks";
import { clearUser } from "../store/userSlice";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

const SignOut: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleSignOut = async () => {
		try {
			const { error } = await supabase.auth.signOut();
			if (error) {
				console.error("Error signing out:", error.message);
				return;
			}
			dispatch(clearUser());
			navigate("/");
		} catch (err) {
			console.error("Unexpected error during sign out:", err);
		}
	};

	return (
		<button
			onClick={handleSignOut}
			className="flex items-center space-x-2 hover:bg-red-100 text-red-600 font-medium py-2 px-4 rounded-md transition-colors duration-200 cursor-pointer"
		>
			<FaSignOutAlt />
			<span className="hidden sm:inline">Sign Out</span>
		</button>
	);
};

export default SignOut;
