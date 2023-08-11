
import React from 'react'
import SignInForm from '../components/SignIn/SignInForm';


interface ISignIn {
    username: string,
    password: string
}
const SignInPage = () => {
    return(
        <div className="flex h-screen w-screen items-center justify-center">
        <div className="space-y-4 rounded-lg border border-gray-100 bg-white">
            <div className="px-4 pt-4 text-lg font-medium">Вход</div>
            <div className="shrink-0 bg-border bg-gray-100 h-[1px] w-full"></div>
            <div className="p-4 pt-0">
                <SignInForm/>
            </div>
        </div>
    </div>
    )
}

export default SignInPage;
