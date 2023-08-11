import React, {useContext, useEffect, useMemo} from 'react';
import {Context} from "./index";
import {observer} from "mobx-react-lite";
import {BrowserRouter, Routes, Route, Navigate, useNavigate} from "react-router-dom";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import ConfirmationSignUp from "./components/SignUp/ConfirmationSignUp";
import MainPage from './pages/MainPage';
import ProfilePage from "./pages/ProfilePage";
import ProjectForm from "./components/ProjectForm";
import Loader from './components/UI/Loader';
import ProjectAssessors from "./components/ProjectAssessors";
import PersonalAccountTable from "./components/PersonalAccountTable";
import AssessorsPage from "./components/Assessors/AssessorsPage";

function App() {
    const {store} = useContext(Context)

    useMemo(()=>{
        if (localStorage.getItem('token')) {
            store.checkAuth()
        }
    },[])

    if (store.isLoading) {
        return (<Loader width={16}/>)
    }


    return (
        <div className="min-w-screen relative min-h-screen bg-gray-50">
            <BrowserRouter>
                {!store.isAuth ? <Routes>
                        <Route path={'/login'} element={<SignInPage/>}/>
                        <Route path={'/register'} element={<SignUpPage/>}/>
                        <Route path={'/signup/confirmation/:id'} element={<ConfirmationSignUp/>}/>
                        <Route path="*" element={<Navigate to="/login" replace/>}/>
                </Routes>:
                 <Routes>
                     <Route path={'/dashboard/projects'} element={<MainPage/>}/>
                     <Route path={'/profile'} element={<ProfilePage/>}/>
                     {/*<Route path={'/dashboard/projects/add_project'} element={<AddProjectPage/>}/>*/}
                     {/*<Route path={'/dashboard/projects/:id'} element={<ProjectPage/>}/>*/}
                     <Route path={'/dashboard/projects/:id/assessors'} element={<ProjectAssessors/>}/>
                     <Route path={'/dashboard/assessors'} element={<AssessorsPage/>}/>
                     {/*<Route path={'/dashboard/assessor/add_project'} element={<AddAssessorToProject id={undefined}/>}/>*!/*/}
                     {/*<Route path={'/dashboard/projects/'} element={<ProjectsPage/>}/>*/}
                     {/*<Route path={'/dashboard/projects/:id'} element={<ProjectPage/>}/>*/}
                     <Route path="*" element={<Navigate to="/dashboard/projects" replace/>}/> // TODO: redirect 404
                 </Routes>}
             </BrowserRouter>
        </div>
    );


}

export default observer(App);
