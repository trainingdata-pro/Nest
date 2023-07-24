import React, {useEffect} from 'react';
import {useForm} from "react-hook-form";
import AuthService from "../../services/AuthService";

interface ISignUp {
    email: string,
    username: string,
    password: string,
    password2: string

}

const SignUpForm = () => {
    const {register, handleSubmit,watch, formState: {errors}} = useForm<ISignUp>()
    const Submit = async (data: ISignUp) => {
        await AuthService.register(data.username, data.email, data.password).then(res => console.log(res.data))
    }

    return (
        <div>
            <div>
                <form className="w-[30rem]" onSubmit={handleSubmit(Submit)}>
                    <div className="">
                        <label
                            className="text-sm font-medium leading-none"
                            htmlFor="email">Почта</label>
                        <input
                            type="text"
                            className="flex h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground w-full"
                            {...register("email", {
                                required: "Обязательное поле",
                                pattern: {
                                    value: /trainingdata\.pro$/,
                                    message: "Требуется указать корпоративную почту"
                                }
                            })}
                            autoComplete="new-email"
                            placeholder="Ваша корпоративная почта"
                            aria-invalid={errors.email ? "true" : "false"}
                        ></input>
                        <p className='h-6 text-red-500 text-sm'>{errors.email && errors.email?.message}</p>

                    </div>

                    <div>
                        <label
                            className="text-sm font-medium leading-none"
                            htmlFor="username">username</label>
                        <input
                            type="text"
                            className="flex h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground w-full"
                            {...register("username", {required: "Обязательное поле"})}
                            autoComplete="new-username"
                            placeholder="Ваш ник в телеграм"
                        ></input>
                        <p className='h-6 text-red-500 text-sm'>{errors.username && errors.username?.message}</p>
                    </div>
                    <div>
                        <label
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            htmlFor="password">Пароль</label>
                        <input
                            className="flex h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground w-full"
                            type="password"
                            autoComplete="new-password"
                            {...register("password",{required: "Обязательное поле"} )}
                        ></input>
                        <p className='h-6 text-red-500 text-sm'>{errors.password && errors.password?.message}</p>
                    </div>
                    <div>
                        <label
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            htmlFor="password2">Подтверждение пароля</label>
                        <input
                            className="flex h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground w-full"
                            type="password"
                            autoComplete="new-password2"
                            {...register("password2",{required: "Обязательное поле"})}
                        ></input>
                        <p className='h-6 text-red-500 text-sm'>{watch('password') !== watch('password2') ? 'Пароли не совпадают': ''}</p>
                    </div>
                    <div>
                        <input className="w-full h-10 bg-black text-white rounded-md" type="submit" value="Регистрация"/>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignUpForm;