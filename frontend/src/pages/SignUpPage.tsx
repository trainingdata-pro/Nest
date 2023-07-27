import { observer } from 'mobx-react-lite';
import React from 'react'
import SignUpForm from "../components/SignUp/SignUpForm";

const SignInPage = () => {
    return (
        <div className="flex h-screen w-screen items-center justify-center">
            <div className="space-y-4 rounded-lg border border-gray-100 bg-white">
                <div className="px-4 pt-4 text-lg font-medium">Регистрация</div>
                <div className="shrink-0 bg-border bg-gray-100 h-[1px] w-full"></div>
                <div className="p-4 pt-0">
                    <SignUpForm />
                </div>
            </div>
        </div>
    )
}

export default observer(SignInPage);