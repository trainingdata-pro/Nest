import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import React, {createContext} from "react";
import "./index.css"
import RootStore from "./store/store";
import {QueryClient, QueryClientProvider} from "react-query";
import {ToastContainer} from "react-toastify";
import {Provider} from "react-redux";
import {setupStore} from "./store";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);


interface State {
    store: RootStore
}

const store1 = setupStore()
const queryClient = new QueryClient()
const store = new RootStore()
export const Context = createContext<State>({store});
root.render(
    <Provider store={store1}>
        <Context.Provider value={{store}}>
            <QueryClientProvider client={queryClient}>
                <ToastContainer />
                <React.StrictMode/>
                <App/>
            </QueryClientProvider>
        </Context.Provider>
    </Provider>

);

reportWebVitals();
