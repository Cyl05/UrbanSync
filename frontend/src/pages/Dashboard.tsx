import React from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useAppDispatch } from "../store/hooks";
import { clearUser } from "../store/userSlice";
import { useAuth } from "../hooks/useAuth";

const Dashboard: React.FC = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { user } = useAuth();

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

	if (!user) {
		return <div>No user data available</div>;
	}

	return (
		<div style={{ padding: "20px" }}>
			<h1>Dashboard</h1>
			<div style={{ marginTop: "20px" }}>
				<p><b>ID:</b> {user.id}</p>
				<p><b>Name:</b> {user.name}</p>
				<p><b>Email:</b> {user.email}</p>
				<p><b>Role:</b> {user.role}</p>
				<p><b>Created At:</b> {new Date(user.created_at).toLocaleString()}</p>
			</div>
			<button onClick={handleSignOut} className="bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-800 transition-colors duration-200 cursor-pointer mt-5">
				Sign Out
			</button>
		</div>
	);
};

export default Dashboard;
