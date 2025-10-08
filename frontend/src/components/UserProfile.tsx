import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchUser } from "../store/userSlice";
import { supabase } from "../lib/supabaseClient";

const UserProfile: React.FC = () => {
	const dispatch = useAppDispatch();
    const { currentUser, loading, error } = useAppSelector(
		(state) => state.user
	);

    useEffect(() => {
        const getUserAndFetch = async () => {
            const session = await supabase.auth.getSession();
            const userId = session.data?.session?.user.id;
            
            if (userId) {
                dispatch(fetchUser(userId));
            }
        };

        getUserAndFetch();
    }, [dispatch]);

	if (loading) {
		return <div>Loading user...</div>;
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

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
