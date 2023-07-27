import React, {useContext, useMemo} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {useForm} from "react-hook-form";
import ManagerService from "../services/ManagerService";

const Profile = () => {
    const {store} = useContext(Context)
    const {register, getValues, handleSubmit} = useForm({
        defaultValues: useMemo(() => {
            return {
                'id': store.managerData.id,
                'last_name': store.managerData.last_name,
                'first_name': store.managerData.first_name,
                'middle_name': store.managerData.middle_name,
                'username': store.managerData.user.username,
                'operational_manager': store.managerData.operational_manager,
            };
        }, [])
    })

    function onSubmit(data: any) {
        ManagerService.patchManager(data.id, data).then(() => store.setShowProfile(false))
    }

    return (
        <div className="fixed inset-0 z-50 flex h-screen w-screen items-end justify-center sm:items-center">
            <div className="animate-in fade-in fixed inset-0 z-50 bg-white backdrop-blur-sm transition-opacity"></div>
            <div className="bg-white fixed z-50 w-full max-w-max border bg-background p-6 opacity-100">
                <form className="w-[40rem] space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <section className="grid grid-cols-3 gap-x-3">
                        <div className="col-span-1">
                            <label>Фамилия</label>
                            <input {...register('last_name')}
                                   className="flex h-8 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full"
                            />
                        </div>
                        <div className="col-span-1">
                            <label>Имя</label>
                            <input {...register('first_name')}
                                   className="flex h-8 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full"
                            />
                        </div>
                        <div className="col-span-1">
                            <label>Отчество</label>
                            <input {...register('middle_name')}
                                   className="flex h-8 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full"
                            />
                        </div>
                    </section>
                    <div>
                        <label>Ник в телеграмм</label>
                        <input disabled {...register('username')}
                               className="h-8 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full"/>
                    </div>
                    <div>
                        <label>Ответственный TeamLead</label>
                        <input
                            className="h-8 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full"/>
                    </div>
                    <div>
                        <label>ID Менеджера</label>
                        <input disabled {...register('id')}
                               className="h-8 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full"/>
                    </div>
                </form>
                <div className="mt-5 flex justify-between">
                    <button
                        className="bg-black text-white rounded-md text-sm font-medium disabled:opacity-50 transition-colors hover:bg-primary/90 h-10 py-2 px-4"
                        onClick={() => store.setShowProfile(false)}>Закрыть страницу
                    </button>
                    <button
                        className="bg-black text-white rounded-md text-sm font-medium disabled:opacity-50 transition-colors hover:bg-primary/90 h-10 py-2 px-4"
                        onClick={() => onSubmit(getValues())}>Сохранить
                    </button>
                </div>
            </div>
        </div>
    );
};

export default observer(Profile);