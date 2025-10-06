import fetch from 'node-fetch';
import { HASURA_ENDPOINT, ADMIN_SECRET } from '../config/config.js';

async function graphqlRequest(query, variables = {}, role = 'admin', userId = null) {
	const headers = {
		'Content-Type': 'application/json',
	};

	if (role === 'admin') {
		// Admin request - use admin secret only
		headers['x-hasura-admin-secret'] = ADMIN_SECRET;
	} else {
		// Role-based request - MUST include admin secret + role headers for testing
		// This allows us to test permissions by simulating different users
		headers['x-hasura-admin-secret'] = ADMIN_SECRET;
		headers['x-hasura-role'] = role;

		if (userId) {
			headers['x-hasura-user-id'] = userId;
		}
	}

	try {
		const response = await fetch(HASURA_ENDPOINT, {
			method: 'POST',
			headers,
			body: JSON.stringify({ query, variables }),
		});

		const data = await response.json();

		// Log errors for debugging
		if (data.errors) {
			console.error('GraphQL Error:', JSON.stringify(data.errors, null, 2));
		}

		return data;
	} catch (error) {
		console.error('Network Error:', error.message);
		throw error;
	}
}

export { graphqlRequest };