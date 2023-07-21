import React, {useContext, useEffect, useMemo} from 'react';
import SignInPage from "./components/SignIn/SignInPage";
import {Context} from "./index";
import {observer} from "mobx-react-lite";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import TeamPage from "./pages/TeamPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectPage from "./pages/ProjectPage";
import AssessorPage from "./pages/AssessorPage";
import AddAssessorToProject from "./components/AddAssessorToProject";

function App() {
    const {store} = useContext(Context)

    useMemo(()=>{
        if (localStorage.getItem('token')) {
            store.checkAuth()
        }
        console.log(store.managerData)
    },[])

    if (store.isLoading) {
        return (<div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
        </div>)
    }


    return (
        <div className="min-w-screen relative min-h-screen bg-gray-50">
            <BrowserRouter>
                {!store.isAuth ? <Routes>
                    <Route path={'/login'} element={<SignInPage/>}/>
                    <Route path="*" element={<Navigate to="/login" replace/>}/>
                </Routes>:
                <Routes>
                    <Route path={'/dashboard/team'} element={<TeamPage/>}/>
                    <Route path={'/dashboard/assessor/:id'} element={<AssessorPage/>}/>
                    {/*<Route path={'/dashboard/assessor/add_project'} element={<AddAssessorToProject id={undefined}/>}/>*/}
                    <Route path={'/dashboard/projects/'} element={<ProjectsPage/>}/>
                    <Route path={'/dashboard/projects/:id'} element={<ProjectPage/>}/>
                    <Route path="*" element={<Navigate to="/dashboard/team" replace/>}/> // TODO: redirect 404
                </Routes>}
            </BrowserRouter>
        </div>
    );


}

export default observer(App);
