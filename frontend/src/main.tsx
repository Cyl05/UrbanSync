import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/index.ts";
import { ApolloProvider } from "@apollo/client/react";
import { createApolloClient } from "./lib/client.ts";
import { AuthProvider } from "./contexts/AuthProvider.tsx";
import 'leaflet/dist/leaflet.css';
import './index.css';
import '@geoapify/geocoder-autocomplete/styles/minimal.css';

const client = createApolloClient();

createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
        <StrictMode>
            <ApolloProvider client={client}>
                <Provider store={store}>
                    <AuthProvider>
                        <App />
                    </AuthProvider>
                </Provider>
            </ApolloProvider>
        </StrictMode>
    </BrowserRouter>
);
