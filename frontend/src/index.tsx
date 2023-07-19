import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Store from "./store/store";
import {createContext} from "react";
import "./index.css"
import React from 'react';
import RootStore from "./store/store";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

interface State {
    store: RootStore
}

const store = new RootStore()
export const Context = createContext<State>({store});
root.render(

        <Context.Provider value={{store}}>

            <App/>

        </Context.Provider>
);

reportWebVitals();
