import React from "react";
import { useAuth } from "../hooks/useAuth";

const UserProfile: React.FC = () => {
    const { user: currentUser } = useAuth();

	if (!currentUser) {
		return <div>No user logged in</div>;
	}

	return (
		<div className="p-4 bg-white rounded-lg shadow">
			<h3 className="text-lg font-semibold mb-2">User Profile</h3>
			<div className="space-y-1">
				<p>
					<strong>Name:</strong> {currentUser.name}
				</p>
				<p>
					<strong>Email:</strong> {currentUser.email}
				</p>
				<p>
					<strong>Role:</strong> {currentUser.role}
				</p>
				<p>
					<strong>ID:</strong> {currentUser.id}
				</p>
			</div>
		</div>
	);
};

export default UserProfile;
