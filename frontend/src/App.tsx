import React, {useContext, useMemo} from 'react';
import {Context} from "./index";
import {observer} from "mobx-react-lite";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import ConfirmationSignUp from "./components/SignUp/ConfirmationSignUp";
import MainPage from './components/Projects/Projects/MainPage';
import Loader from './components/UI/Loader';
import ProjectPage from "./components/Projects/ProjectPage/ProjectPage";
import AssessorsPage from "./components/Assessors/AssessorsPage/AssessorsPage";
import AssessorPage from './components/Assessors/AssessorPage/AssessorPage';
import CompletedProjects from "./components/Projects/CompletedProjects/CompletedProjects";
import BlackList from "./components/BlackList/BlackList";
import FreeResourcePage from "./pages/FreeResourcePage";
import PasswordReset from "./components/PasswordReset/PasswordReset";
import {useQuery} from "react-query";

function App() {
    const {store} = useContext(Context)
    const checkAuth = useQuery('auth', () => store.checkAuth(), {
        enabled: !!localStorage.getItem('token'),
        refetchOnWindowFocus:false
    })
    // useMemo(()=>{
    //     if (localStorage.getItem('token')) {
    //         store.checkAuth()
    //     }
    // },[])

    if (store.isLoading) {
        return (<Loader width={"16"}/>)
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
                     <Route path={'/projects'} element={<MainPage/>}/>
                     <Route path={'/projects/completed'} element={<CompletedProjects/>} />
                     <Route path={'/projects/:id/assessors'} element={<ProjectPage/>}/>
                     <Route path={'/assessors'} element={<AssessorsPage/>}/>
                     <Route path={'/assessor/:id'} element={<AssessorPage/>}/>
                     <Route path={'/blacklist'} element={<BlackList/>} />
                     <Route path={'/free_resources'} element={<FreeResourcePage/>}/>
                     <Route path="*" element={<Navigate to="/projects" replace/>}/>

                 </Routes>}
             </BrowserRouter>
    );


}

export default observer(App);
