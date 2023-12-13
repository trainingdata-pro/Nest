import React, {useContext, useMemo} from 'react';
import {Context} from "./index";
import {observer} from "mobx-react-lite";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import SignInPage from "./components/SignIn/SignInPage";
import SignUpPage from "./components/SignUp/SignUpPage";
import ConfirmationSignUp from "./components/SignUp/ConfirmationSignUp";
import Loader from './components/UI/Loader';
import AssessorsPage from "./components/Assessors/AssessorsPage/AssessorsPage";
import PasswordReset from "./components/PasswordReset/PasswordReset";
import CompletedProjectsView from "./views/CompletedProjectsView";
import ProjectPageView from "./views/ProjectPageView";
import BlackListView from "./views/BlackListView";
import FreeResourcesView from "./views/FreeResourcesView";
import AssessorPageView from "./views/AssessorPageView";
import ProjectsView from "./views/ProjectsView";
function App() {
    const {store} = useContext(Context)
    useMemo(()=>{
        if (localStorage.getItem('token')) {
            store.checkAuth()
        }
    },[])

    if (store.isLoading) {
        return (<Loader/>)
    }
    return (
            <BrowserRouter>
                {!store.isAuth ? <Routes>
                        <Route path={'/login'} element={<SignInPage/>}/>
                        <Route path={'/register'} element={<SignUpPage/>}/>
                        <Route path={'/signup/confirmation/:id'} element={<ConfirmationSignUp/>}/>
                        <Route path={'/password/reset/:id'} element={<PasswordReset/>}/>
                        <Route path="*" element={<Navigate to="/login" replace/>}/>
                </Routes>:
                 <Routes>
                     <Route path={'/projects'} element={<ProjectsView/>}/>
                     <Route path={'/projects/completed'} element={<CompletedProjectsView/>} />
                     <Route path={'/projects/:id'} element={<ProjectPageView/>}/>
                     <Route path={'/assessors'} element={<AssessorsPage/>}/>
                     <Route path={'/assessor/:id'} element={<AssessorPageView/>}/>
                     <Route path={'/blacklist'} element={<BlackListView/>} />
                     <Route path={'/free_resources'} element={<FreeResourcesView/>}/>
                     <Route path="*" element={<Navigate to="/projects" replace/>}/>
                 </Routes>}
             </BrowserRouter>
    );


}

export default observer(App);
