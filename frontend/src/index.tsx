import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Store from "./store/store";
import {createContext} from "react";
import "./index.css"
import React from 'react';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

interface State {
    store: Store
}

const store = new Store()
export const Context = createContext<State>({store});
root.render(

        <Context.Provider value={{store}}>

            <App/>

        </Context.Provider>
);

reportWebVitals();
