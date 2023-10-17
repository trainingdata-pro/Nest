import React, {useContext, useMemo} from 'react';
import {Context} from "./index";
import {observer} from "mobx-react-lite";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import ConfirmationSignUp from "./components/SignUp/ConfirmationSignUp";
import MainPage from './pages/MainPage';
import Loader from './components/UI/Loader';
import ProjectAssessors from "./components/Projects/ProjectAssessors";
import AssessorsPage from "./components/Assessors/AssessorsPage";
import AssessorPage from './components/Assessors/AssessorPage';
import CompletedProjects from "./pages/CompletedProjects";
import BlackList from "./components/BlackList/BlackList";
import FreeResourcePage from "./pages/FreeResourcePage";
import RentAssessor from "./components/AssessorManagement/RentAssessor";
import RentAssessors from './components/Assessors/RentAssessors';
import Export from "./components/Projects/Export";

function App() {
    const {store} = useContext(Context)

    useMemo(()=>{
        if (localStorage.getItem('token')) {
            store.checkAuth()
        }
    },[])

    if (store.isLoading) {
        return (<Loader width={"16"}/>)
    }


    return (
            <BrowserRouter>
                {!store.isAuth ? <Routes>
                        <Route path={'/login'} element={<SignInPage/>}/>
                        <Route path={'/register'} element={<SignUpPage/>}/>
                        <Route path={'/signup/confirmation/:id'} element={<ConfirmationSignUp/>}/>
                        <Route path="*" element={<Navigate to="/login" replace/>}/>
                </Routes>:
                 <Routes>
                     <Route path={'/dashboard/projects'} element={<MainPage/>}/>
                     <Route path={'/dashboard/projects/:id/assessors'} element={<ProjectAssessors/>}/>
                     <Route path={'/dashboard/assessors/my'} element={<AssessorsPage/>}/>
                     <Route path={'/dashboard/assessors/rent'} element={<RentAssessors/>}/>
                     <Route path={'/assessor/:id'} element={<AssessorPage/>}/>
                     <Route path={'/dashboard/projects/free'} element={<CompletedProjects/>} />
                     <Route path={'/assessors/blacklist'} element={<BlackList/>} />
                     <Route path={'/assessors/free_resources'} element={<FreeResourcePage/>}/>
                     <Route path="*" element={<Navigate to="/dashboard/projects" replace/>}/> // TODO: redirect 404

                 </Routes>}
             </BrowserRouter>
    );


}

export default observer(App);
