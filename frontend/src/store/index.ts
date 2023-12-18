import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {projectAPI} from "../services/project";


const rootReducer = combineReducers({
    [projectAPI.reducerPath]: projectAPI.reducer
})

export const setupStore = () => {
    return configureStore({
        devTools: true,
        reducer: rootReducer,
        middleware: getDefaultMiddleware => getDefaultMiddleware().concat(projectAPI.middleware)
    })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']