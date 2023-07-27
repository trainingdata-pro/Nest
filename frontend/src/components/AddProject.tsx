import React, {useContext} from 'react';
import {useForm} from 'react-hook-form'
import {Project} from "../services/ProjectService";
import {Context} from "../index";
const AddProject = () => {
    const {register,getValues, handleSubmit, formState: {errors}} = useForm<Project>()
    const {store} = useContext(Context)
    function onSubmit(data:Project) {
        console.log(data)
    }
    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
            <div className="animate-in fade-in fixed inset-0 z-50 bg-white backdrop-blur-sm transition-opacity"></div>
            <div className="bg-white fixed z-50 w-full max-w-lg border bg-background p-6 opacity-100">
            <form onSubmit={handleSubmit(onSubmit)} className="grid columns-1">
                <div className="mb-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="name">Название проекта</label>
                <input className="flex h-8 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full"
                                           {...register('name' ,{required:true})}/>
                </div>
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="name">Менеджер проекта</label>
                <input className="border border-black" value={store.managerData.id} {...register('manager',{required:true})}/>

                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="name">Скорость в час</label>
                <input className="border border-b-black" {...register('speed_per_hour')}/>

                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="name">Цена за единицу для ассесора</label>
                <input className="border border-b-black" {...register('price_for_assessor')}/>

                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="name">Цена за единицу для заказчика</label>
                <input className="border border-b-black" {...register('price_for_customer')}/>

                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="name">Объем выгрузок</label>
                <input className="border border-b-black" {...register('unloading_value')}/>

                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="name">Регулярность выгрузок</label>
                <input className="border border-b-black" {...register('unloading_regularity')}/>

                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="name">Статус проекта</label>
                <input className="border border-b-black" {...register('status', {required:true})}/>

                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="name">Дата старта проекта</label>
                <input className="border border-b-black" {...register('date_of_creation')}/>

                <button className="bg-black text-white rounded-md py-2">Добавить проект</button>
            </form>
            </div>

        </div>
    );
};

export default AddProject;