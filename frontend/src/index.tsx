import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {createContext} from "react";
import "./index.css"
import React from 'react';
import RootStore from "./store/store";
import {QueryClient, QueryClientProvider} from "react-query";
import {ToastContainer} from "react-toastify";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);


interface State {
    store: RootStore
}

const queryClient = new QueryClient()
const store = new RootStore()
export const Context = createContext<State>({store});
root.render(
    <Context.Provider value={{store}}>
        <QueryClientProvider client={queryClient}>
            <ToastContainer />
            <App/>
        </QueryClientProvider>
    </Context.Provider>
);

reportWebVitals();
