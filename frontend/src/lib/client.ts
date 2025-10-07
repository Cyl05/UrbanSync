import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { supabase } from './supabaseClient';
import { ApolloLink } from '@apollo/client';

const createApolloClient = () => {
    const rawToken = localStorage.getItem('sb-bcydldqxywsmjvbyskmt-auth-token');
    const access_token = rawToken ? JSON.parse(rawToken).access_token : null;

    const httpLink = new HttpLink({ uri: import.meta.env.VITE_HASURA_GRAPHQL_URL });
    const authLink = new ApolloLink((operation, forward) => {
        operation.setContext({
            headers: {
                Authorization: access_token ? `Bearer ${access_token}` : '',
            },
        });
        return forward(operation);
    });

    console.log(access_token);

    const client = new ApolloClient({
        link: authLink.concat(httpLink),
        cache: new InMemoryCache(),
    });

    return client;
};

export { createApolloClient };
