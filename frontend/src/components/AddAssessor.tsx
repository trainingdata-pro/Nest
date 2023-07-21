import React, {useContext, useState} from 'react';
import {useForm} from "react-hook-form";
import {redirect} from "react-router-dom";
import AssessorsService from "../services/AssessorsService";
import {Context} from "../index";

export interface addAssessor {
    username: string,
    last_name: string,
    first_name: string,
    middle_name: string
}

// @ts-ignore
const AddAssessor = ({setVisible}) => {
    const {
        register,
        getValues,
        handleSubmit
    } = useForm<addAssessor>()
    const [status, setStatus] = useState<string>("")
    const {store} = useContext(Context)
    const onSubmit = async () => {
        const values = getValues()
        console.log(values)
        store.addAssessor(values)
            .then(res => {
                store.setAssessors([...store.assessors, res.data])
                setVisible(false)
            })
            .catch((e) => setStatus(e.response.data.username[0]))
    }
    return (
        <div className="fixed inset-0 z-50 flex justify-end">

            <div
                className="data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-all duration-100"></div>
            <div
                className="fixed z-50 bg-white scale-100 gap-4 bg-background p-6 opacity-100 shadow-lg border animate-in slide-in-from-right h-full duration-300 w-1/3 sm:max-w-[425px]">
                <div className="flex justify-end">
                    <button onClick={() => setVisible(false)} className="text-black">&times;</button>
                </div>
                <div className="flex flex-col space-y-2 text-center sm:text-left pb-8">
                    <h2 className="text-lg font-semibold text-foreground"> Добавить исполнителя </h2>
                </div>
                <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-2">
                        <label
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"> Телеграм </label>
                        <input {...register("username")}
                               className="flex h-10 rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full bg-white"
                               placeholder="username"/>
                        <p className="text-sm h-5 text-red-500 text-muted-foreground">{status && status}</p>
                    </div>
                    <section className="grid grid-cols-3 gap-x-4">
                        <div className="space-y-2 col-span-1">
                            <label
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"> Фамилия </label>
                            <input {...register("last_name")}
                                   className="flex h-10 rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full bg-white"
                                   placeholder="Пупкин"/>
                        </div>
                        <div className="space-y-2 col-span-1">
                            <label
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"> Имя </label>
                            <input {...register("first_name")}
                                   className="flex h-10 rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full bg-white"
                                   placeholder="Василий"/>
                        </div>
                        <div className="space-y-2 col-span-1">
                            <label
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"> Отчество </label>
                            <input {...register("middle_name")}
                                   className="flex h-10 rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full bg-white"
                                   placeholder="Петрович"/>
                        </div>
                    </section>
                    <button
                        className="inline-flex bg-black text-white items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4 w-full"
                        type="submit">
                        Добавить
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddAssessor;