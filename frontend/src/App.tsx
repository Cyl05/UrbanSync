// import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserProfile from "./pages/UserProfile";
import OfficialDashboard from "./pages/OfficialDashboard";
import IssueDetail from "./pages/IssueDetail";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/login" element={<Login />} />
			<Route path="/register" element={<Register />} />
			<Route path="/issue/:id" element={<IssueDetail />} />
			<Route
				path="/profile"
				element={
					<ProtectedRoute>
						<UserProfile />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/department/dashboard"
				element={
					<ProtectedRoute role={'department'}>
						<OfficialDashboard />
					</ProtectedRoute>
				}
			/>
		</Routes>
	);
}

export default App;
