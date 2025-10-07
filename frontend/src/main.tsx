import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/index.ts";
import { ApolloProvider } from "@apollo/client/react";
import client from "./lib/client.ts";
import 'leaflet/dist/leaflet.css';
import './index.css';

createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
        <StrictMode>
            <ApolloProvider client={client}>
                <Provider store={store}>
                    <App />
                </Provider>
            </ApolloProvider>
        </StrictMode>
    </BrowserRouter>
);
