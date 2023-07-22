import React from 'react';
import {useForm} from "react-hook-form";
import AuthService from "../../services/AuthService";

interface ISignUp {
    email: string,
    username: string,
    password: string,
    password2: string

}
const SignUpForm = () => {
    const {register, handleSubmit} = useForm<ISignUp>()
    const Submit = async (data: ISignUp) => {
        await AuthService.register(data.username, data.email, data.password).then(res => console.log(res.data))
    }
    return (
        <div>
            <div>
                <form className="w-[30rem] space-y-8" onSubmit={handleSubmit(Submit)}>
                    <div className="m-4">
                        <label>Почта</label>
                        <input
                            type="text"
                            className="border border-b-black"
                            {...register("email")}
                            placeholder="Ваша корпоративная почта"
                        ></input>
                    </div>
                    <div className="m-4">
                        <label>Username</label>
                        <input
                            type="text"
                            className="border border-b-black"
                            {...register("username")}
                            placeholder="Ваш ник в телеграм"
                        ></input>
                    </div>
                    <div className="m-4">
                        <label>Пароль</label>
                        <input
                            className="border border-b-black"
                            type="password"
                            {...register("password")}
                        ></input>
                    </div>
                    <div className="m-4">
                        <label>Пароль еще раз</label>
                        <input
                            className="border border-b-black"
                            type="password"
                            {...register("password2")}
                        ></input>
                    </div>
                    <div>
                        <button type="submit">Регистрация</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignUpForm;