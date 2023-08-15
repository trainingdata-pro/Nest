import React, {useContext, useEffect, useMemo, useState} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {useForm} from "react-hook-form";
import ManagerService from "../services/ManagerService";
import {ManagerData} from "../store/store";
import {useNavigate} from "react-router-dom";
import Header from "./Header/Header";

const Profile = () => {
    const {store} = useContext(Context)
    useEffect(() => {
        ManagerService.fetchOperationsManagers().then((res) => setOperationsManagers(res.data.results));
        ManagerService.fetch_manager(store.managerData.id).then((res) => {
            setManager(res.data);
        });
    }, []);
    const navigate = useNavigate()
    const [manager, setManager] = useState<ManagerData>()
    const [operationsManagers, setOperationsManagers] = useState<ManagerData[]>([])
    const [selectedOperationsManager, setSelectedOperationsManager] = useState(store.managerData.operational_manager)
    const {register, getValues,reset, setValue, handleSubmit} = useForm(
        )
    useEffect(() => {
        setValue('id', manager?.id || '');
        setValue('last_name', manager?.last_name || '');
        setValue('first_name', manager?.first_name || '');
        setValue('middle_name', manager?.middle_name || '');
        setValue('username', manager?.user.username || '');
        setValue('operational_manager', manager?.operational_manager || '');
    }, [manager, setValue]);
    useEffect(() => {

        reset();
    }, [reset]);
    function onSubmit(data: any) {
        ManagerService.patchManager(data.id, data).then((res) => {
            store.setShowProfile(false)

        })
    }
    const handleSelectChange = (event:any) => {
        setSelectedOperationsManager(event.target.value);
    };
    // @ts-ignore
    return (
        <div className="fixed inset-0 z-50 flex h-screen w-screen items-end justify-center sm:items-center">

            <div className="animate-in fade-in fixed inset-0 z-50 bg-white backdrop-blur-sm transition-opacity">
            </div>

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
                        <input {...register('username')}
                               className="h-8 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full"/>
                    </div>
                    <div>
                        <label>Ответственный TeamLead</label>
                        <select disabled={!!manager?.operational_manager || manager?.is_operational_manager} {...register('operational_manager')} value={selectedOperationsManager} onChange={handleSelectChange}
                                className="flex h-10 rounded-md border border-input mb-2 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full max-w-[30rem] bg-white"
                        >
                            <option value="" disabled>Выберите своего начальника</option>
                            {operationsManagers.map(manager => <option key={manager.id}
                                                                       value={manager.id}>{manager.last_name} {manager.first_name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label>ID Менеджера</label>
                        <input disabled {...register('id')} value={store.managerData.id}
                               className="h-8 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full"/>
                    </div>
                </form>
                <div className="mt-5 flex justify-between">
                    <button
                        className="bg-black text-white rounded-md text-sm font-medium disabled:opacity-50 transition-colors hover:bg-primary/90 h-10 py-2 px-4"
                        onClick={() => {
                            // store.setShowProfile(false)
                            navigate(-1)
                        }}>Закрыть страницу
                    </button>
                    <button
                        className="bg-black text-white rounded-md text-sm font-medium disabled:opacity-50 transition-colors hover:bg-primary/90 h-10 py-2 px-4"
                        onClick={() => {
                            onSubmit(getValues())
                            navigate(-1)
                        }}>Сохранить
                    </button>
                </div>
            </div>
        </div>
    );
};

export default observer(Profile);