import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { ApolloLink } from '@apollo/client';

const createApolloClient = () => {
    const rawToken = localStorage.getItem('sb-bcydldqxywsmjvbyskmt-auth-token');
    const access_token = rawToken ? JSON.parse(rawToken).access_token : null;

    const httpLink = new HttpLink({ uri: import.meta.env.VITE_HASURA_GRAPHQL_URL });
    const authLink = new ApolloLink((operation, forward) => {
        if (access_token) {
            operation.setContext({
                headers: {
                    Authorization:`Bearer ${access_token}`,
                },
            });
        } else {
            operation.setContext({
                headers: {
                    'x-hasura-role': 'anonymous'
                },
            });
        }
        return forward(operation);
    });

    const client = new ApolloClient({
        link: authLink.concat(httpLink),
        cache: new InMemoryCache(),
    });

    return client;
};

export { createApolloClient };
