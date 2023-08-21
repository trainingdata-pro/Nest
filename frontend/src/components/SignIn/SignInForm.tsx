import {useForm} from "react-hook-form";
import React, {useEffect, useState} from "react";
import {NavLink, redirect, useLocation, useNavigate} from "react-router-dom";
import {useContext} from "react";
import {Context} from "../../index";
import {observer} from "mobx-react-lite";
import Cookies from "universal-cookie";
import AuthService from "../../services/AuthService";
import {Token} from "../../store/store";
import jwtDecode from "jwt-decode";
import ManagerService from "../../services/ManagerService";
import MyInput from "../UI/MyInput";
import MyLabel from "../UI/MyLabel";
import Error from "../UI/Error";

interface ISignIn {
    username: string,
    password: string
}

const FormRow = ({children}: { children: React.ReactNode }) => {
    return (
        <div className="my-4">{children}</div>
    );
}
const SignInForm = () => {
    const {register, formState: {errors}, getValues, handleSubmit} = useForm<ISignIn>()
    const [serverError, setServerError] = useState<string>('')
    const [isLoading, setIsLoading] = useState(false)
    const {store} = useContext(Context)
    const onSubmit = async () => {
        const values = getValues()
        setIsLoading(true)
        await store.login(values.username, values.password)
        setIsLoading(false)
    }
    return (
        <form className="w-[30rem]"
              onSubmit={handleSubmit(onSubmit)}>
            <FormRow>
                <MyLabel required={true}>Имя пользователя</MyLabel>
                <MyInput register={{...register("username", {required: "Обязательное поле"})}}
                         placeholder="username"
                         type="text"/>
                <Error>{errors.username && errors.username?.message}</Error>
            </FormRow>
            <FormRow>
                <MyLabel required={true}>Пароль</MyLabel>
                <MyInput register={{...register("password", {required: "Обязательное поле"})}}
                         placeholder="Введите ваш пароль"
                         type="password"/>
                <Error>{store.authError}</Error>
            </FormRow>
            <section className="flex justify-between items-center">
                <div className="text-sm text-gray-500">Не зарегистрированы?<NavLink
                    className="cursor-pointer pl-1 text-black text-primary hover:underline" to="/register">Создайте
                    аккаунт</NavLink>
                </div>
                <button disabled={isLoading}
                        className="bg-black text-white rounded-md text-sm font-medium disabled:opacity-50 transition-colors hover:bg-primary/90 h-10 py-2 px-4"
                        type="submit">{!isLoading ? "Войти" :
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"/>}
                </button>
            </section>
        </form>
    );
};

export default observer(SignInForm);